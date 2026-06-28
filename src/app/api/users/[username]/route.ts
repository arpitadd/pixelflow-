import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { updateProfileSchema } from "@/schemas";

// GET /api/users/[username] - Get user profile + their posts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const { username } = await params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({ author: user._id })
      .populate("author", "name username profileImage")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: { user, posts } });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/users/[username] - Update user profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const jwtUser = await getCurrentUser();
    if (!jwtUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;
    const body = await request.json();

    // Validate input
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    // Ensure user can only edit their own profile
    if (jwtUser.username !== username) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { name, username: newUsername, bio } = result.data;

    // Check if new username is taken by someone else
    if (newUsername !== username) {
      const taken = await User.findOne({ username: newUsername });
      if (taken) {
        return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 409 });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      jwtUser.userId,
      { name, username: newUsername, bio },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({ success: true, data: updatedUser, message: "Profile updated" });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
