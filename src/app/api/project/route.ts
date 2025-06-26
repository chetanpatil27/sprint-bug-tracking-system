import { connectToDB } from "@/server/db";
import { paginatedResponse } from "@/server/helper";
import { withAuth } from "@/server/middleware/with-auth";
import Project from "@/server/modal/project";
import { NextRequest, NextResponse } from "next/server";

// GET: List projects with pagination
export const GET = withAuth(async (req: NextRequest) => {
    await connectToDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Project.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Project.countDocuments()
    ]);
    return NextResponse.json(paginatedResponse({ data, total, page, limit }));
});

// POST: Create a new project
export const POST = withAuth(async (req: NextRequest, userId: string) => {
    await connectToDB();
    const postReq = await req.json();
    const { name, description, members } = postReq || {};

    if (!name || !description || !Array.isArray(members)) {
        return NextResponse.json({ status: 400, message: "Missing required fields" }, { status: 400 });
    }

    try {
        const newProject = new Project({
            name,
            description,
            members,
            owner: userId
        });
        const savedProject = await newProject.save();
        return NextResponse.json({
            status: 201, message: "Project created successfully", data: savedProject
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" }, { status: 500 });
    }
});
