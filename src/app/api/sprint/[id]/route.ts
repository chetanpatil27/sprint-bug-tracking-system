import { connectToDB } from "@/server/db";
import Sprint from "@/server/modal/sprint";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};
    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "Sprint ID is required" }), { status: 400 });
    }
    try {
        const sprint = await Sprint.findById(id);
        if (!sprint) {
            return new Response(JSON.stringify({ status: 404, message: "Sprint not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(sprint), { status: 200 });
    }
    catch (error) {
        console.error("Error fetching sprint:", error);
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
        const updatedSprint = await Sprint.findByIdAndUpdate(
            id,
            { title, description, },
            { new: true }
        );
        if (!updatedSprint) {
            return new Response(JSON.stringify({ status: 404, message: "Sprint not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ status: 200, message: "Sprint updated successfully", data: updatedSprint }), { status: 200 });
    } catch (error) {
        console.error("Error updating sprint:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};

    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "Sprint ID is required" }), { status: 400 });
    }

    try {
        const deletedSprint = await Sprint.findByIdAndDelete(id);
        if (!deletedSprint) {
            return new Response(JSON.stringify({ status: 404, message: "Sprint not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ status: 200, message: "Sprint deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting sprint:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}
