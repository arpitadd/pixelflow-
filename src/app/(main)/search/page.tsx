"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IUser } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { API_ROUTES, ROUTES } from "@/constants";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    // Debounce: wait 400ms after user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch(`${API_ROUTES.USERS}?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) setResults(data.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-base-content/60 text-sm mt-1">Find photographers by name or username</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search people..."
          className="input input-bordered w-full pl-12 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {loading && (
          <span className="loading loading-spinner loading-xs absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40" />
        )}
      </div>

      {/* Results */}
      <div className="flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
          ))
        ) : results.length > 0 ? (
          results.map((user) => (
            <Link
              key={user._id}
              href={ROUTES.PROFILE(user.username)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors group"
            >
              <Avatar src={user.profileImage} name={user.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-xs text-base-content/50">@{user.username}</p>
                {user.bio && (
                  <p className="text-xs text-base-content/40 truncate mt-0.5">{user.bio}</p>
                )}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/30 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))
        ) : searched && query && !loading ? (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <div className="text-4xl">😕</div>
            <p className="font-medium">No users found for &quot;{query}&quot;</p>
            <p className="text-sm text-base-content/50">Try a different name or username</p>
          </div>
        ) : !query ? (
          <div className="flex flex-col items-center py-16 gap-3 text-center text-base-content/40">
            <div className="text-4xl">🔍</div>
            <p className="text-sm">Start typing to discover photographers</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
