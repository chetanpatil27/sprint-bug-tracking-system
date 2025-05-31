import { connectToDB } from "@/server/db";
import { paginatedResponse } from "@/server/helper";
import Bug from "@/server/modal/bug";

export async function GET(req: Request) {
    await connectToDB();
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Bug.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Bug.countDocuments()
        ]);
        return new Response(JSON.stringify(paginatedResponse({ data, total, page, limit })), { status: 200 });

    } catch (error) {
        console.error("Error fetching bugs:", error);
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

    const newBug = new Bug({
        title,
        description,
        start_date: new Date(),
        end_date: new Date()
    });
    try {
        const createdBug = await newBug.save();
        return new Response(JSON.stringify({ status: 201, message: "Bug created successfully", data: createdBug }), { status: 201 });
    } catch (error) {
        console.error("Error creating bug:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}
