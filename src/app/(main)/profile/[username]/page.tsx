"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IUser, IPost } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";
import { timeAgo } from "@/lib/utils";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.data.user);
          setPosts(data.data.posts);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  const isOwnProfile = currentUser?.username === username;

  if (loading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold">User not found</h2>
        <Link href={ROUTES.SEARCH} className="btn btn-primary btn-sm">Search users</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {/* Profile Header */}
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body p-6 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar src={profile.profileImage} name={profile.name} size="xl" />

            <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-base-content/50 text-sm">@{profile.username}</p>
                </div>
                {isOwnProfile && (
                  <Link href={ROUTES.SETTINGS} className="btn btn-outline btn-sm sm:ml-auto">
                    Edit Profile
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center sm:justify-start gap-6 py-2">
                <div className="text-center">
                  <p className="font-bold text-lg leading-none">{posts.length}</p>
                  <p className="text-xs text-base-content/50 mt-1">Posts</p>
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-base-content/70 max-w-md">{profile.bio}</p>
              )}
              <p className="text-xs text-base-content/30">
                Joined {timeAgo(profile.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="text-5xl">📷</div>
          <p className="text-base-content/60">
            {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
          </p>
          {isOwnProfile && (
            <Link href={ROUTES.UPLOAD} className="btn btn-primary btn-sm">Upload your first photo</Link>
          )}
        </div>
      ) : (
        <>
          <h2 className="text-sm font-semibold text-base-content/50 uppercase tracking-wider">Posts</h2>
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <button
                key={post._id}
                onClick={() => setSelectedPost(post)}
                className="relative aspect-square group overflow-hidden rounded-sm bg-base-300"
              >
                <Image
                  src={post.image}
                  alt={post.caption || "Post"}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:brightness-75 transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-1 text-white text-sm font-semibold drop-shadow">
                    ❤️ {post.likes.length}
                  </span>
                  <span className="flex items-center gap-1 text-white text-sm font-semibold drop-shadow">
                    💬 {post.comments.length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg p-0 overflow-hidden">
            <div className="relative aspect-square w-full bg-base-300">
              <Image src={selectedPost.image} alt={selectedPost.caption || "Post"} fill className="object-cover" />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar src={profile.profileImage} name={profile.name} size="xs" />
                  <span className="font-semibold text-sm">{profile.username}</span>
                </div>
                <span className="text-xs text-base-content/40">{timeAgo(selectedPost.createdAt)}</span>
              </div>
              {selectedPost.caption && (
                <p className="text-sm text-base-content/70">{selectedPost.caption}</p>
              )}
              <div className="flex gap-4 text-sm text-base-content/50">
                <span>❤️ {selectedPost.likes.length} likes</span>
                <span>💬 {selectedPost.comments.length} comments</span>
              </div>
              <Link href={ROUTES.POST(selectedPost._id)} className="btn btn-primary btn-sm mt-1">
                View Full Post
              </Link>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedPost(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
