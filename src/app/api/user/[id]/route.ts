import { connectToDB } from "@/server/db";
import User from "@/server/modal/user";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};

    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "User ID is required" }), { status: 400 });
    }

    try {
        const user = await User.findById(id, { password: 0 }); // Exclude password field
        if (!user) {
            return new Response(JSON.stringify({ status: 404, message: "User not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    const { id } = params || {};

    if (!id) {
        return new Response(JSON.stringify({ status: 400, message: "User ID is required" }), { status: 400 });
    }

    try {
        const userData = await req.json();
        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
        const user = await User.findById(id, { password: 0 }); // Exclude password field

        if (!updatedUser) {
            return new Response(JSON.stringify({ status: 404, message: "User not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
}