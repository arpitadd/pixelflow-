import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

// POST /api/users/[username]/follow - Toggle follow / unfollow
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const jwtUser = await getCurrentUser();
    if (!jwtUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;

    // Cannot follow yourself
    if (jwtUser.username === username) {
      return NextResponse.json({ success: false, error: "You cannot follow yourself" }, { status: 400 });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(jwtUser.userId),
      User.findOne({ username }),
    ]);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const targetId = targetUser._id;
    const currentId = currentUser._id;

    const isAlreadyFollowing = currentUser.following.some(
      (id) => id.toString() === targetId.toString()
    );

    if (isAlreadyFollowing) {
      // Unfollow
      await Promise.all([
        User.findByIdAndUpdate(currentId, { $pull: { following: targetId } }),
        User.findByIdAndUpdate(targetId, { $pull: { followers: currentId } }),
      ]);
      const updated = await User.findById(targetId);
      return NextResponse.json({
        success: true,
        data: {
          following: false,
          followersCount: updated?.followers.length ?? 0,
        },
      });
    } else {
      // Follow
      await Promise.all([
        User.findByIdAndUpdate(currentId, { $addToSet: { following: targetId } }),
        User.findByIdAndUpdate(targetId, { $addToSet: { followers: currentId } }),
      ]);
      const updated = await User.findById(targetId);
      return NextResponse.json({
        success: true,
        data: {
          following: true,
          followersCount: updated?.followers.length ?? 0,
        },
      });
    }
  } catch (error) {
    console.error("Follow toggle error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
