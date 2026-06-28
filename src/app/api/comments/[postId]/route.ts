import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { createCommentSchema } from "@/schemas";

// GET /api/comments/[postId] - Get all comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    await connectDB();
    const { postId } = await params;

    const comments = await Comment.find({ post: postId })
      .populate("user", "name username profileImage")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// POST /api/comments/[postId] - Add a comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    await connectDB();
    const jwtUser = await getCurrentUser();
    if (!jwtUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const body = await request.json();

    const result = createCommentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      post: postId,
      user: jwtUser.userId,
      text: result.data.text,
    });

    // Add comment reference to the post
    post.comments.push(comment._id as typeof post.comments[0]);
    await post.save();

    const populated = await comment.populate("user", "name username profileImage");

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
