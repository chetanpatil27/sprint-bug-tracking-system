import { connectToDB } from "@/server/db";
import { paginatedResponse } from "@/server/helper";
import { withAuth } from "@/server/middleware/with-auth";
import User from "@/server/modal/user";
import bcrypt from "bcryptjs";
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


type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  f_name: string;
  l_name: string;
};

export const POST = withAuth(async (req: Request,) => {
  await connectToDB();
  const postReq: RegisterRequest = await req.json();
  const { email, password, f_name, l_name } = postReq;

  const emailExist = await User.find({ email: email });
  if (emailExist.length > 0) {
    return NextResponse.json(
      { status: 400, message: "Email already exists" },
      { status: 400 }
    );
  } else {
    // if (password !== confirmPassword) {
    //   return NextResponse.json(
    //     {
    //       status: 400,
    //       message: "Password and Confirm password do not match",
    //     },
    //     { status: 400 }
    //   );
    // } else
    if (!f_name || !f_name.trim() || !l_name || !l_name.trim()) {
      return NextResponse.json(
        {
          status: 400,
          message: "First name and last name are required",
        },
        { status: 400 }
      );
    } else if (!password || password.trim() === "") {
      return NextResponse.json({ status: 400, message: "Password is required" }, { status: 400 });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);
      const user = new User({
        email,
        password: hashpassword,
        f_name,
        l_name,
        active: true,
      });
      await user.save();
      return NextResponse.json(
        { status: 201, message: "User registration successful", data: user },
        { status: 201 }
      );
    }
  }
}
)