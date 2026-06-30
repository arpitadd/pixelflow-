"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_ROUTES } from "@/constants";
import { toast } from "@/hooks/useToast";

interface FollowButtonProps {
  username: string;
  initialIsFollowing: boolean;
  onToggle?: (isFollowing: boolean, followersCount: number) => void;
  size?: "sm" | "md";
}

export function FollowButton({
  username,
  initialIsFollowing,
  onToggle,
  size = "sm",
}: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  // Don't render the button on your own profile
  if (!user || user.username === username) return null;

  const handleToggle = async () => {
    setLoading(true);
    // Optimistic update
    const optimisticState = !isFollowing;
    setIsFollowing(optimisticState);

    try {
      const res = await fetch(API_ROUTES.FOLLOW_USER(username), { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setIsFollowing(data.data.following);
        onToggle?.(data.data.following, data.data.followersCount);
      } else {
        // Revert on failure
        setIsFollowing(!optimisticState);
        toast(data.error ?? "Failed to update follow", "error");
      }
    } catch {
      setIsFollowing(!optimisticState);
      toast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const btnSize = size === "md" ? "btn-md" : "btn-sm";

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`btn ${btnSize} transition-all duration-200 ${
        isFollowing
          ? "btn-outline border-base-content/30 text-base-content/70 hover:btn-error hover:border-error"
          : "btn-primary"
      }`}
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs" />
      ) : isFollowing ? (
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Following
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Follow
        </span>
      )}
    </button>
  );
}
