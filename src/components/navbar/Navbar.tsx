"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { APP_NAME, ROUTES } from "@/constants";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-40 px-4">
      {/* Logo */}
      <div className="navbar-start">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-primary-content font-bold text-sm">PF</span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Search (desktop) */}
      <div className="navbar-center hidden md:flex">
        {user && (
          <Link href={ROUTES.SEARCH} className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search people...
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="navbar-end gap-2">
        {loading ? (
          <div className="skeleton w-8 h-8 rounded-full" />
        ) : user ? (
          <>
            <Link href={ROUTES.UPLOAD} className="btn btn-primary btn-sm hidden sm:flex gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload
            </Link>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <Avatar src={user.profileImage} name={user.name} size="sm" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-50 w-52 p-2 shadow-xl border border-base-300 mt-2">
                <li className="menu-title px-3 py-1">
                  <div className="flex flex-col">
                    <span className="font-semibold text-base-content text-sm">{user.name}</span>
                    <span className="text-xs text-base-content/50">@{user.username}</span>
                  </div>
                </li>
                <div className="divider my-0" />
                <li>
                  <Link href={ROUTES.PROFILE(user.username)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.UPLOAD}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Photo
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.SETTINGS}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                </li>
                <div className="divider my-0" />
                <li>
                  <button onClick={logout} className="text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link href={ROUTES.LOGIN} className="btn btn-ghost btn-sm">Login</Link>
            <Link href={ROUTES.SIGNUP} className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
