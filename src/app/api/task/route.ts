import { connectToDB } from "@/server/db";
import Task from "@/server/modal/task";

export async function GET() {
    await connectToDB();
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}

export async function POST(req: Request) {
    await connectToDB();
    const postReq = await req.json();
    const { title, description } = postReq || {};

    if (!title || !description) {
        return new Response(JSON.stringify({ status: 400, message: "Missing required fields" }), { status: 400 });
    }

    const newTask = new Task({
        title,
        description,
        start_date: new Date(),
        end_date: new Date()
    });
    try {
        const createdTask = await newTask.save();
        return new Response(JSON.stringify({ status: 201, message: "Task created successfully", data: createdTask }), { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}
