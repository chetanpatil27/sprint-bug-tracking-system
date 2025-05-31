import { connectToDB } from "@/server/db";
import { paginatedResponse } from "@/server/helper";
import User from "@/server/modal/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectToDB();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      User.find({}, { password: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments()
    ]);

    return new Response(JSON.stringify(paginatedResponse({ data, total, page, limit })), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
