import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/Comment";
import "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { createPostSchema } from "@/schemas";
import { POSTS_PER_PAGE } from "@/constants";

// GET /api/posts - Get feed posts with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const skip = (page - 1) * POSTS_PER_PAGE;

    const posts = await Post.find()
      .populate("author", "name username profileImage")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name username profileImage" },
        options: { sort: { createdAt: -1 }, limit: 3 },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(POSTS_PER_PAGE);

    const total = await Post.countDocuments();

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        totalPages: Math.ceil(total / POSTS_PER_PAGE),
        hasMore: skip + posts.length < total,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const jwtUser = await getCurrentUser();
    if (!jwtUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const post = await Post.create({
      image: result.data.image,
      mediaType: result.data.mediaType ?? "image",
      caption: result.data.caption ?? "",
      author: jwtUser.userId,
    });

    const populated = await post.populate("author", "name username profileImage");

    return NextResponse.json({ success: true, data: populated, message: "Post created" }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
