import { connectToDB } from "@/server/db";
import { paginatedResponse } from "@/server/helper";
import { withAuth } from "@/server/middleware/with-auth";
import Task from "@/server/modal/task";

export const GET = withAuth(async (req, userId) => {
    await connectToDB();
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Task.find({ assignees: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate({
                path: "assignees owner",
                select: "_id f_name l_name"
            }),
            Task.countDocuments({ assignees: userId })
        ]);

        return new Response(JSON.stringify(paginatedResponse({ data, total, page, limit })), { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return new Response(JSON.stringify({ status: 500, message: "Internal Server Error" }), { status: 500 });
    }
});