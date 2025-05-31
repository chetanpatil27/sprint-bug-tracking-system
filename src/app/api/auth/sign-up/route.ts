import { connectToDB } from "@/server/db";
import User from "@/server/modal/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  f_name: string;
  l_name: string;
};

export async function POST(req: Request) {
  await connectToDB();
  console.log("at sign-up route");
  const postReq: RegisterRequest = await req.json();
  const { email, password, confirmPassword, f_name, l_name } = postReq;

  const emailExist = await User.find({ email: email });
  if (emailExist.length > 0) {
    return NextResponse.json(
      { status: 400, message: "Email already exists" },
      { status: 400 }
    );
  } else {
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          status: 400,
          message: "Password and Confirm password do not match",
        },
        { status: 400 }
      );
    } else if (!password || password.trim() === "") {
      return NextResponse.json(
        {
          status: 400,
          message: "Password is required",
        },
        { status: 400 }
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);
      const user = new User({
        email,
        password: hashpassword,
        f_name,
        l_name,
        isActive: true,
      });
      await user.save();
      return NextResponse.json(
        { status: 201, message: "Registration successful" },
        { status: 201 }
      );
    }
  }
}
