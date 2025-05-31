import { connectToDB } from "@/server/db";
import Sprint from "@/server/modal/sprint";

export async function GET() {
    await connectToDB();
    try {
        const sprints = await Sprint.find().sort({ createdAt: -1 });
        return new Response(JSON.stringify(sprints), { status: 200 });
    } catch (error) {
        console.error("Error fetching sprints:", error);
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

    const newSprint = new Sprint({
        title,
        description,
        start_date: new Date(),
        end_date: new Date()
    });
    try {
        const createdSprint = await newSprint.save();
        return new Response(JSON.stringify({ status: 201, message: "Sprint created successfully", data: createdSprint }), { status: 201 });
    } catch (error) {
        console.error("Error creating sprint:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}
