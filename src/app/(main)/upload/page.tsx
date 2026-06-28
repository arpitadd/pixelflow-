"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";
import { API_ROUTES, ROUTES } from "@/constants";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"];

type MediaType = "image" | "video";

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [caption, setCaption] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast("Unsupported file type. Use JPG, PNG, WebP, GIF, MP4, WebM, or MOV.", "error");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const limitLabel = isVideo ? "100MB" : "10MB";

    if (file.size > maxSize) {
      toast(`File too large. Max size is ${limitLabel}.`, "error");
      return;
    }

    // Revoke previous object URL to avoid memory leaks
    if (preview) URL.revokeObjectURL(preview);

    setSelectedFile(file);
    setMediaType(isVideo ? "video" : "image");
    setPreview(URL.createObjectURL(file));
  }, [preview]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return toast("Please select a photo or video", "error");

    setUploading(true);
    setUploadProgress(10);

    try {
      // Step 1: Upload file to Cloudinary via our API
      toast("Uploading to cloud... ☁️", "info");
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadProgress(30);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(70);
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        toast(uploadData.error ?? "Upload failed", "error");
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      // Step 2: Save post to database with the Cloudinary URL
      setUploadProgress(85);
      const postRes = await fetch(API_ROUTES.POSTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadData.data.url,
          mediaType: uploadData.data.mediaType,
          caption,
        }),
      });

      setUploadProgress(100);
      const postData = await postRes.json();

      if (postData.success) {
        toast("Post shared successfully! 🎉", "success");
        router.push(ROUTES.FEED);
      } else {
        toast(postData.error ?? "Failed to save post", "error");
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Upload</h1>
        <p className="text-base-content/60 text-sm mt-1">Share a photo or video with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Drop Zone */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
            uploading ? "cursor-not-allowed opacity-70" :
            dragOver ? "border-primary bg-primary/5 scale-[1.01] cursor-copy" :
            preview ? "border-base-300 cursor-pointer" :
            "border-base-300 hover:border-primary/50 hover:bg-base-200/50 cursor-pointer"
          }`}
        >
          {preview ? (
            <div className="relative aspect-square w-full bg-black">
              {mediaType === "video" ? (
                <video
                  src={preview}
                  controls
                  className="w-full h-full object-contain"
                  style={{ maxHeight: "500px" }}
                />
              ) : (
                <Image src={preview} alt="Preview" fill className="object-contain" />
              )}
              {/* Change overlay */}
              {!uploading && (
                <div
                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white text-sm font-medium">Change {mediaType}</span>
                </div>
              )}
              {/* File info badge */}
              <div className="absolute top-3 left-3 badge badge-neutral gap-1 text-xs">
                {mediaType === "video" ? "🎬" : "🖼️"} {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(1) + "MB" : ""}
              </div>
            </div>
          ) : (
            <div className="aspect-square flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-base-content/70">Drag & drop or click to upload</p>
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {["JPG", "PNG", "WebP", "GIF"].map(f => (
                    <span key={f} className="badge badge-outline badge-sm text-xs">📷 {f}</span>
                  ))}
                  {["MP4", "WebM", "MOV"].map(f => (
                    <span key={f} className="badge badge-outline badge-sm text-xs">🎬 {f}</span>
                  ))}
                </div>
                <p className="text-xs text-base-content/30 mt-2">Images up to 10MB · Videos up to 100MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-base-content/60">
              <span>
                {uploadProgress < 70 ? "Uploading to cloud..." :
                 uploadProgress < 90 ? "Processing..." : "Almost done..."}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <progress className="progress progress-primary w-full" value={uploadProgress} max="100" />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
          disabled={uploading}
        />

        {/* Caption */}
        <div className="form-control">
          <label className="label" htmlFor="caption">
            <span className="label-text font-medium">Caption</span>
            <span className="label-text-alt text-base-content/40">{caption.length}/2200</span>
          </label>
          <textarea
            id="caption"
            placeholder="Write a caption... #photography #travel"
            className="textarea textarea-bordered resize-none h-28 text-sm"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={2200}
            disabled={uploading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={clearFile}
            className="btn btn-ghost flex-1"
            disabled={uploading || !selectedFile}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="btn btn-primary flex-1 gap-2"
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Uploading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Share {mediaType === "video" ? "Video" : "Photo"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
