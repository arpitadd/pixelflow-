"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IPost } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";
import { API_ROUTES, ROUTES } from "@/constants";
import { timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editCaption, setEditCaption] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(API_ROUTES.POST_BY_ID(id));
        const data = await res.json();
        if (!data.success) return notFound();
        setPost(data.data);
        setLiked(user ? data.data.likes.includes(user._id) : false);
        setLikesCount(data.data.likes.length);
        setEditCaption(data.data.caption);
      } catch {
        notFound();
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return toast("Please login to like posts", "error");
    try {
      const res = await fetch(API_ROUTES.LIKE_POST(id), { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLiked(data.data.liked);
        setLikesCount(data.data.likesCount);
      }
    } catch {
      toast("Failed to like post", "error");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;
    setSubmitting(true);
    try {
      const res = await fetch(API_ROUTES.COMMENTS(id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();
      if (data.success) {
        setPost((prev) => prev ? { ...prev, comments: [data.data, ...prev.comments] } : prev);
        setCommentText("");
      } else {
        toast(data.error, "error");
      }
    } catch {
      toast("Failed to add comment", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/delete/${commentId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPost((prev) => prev ? { ...prev, comments: prev.comments.filter((c) => c._id !== commentId) } : prev);
      }
    } catch {
      toast("Failed to delete comment", "error");
    }
  };

  const handleSaveCaption = async () => {
    if (!post) return;
    try {
      const res = await fetch(API_ROUTES.POST_BY_ID(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: editCaption }),
      });
      const data = await res.json();
      if (data.success) {
        setPost((prev) => prev ? { ...prev, caption: editCaption } : prev);
        setEditing(false);
        toast("Caption updated!", "success");
      }
    } catch {
      toast("Failed to update caption", "error");
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      const res = await fetch(API_ROUTES.POST_BY_ID(id), { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast("Post deleted", "success");
        router.push(ROUTES.FEED);
      }
    } catch {
      toast("Failed to delete post", "error");
    }
  };

  if (loading) return <PostCardSkeleton />;
  if (!post) return null;

  const isOwner = user?._id === post.author._id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-200 border border-base-300 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image / Video */}
          <div className="relative lg:w-1/2 aspect-square bg-black flex items-center justify-center">
            {post.mediaType === "video" ? (
              <video
                src={post.image}
                className="w-full h-full object-contain"
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
              />
            ) : (
              <Image src={post.image} alt={post.caption || "Post"} fill className="object-contain" />
            )}
          </div>

          {/* Details */}
          <div className="lg:w-1/2 flex flex-col max-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <Link href={ROUTES.PROFILE(post.author.username)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar src={post.author.profileImage} name={post.author.name} size="sm" />
                <div>
                  <p className="font-semibold text-sm">{post.author.name}</p>
                  <p className="text-xs text-base-content/50">@{post.author.username}</p>
                </div>
              </Link>

              {isOwner && (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                    </svg>
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-40 p-2 shadow-xl border border-base-300">
                    <li><button onClick={() => setEditing(true)}>Edit Caption</button></li>
                    <li><button onClick={handleDeletePost} className="text-error">Delete Post</button></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {/* Caption */}
              {editing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered input-sm flex-1"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    maxLength={2200}
                  />
                  <button onClick={handleSaveCaption} className="btn btn-primary btn-sm">Save</button>
                  <button onClick={() => setEditing(false)} className="btn btn-ghost btn-sm">Cancel</button>
                </div>
              ) : post.caption ? (
                <div className="flex items-start gap-2">
                  <Avatar src={post.author.profileImage} name={post.author.name} size="xs" />
                  <div className="bg-base-300 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold">{post.author.username}</p>
                    <p className="text-xs text-base-content/70 mt-0.5">{post.caption}</p>
                  </div>
                </div>
              ) : null}

              {post.comments.length === 0 && (
                <p className="text-xs text-base-content/40 text-center py-4">No comments yet.</p>
              )}

              {post.comments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-2 group">
                  <Avatar src={comment.user.profileImage} name={comment.user.name} size="xs" />
                  <div className="flex-1 bg-base-300 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold">{comment.user.username}</p>
                    <p className="text-xs text-base-content/70">{comment.text}</p>
                  </div>
                  {user?._id === comment.user._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                    >×</button>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="border-t border-base-300 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`btn btn-ghost btn-sm gap-1 ${liked ? "text-error" : "text-base-content/60"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs font-semibold">{likesCount} likes</span>
                </button>
                <span className="text-xs text-base-content/30 ml-auto">{timeAgo(post.createdAt)}</span>
              </div>

              {user && (
                <form onSubmit={handleComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="input input-bordered input-sm flex-1 text-sm"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={submitting || !commentText.trim()}
                  >
                    Post
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
