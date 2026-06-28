import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import "@/models/User";
import { getCurrentUser } from "@/lib/auth";

// GET /api/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const post = await Post.findById(id)
      .populate("author", "name username profileImage")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name username profileImage" },
        options: { sort: { createdAt: -1 } },
      });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Get post error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/posts/[id] - Update post caption
export async function PATCH(
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
    const { caption } = await request.json();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    // Only post author can edit
    if (post.author.toString() !== jwtUser.userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    post.caption = caption ?? post.caption;
    await post.save();

    return NextResponse.json({ success: true, data: post, message: "Post updated" });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete a post and its comments
export async function DELETE(
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

    if (post.author.toString() !== jwtUser.userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Delete post and all associated comments
    await Promise.all([
      Post.findByIdAndDelete(id),
      Comment.deleteMany({ post: id }),
    ]);

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
