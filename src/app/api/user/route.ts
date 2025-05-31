import { connectToDB } from "@/server/db";
import User from "@/server/modal/user";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    return NextResponse.json({ status: 200, data: users }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
