"use client";

import { useEffect, useState, useCallback } from "react";
import { IPost } from "@/types";
import { PostCard } from "@/components/post/PostCard";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import { API_ROUTES } from "@/constants";
import type { Metadata } from "next";

export default function FeedPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (pageNum: number, replace = false) => {
    try {
      const res = await fetch(`${API_ROUTES.POSTS}?page=${pageNum}`);
      const data = await res.json();
      if (data.success) {
        if (replace) {
          setPosts(data.data);
        } else {
          setPosts((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.pagination.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="text-6xl">📷</div>
        <h2 className="text-xl font-bold">No posts yet</h2>
        <p className="text-base-content/60">Be the first to share a photo!</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-xl font-bold text-base-content/80">Your Feed</h1>

      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDelete={handlePostDelete} />
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="btn btn-outline btn-sm self-center px-8"
        >
          {loadingMore ? <span className="loading loading-spinner loading-xs" /> : "Load More"}
        </button>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-base-content/40 pb-6">
          You&apos;ve seen all posts ✨
        </p>
      )}
    </div>
  );
}
