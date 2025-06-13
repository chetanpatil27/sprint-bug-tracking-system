import { connectToDB } from "@/server/db";
import { paginatedResponse } from "@/server/helper";
import { handleError } from "@/server/helper/error";
import { withAuth } from "@/server/middleware/with-auth";
import Team from "@/server/modal/team";
import User from "@/server/modal/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req) => {
    await connectToDB();
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Team.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate({
                path: "members",
                select: "_id f_name l_name"
            }),
            Team.countDocuments()
        ]);

        return NextResponse.json(paginatedResponse({ data, total, page, limit }), { status: 200 });
    } catch (error) {
        console.error("Error fetching teams:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" }, { status: 500 });
    }
});

export const POST = withAuth(async (req: NextRequest) => {
    await connectToDB();
    try {
        const body = await req.json();
        const { name, description, members } = body;

        if (!name || !members || members.length === 0) {
            return NextResponse.json({ status: 400, message: "Name and members are required" }, { status: 400 });
        }

        if (members && members?.length > 0) {
            const usersCount = await User.countDocuments({ _id: { $in: members } });
            if (usersCount !== members.length) {
                return NextResponse.json({ status: 400, message: "One or more assignee IDs do not exist" }, { status: 400 });
            }
        }

        const team = new Team({ name, description, members });
        await team.save();

        return NextResponse.json({ status: 201, message: "Team created successfully", data: team }, { status: 201 });
    } catch (error) {
        console.error("Error creating team:", error);
        // handleError should return a Response
        return handleError(error);
    }
});