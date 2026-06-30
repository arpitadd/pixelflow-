"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IPost } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { FollowButton } from "@/components/ui/FollowButton";
import { timeAgo } from "@/lib/utils";
import { API_ROUTES, ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";

interface PostCardProps {
  post: IPost;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(user ? post.likes.includes(user._id) : false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const isOwner = user?._id === post.author._id;

  const handleLike = async () => {
    if (!user) return toast("Please login to like posts", "error");
    setIsLiking(true);
    try {
      const res = await fetch(API_ROUTES.LIKE_POST(post._id), { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLiked(data.data.liked);
        setLikesCount(data.data.likesCount);
      }
    } catch {
      toast("Failed to like post", "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) return toast("Please login to comment", "error");
    setIsCommenting(true);
    try {
      const res = await fetch(API_ROUTES.COMMENTS(post._id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.data, ...prev]);
        setCommentText("");
        toast("Comment added!", "success");
      } else {
        toast(data.error, "error");
      }
    } catch {
      toast("Failed to add comment", "error");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/delete/${commentId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast("Comment deleted", "success");
      }
    } catch {
      toast("Failed to delete comment", "error");
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(API_ROUTES.POST_BY_ID(post._id), { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast("Post deleted", "success");
        onDelete?.(post._id);
      }
    } catch {
      toast("Failed to delete post", "error");
    }
  };

  return (
    <article className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow border border-base-300">
      {/* Post Header */}
      <div className="card-body p-4 pb-0 gap-0">
        <div className="flex items-center justify-between mb-3">
          <Link href={ROUTES.PROFILE(post.author.username)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar src={post.author.profileImage} name={post.author.name} size="sm" />
            <div>
              <p className="font-semibold text-sm leading-tight">{post.author.name}</p>
              <p className="text-xs text-base-content/50">@{post.author.username} · {timeAgo(post.createdAt)}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            {/* Inline follow button — only for other users not yet followed */}
            {!isOwner && !isFollowingAuthor && (
              <FollowButton
                username={post.author.username}
                initialIsFollowing={false}
                size="sm"
                onToggle={(following) => {
                  if (following) setIsFollowingAuthor(true);
                }}
              />
            )}

            {isOwner && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-40 p-2 shadow-xl border border-base-300">
                  <li>
                    <Link href={ROUTES.POST(post._id)} className="text-sm">View Post</Link>
                  </li>
                  <li>
                    <button onClick={handleDeletePost} className="text-error text-sm">Delete</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Image / Video */}
      <Link href={ROUTES.POST(post._id)}>
        <div className="relative aspect-square mx-4 rounded-xl overflow-hidden bg-base-300 flex items-center justify-center">
          {post.mediaType === "video" ? (
            <video
              src={post.image}
              className="w-full h-full object-contain"
              controls
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
            />
          ) : (
            <Image
              src={post.image}
              alt={post.caption || "PixelFlow post"}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
      </Link>

      <div className="card-body p-4 pt-3 gap-2">
        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`btn btn-ghost btn-sm gap-1 ${liked ? "text-error" : "text-base-content/60"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-semibold">{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments((v) => !v)}
            className="btn btn-ghost btn-sm gap-1 text-base-content/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs font-semibold">{comments.length}</span>
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-base-content/80 leading-relaxed">
            <span className="font-semibold text-base-content">{post.author.username}</span>{" "}
            {post.caption}
          </p>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-base-300 pt-3 mt-1 flex flex-col gap-3">
            {/* Comment Input */}
            {user && (
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="input input-bordered input-sm flex-1 text-sm"
                  maxLength={500}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={isCommenting || !commentText.trim()}>
                  Post
                </button>
              </form>
            )}

            {/* Comments List */}
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-xs text-base-content/40 text-center py-2">No comments yet. Be first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-2 group">
                    <Avatar src={comment.user.profileImage} name={comment.user.name} size="xs" />
                    <div className="flex-1 bg-base-300 rounded-lg px-3 py-2">
                      <p className="text-xs font-semibold">{comment.user.username}</p>
                      <p className="text-xs text-base-content/70">{comment.text}</p>
                    </div>
                    {user?._id === comment.user._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
