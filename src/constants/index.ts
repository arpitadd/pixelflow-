export const APP_NAME = "PixelFlow";
export const APP_DESCRIPTION = "A modern photography community platform";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FEED: "/feed",
  PROFILE: (username: string) => `/profile/${username}`,
  POST: (id: string) => `/post/${id}`,
  UPLOAD: "/upload",
  SEARCH: "/search",
  SETTINGS: "/settings",
} as const;

export const API_ROUTES = {
  SIGNUP: "/api/auth/signup",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  ME: "/api/auth/me",
  USERS: "/api/users",
  USER_BY_USERNAME: (username: string) => `/api/users/${username}`,
  POSTS: "/api/posts",
  POST_BY_ID: (id: string) => `/api/posts/${id}`,
  LIKE_POST: (id: string) => `/api/posts/${id}/like`,
  COMMENTS: (postId: string) => `/api/comments/${postId}`,
  DELETE_COMMENT: (commentId: string) => `/api/comments/${commentId}`,
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const POSTS_PER_PAGE = 12;
