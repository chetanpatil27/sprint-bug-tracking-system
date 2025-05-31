import { connectToDB } from "@/server/db";
import Task from "@/server/modal/task";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};
    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "Task ID is required" }), { status: 400 });
    }
    try {
        const task = await Task.findById(id);
        if (!task) {
            return new Response(JSON.stringify({ status: 404, message: "Task not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(task), { status: 200 });
    }
    catch (error) {
        console.error("Error fetching task:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};
    const { title, description } = await req.json();

    if (!id || !title || !description) {
        return new Response(JSON.stringify({ status: 400, message: "Missing required fields" }), { status: 400 });
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
        return new Response(JSON.stringify({ status: 200, message: "Task updated successfully", data: updatedTask }), { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};

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
}
