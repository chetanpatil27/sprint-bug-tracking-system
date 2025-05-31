import { NextResponse } from "next/server";
import { connectToDB } from "@/server/db";
import User from "@/server/modal/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { status: 400, message: "Email and password are required" },
      { status: 400 }
    );
  }

  await connectToDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { status: 404, message: "User not found" },
      { status: 404 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { status: 401, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const userObj = user.toObject() as Omit<typeof user, "password"> & {
    password?: string;
  };
  delete userObj.password;

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  const response = NextResponse.json(
    { status: 200, message: "Sign-in successful", token, user: userObj },
    { status: 200 }
  );
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
