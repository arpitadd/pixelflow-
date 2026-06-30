// Shared TypeScript types for the entire application

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profileImage?: string;
  followers?: string[];
  following?: string[];
  isFollowing?: boolean; // injected by profile API for the viewer's perspective
  createdAt: string;
}

export interface IPost {
  _id: string;
  image: string;
  mediaType: "image" | "video";
  caption?: string;
  author: IUser;
  likes: string[]; // array of user IDs
  comments: IComment[];
  createdAt: string;
}

export interface IComment {
  _id: string;
  post: string;
  user: IUser;
  text: string;
  createdAt: string;
}

// API response wrapper type
export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Auth context type
export interface AuthUser {
  userId: string;
  email: string;
  username: string;
}
