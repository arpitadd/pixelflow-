"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "@/hooks/useToast";
import { ROUTES } from "@/constants";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    username: user?.username ?? "",
    bio: user?.bio ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"profile" | "account">("profile");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast("Profile updated successfully!", "success");
        await refreshUser();
        // If username changed, redirect to new profile URL
        if (form.username !== user.username) {
          router.push(ROUTES.PROFILE(form.username));
        }
      } else {
        toast(data.error ?? "Update failed", "error");
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-base-content/60 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200">
        <button
          role="tab"
          className={`tab ${tab === "profile" ? "tab-active" : ""}`}
          onClick={() => setTab("profile")}
        >
          Profile
        </button>
        <button
          role="tab"
          className={`tab ${tab === "account" ? "tab-active" : ""}`}
          onClick={() => setTab("account")}
        >
          Account
        </button>
      </div>

      {tab === "profile" && (
        <form onSubmit={handleSave} className="card bg-base-200 border border-base-300">
          <div className="card-body gap-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar src={user.profileImage} name={user.name} size="lg" />
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-base-content/50">@{user.username}</p>
              </div>
            </div>

            <div className="divider my-0" />

            {/* Name */}
            <div className="form-control">
              <label className="label" htmlFor="settings-name">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                id="settings-name"
                name="name"
                type="text"
                className="input input-bordered"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            {/* Username */}
            <div className="form-control">
              <label className="label" htmlFor="settings-username">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="input input-bordered flex items-center gap-2">
                <span className="text-base-content/40">@</span>
                <input
                  id="settings-username"
                  name="username"
                  type="text"
                  className="flex-1 bg-transparent outline-none"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="[a-z0-9_.]+"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label" htmlFor="settings-bio">
                <span className="label-text font-medium">Bio</span>
                <span className="label-text-alt text-base-content/40">{form.bio.length}/200</span>
              </label>
              <textarea
                id="settings-bio"
                name="bio"
                className="textarea textarea-bordered resize-none h-24 text-sm"
                placeholder="Tell people a little about yourself..."
                value={form.bio}
                onChange={handleChange}
                maxLength={200}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {tab === "account" && (
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body gap-4">
            <div>
              <h3 className="font-semibold">Email Address</h3>
              <p className="text-sm text-base-content/60 mt-1">{user.email}</p>
              <p className="text-xs text-base-content/30 mt-1">Email changes are not supported yet</p>
            </div>

            <div className="divider my-0" />

            <div>
              <h3 className="font-semibold text-error">Danger Zone</h3>
              <p className="text-sm text-base-content/60 mt-1 mb-3">
                Actions here cannot be undone.
              </p>
              <button onClick={logout} className="btn btn-error btn-outline btn-sm">
                Logout from all devices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
