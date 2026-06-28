import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type MediaType = "image" | "video";

export interface UploadResult {
  url: string;
  publicId: string;
  mediaType: MediaType;
  width?: number;
  height?: number;
  duration?: number; // for videos, in seconds
}

/**
 * Upload a file buffer to Cloudinary.
 * Supports both images and videos.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string,
  resourceType: "image" | "video" | "auto" = "auto"
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "pixelflow",
        resource_type: resourceType,
        // For images: auto-quality and format optimization
        // For videos: auto-quality
        quality: "auto",
        fetch_format: resourceType === "image" ? "auto" : undefined,
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          mediaType: result.resource_type === "video" ? "video" : "image",
          width: result.width,
          height: result.height,
          duration: result.duration,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Delete a resource from Cloudinary by publicId.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export { cloudinary };
