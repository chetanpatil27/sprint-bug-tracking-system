import { connectToDB } from "@/server/db";
import { populateFields } from "@/server/helper/populate-field";
import { withAuth } from "@/server/middleware/with-auth";
import Task from "@/server/modal/task";
import { NextRequest } from "next/server";

export const GET = withAuth(async (req: NextRequest,) => {
    await connectToDB();
    // Extract id from the URL
    const url = req.nextUrl || new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "Task ID is required" }), { status: 400 });
    }
    try {
        const task = await Task.findById(id);
        if (!task) {
            return new Response(JSON.stringify({ status: 404, message: "Task not found" }), { status: 404 });
        }
        const populatedTask = await populateFields({ model: Task, id: task._id, fields: ["assignees", "owner"] });
        return new Response(JSON.stringify(populatedTask), { status: 200 });
    } catch (error) {
        console.error("Error fetching task:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
});

export const PATCH = withAuth(async (req: NextRequest) => {
    await connectToDB();
    const url = req.nextUrl || new URL(req.url);
    const id = url.pathname.split("/").pop();
    const { title, description } = await req.json();

    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "Task ID is required" }), { status: 400 });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, },
            { new: true }
        );
        if (!updatedTask) {
            return new Response(JSON.stringify({ status: 404, message: "Task not found" }), { status: 404 });
        }
        const populatedTask = await populateFields({ model: Task, id: updatedTask._id, fields: ["assignees", "owner"] });
        return new Response(JSON.stringify({ status: 200, message: "Task updated successfully", data: populatedTask }), { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
})


export const DELETE = withAuth(async (req: NextRequest) => {
    await connectToDB();
    const url = req.nextUrl || new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "Task ID is required" }), { status: 400 });
    }

    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return new Response(JSON.stringify({ status: 404, message: "Task not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ status: 200, message: "Task deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
})
