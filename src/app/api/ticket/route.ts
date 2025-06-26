import { connectToDB } from "@/server/db";
import { paginatedResponse } from "@/server/helper";
import { withAuth } from "@/server/middleware/with-auth";
import Ticket from "@/server/modal/ticket";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req: NextRequest) => {
    await connectToDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Ticket.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate({
            path: "assignees",
            select: "_id f_name l_name"
        }),
        Ticket.countDocuments()
    ]);
    return NextResponse.json(paginatedResponse({ data, total, page, limit }));
});

export const POST = withAuth(async (req: NextRequest, userId: string) => {
    await connectToDB();
    const postReq = await req.json();
    const { name, description, type, priority, status, project_id, assignee } = postReq || {};

    if (!name || !type || !priority || !status || !project_id) {
        return NextResponse.json({ status: 400, message: "Missing required fields" }, { status: 400 });
    }

    try {
        const newTicket = new Ticket({
            name,
            description,
            type,
            priority,
            status,
            project_id,
            assignee,
            ticket_key: `TICKET-${Date.now()}`,
            owner: userId
        });
        const savedTicket = await newTicket.save();
        return NextResponse.json({
            status: 201, message: "Ticket created successfully", data
                : savedTicket
        }, { status: 201 });
    } catch (error: Error) {
        console.error("Error creating ticket:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error", error: error?.errors }, { status: 500 });
    }
});