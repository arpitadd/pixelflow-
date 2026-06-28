import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 1) {
      return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    })
      .select("name username profileImage bio")
      .limit(20);

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
