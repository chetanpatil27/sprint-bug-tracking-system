import { connectToDB } from "@/server/db";
import Bug from "@/server/modal/bug";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};
    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "Bug ID is required" }), { status: 400 });
    }
    try {
        const bug = await Bug.findById(id);
        if (!bug) {
            return new Response(JSON.stringify({ status: 404, message: "Bug not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(bug), { status: 200 });
    }
    catch (error) {
        console.error("Error fetching bug:", error);
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
        const updatedBug = await Bug.findByIdAndUpdate(
            id,
            { title, description, },
            { new: true }
        );
        if (!updatedBug) {
            return new Response(JSON.stringify({ status: 404, message: "Bug not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ status: 200, message: "Bug updated successfully", data: updatedBug }), { status: 200 });
    } catch (error) {
        console.error("Error updating bug:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};

    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "Bug ID is required" }), { status: 400 });
    }

    try {
        const deletedBug = await Bug.findByIdAndDelete(id);
        if (!deletedBug) {
            return new Response(JSON.stringify({ status: 404, message: "Bug not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ status: 200, message: "Bug deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting bug:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}
