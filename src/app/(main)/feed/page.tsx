"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { IPost } from "@/types";
import { PostCard } from "@/components/post/PostCard";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import { API_ROUTES, ROUTES } from "@/constants";

type FeedTab = "following" | "explore";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("following");
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmptyFollowing, setIsEmptyFollowing] = useState(false);

  const fetchPosts = useCallback(async (pageNum: number, tab: FeedTab, replace = false) => {
    try {
      const url =
        tab === "following"
          ? `${API_ROUTES.POSTS}?feed=following&page=${pageNum}`
          : `${API_ROUTES.POSTS}?page=${pageNum}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        if (data.isEmpty) {
          setIsEmptyFollowing(true);
          setPosts([]);
        } else {
          setIsEmptyFollowing(false);
          if (replace) {
            setPosts(data.data);
          } else {
            setPosts((prev) => [...prev, ...data.data]);
          }
          setHasMore(data.pagination.hasMore);
        }
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Reset & reload when tab changes
  useEffect(() => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    setIsEmptyFollowing(false);
    fetchPosts(1, activeTab, true);
  }, [activeTab, fetchPosts]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, activeTab);
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-base-200 p-1 rounded-xl border border-base-300">
        <button
          id="feed-tab-following"
          onClick={() => setActiveTab("following")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === "following"
              ? "bg-base-100 shadow text-base-content"
              : "text-base-content/50 hover:text-base-content"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Following
        </button>
        <button
          id="feed-tab-explore"
          onClick={() => setActiveTab("explore")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === "explore"
              ? "bg-base-100 shadow text-base-content"
              : "text-base-content/50 hover:text-base-content"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
          Explore
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty Following State */}
      {!loading && activeTab === "following" && isEmptyFollowing && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-base-200 border border-base-300 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold">Your following feed is empty</h2>
            <p className="text-sm text-base-content/50 max-w-xs">
              Follow some creators to see their posts here. Discover people on the Explore tab or Search.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("explore")}
              className="btn btn-primary btn-sm"
            >
              Browse Explore
            </button>
            <Link href={ROUTES.SEARCH} className="btn btn-outline btn-sm">
              Search People
            </Link>
          </div>
        </div>
      )}

      {/* Empty Explore State */}
      {!loading && activeTab === "explore" && posts.length === 0 && !isEmptyFollowing && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="text-6xl">📷</div>
          <h2 className="text-xl font-bold">No posts yet</h2>
          <p className="text-base-content/60">Be the first to share a photo!</p>
        </div>
      )}

      {/* Posts */}
      {!loading && posts.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
}
