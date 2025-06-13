import { connectToDB } from "@/server/db";
import { paginatedResponse } from "@/server/helper";
import { populateFields } from "@/server/helper/populate-field";
import { withAuth } from "@/server/middleware/with-auth";
import Task from "@/server/modal/task";
import User from "@/server/modal/user";
import { NextRequest } from "next/server";

export const GET = withAuth(async (req) => {
    await connectToDB();
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Task.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate({
                path: "assignees",
                select: "_id f_name l_name"
            }),
            Task.countDocuments()
        ]);
        const formattedData = data.map(task => {
            const obj = task.toObject();
            return {
                ...obj,
                assignees: (obj.assignees || []).map((assignee: object) => {
                    if (assignee && typeof assignee === "object" && "f_name" in assignee && "l_name" in assignee && "_id" in assignee) {
                        return {
                            _id: assignee._id,
                            name: [assignee.f_name, assignee.l_name].filter(Boolean).join(" ").trim()
                        };
                    }
                    return assignee;
                })
            };
        });
        return new Response(JSON.stringify(paginatedResponse({ data: formattedData, total, page, limit })), { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
});

export const POST = withAuth(async (req: NextRequest, userId: string) => {
    await connectToDB();
    const postReq = await req.json();
    const { title, description, assignees } = postReq || {};

    if (!title || !description) {
        return new Response(JSON.stringify({ status: 400, message: "Missing required fields" }), { status: 400 });
    }
    if (assignees && assignees?.length > 0) {
        const usersCount = await User.countDocuments({ _id: { $in: assignees } });
        if (usersCount !== assignees.length) {
            return new Response(JSON.stringify({ status: 400, message: "One or more assignee IDs do not exist" }), { status: 400 });
        }
    }

    const newTask = new Task({
        title,
        description,
        assignees: assignees || [],
        start_date: new Date(),
        end_date: new Date(),
        owner: userId
    });

    try {
        const createdTask = await newTask.save();

        const populatedTask = await populateFields({ model: Task, id: createdTask._id, fields: ["assignees", "owner"], });
        return new Response(JSON.stringify({ status: 201, message: "Task created successfully", data: populatedTask }), { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
});
