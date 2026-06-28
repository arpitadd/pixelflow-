import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";

// POST /api/posts/[id]/like - Toggle like on a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const jwtUser = await getCurrentUser();
    if (!jwtUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const userId = jwtUser.userId;
    const isLiked = post.likes.some((like) => like.toString() === userId);

    if (isLiked) {
      // Unlike: remove user ID from likes array
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      // Like: add user ID to likes array
      post.likes.push(userId as unknown as typeof post.likes[0]);
    }

    await post.save();

    return NextResponse.json({
      success: true,
      data: { liked: !isLiked, likesCount: post.likes.length },
    });
  } catch (error) {
    console.error("Like post error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
