import { connectToDB } from "@/server/db";
import { handleError } from "@/server/helper/error";
import { withAuth } from "@/server/middleware/with-auth";
import Team from "@/server/modal/team";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req: NextRequest) => {
    const url = req.nextUrl || new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
        return NextResponse.json({ status: 400, message: "Team ID is required" }, { status: 400 });
    }
    try {
        await connectToDB();
        const team = await Team.findById(id).populate({
            path: "members",
            select: "_id f_name l_name"
        });

        if (!team) {
            return NextResponse.json({ status: 404, message: "Team not found" }, { status: 404 });
        }

        return NextResponse.json({ status: 200, data: team }, { status: 200 });
    } catch (error) {
        console.error("Error fetching team:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" }, { status: 500 });
    }
});

export const PATCH = withAuth(async (req: NextRequest) => {
    const url = req.nextUrl || new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
        return NextResponse.json({ status: 400, message: "Team ID is required" }, { status: 400 });
    }
    try {
        await connectToDB();
        const body = await req.json();
        const { name, description, members } = body;

        const updateData: { name?: string; description?: string; members?: string[] } = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (members) updateData.members = members;

        const team = await Team.findByIdAndUpdate(id, updateData, { new: true }).populate({
            path: "members",
            select: "_id f_name l_name"
        });

        if (!team) {
            return NextResponse.json({ status: 404, message: "Team not found" }, { status: 404 });
        }

        return NextResponse.json({ status: 200, message: "Team updated successfully", data: team }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
});

export const DELETE = withAuth(async (req: NextRequest) => {
    const url = req.nextUrl || new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
        return NextResponse.json({ status: 400, message: "Team ID is required" }, { status: 400 });
    }
    try {
        await connectToDB();
        const team = await Team.findByIdAndDelete(id);

        if (!team) {
            return NextResponse.json({ status: 404, message: "Team not found" }, { status: 404 });
        }

        return NextResponse.json({ status: 200, message: "Team deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting team:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" }, { status: 500 });
    }
});