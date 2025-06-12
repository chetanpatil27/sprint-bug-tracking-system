import type { NextRequest } from "next/server";
import { authMiddleware } from "./auth";

export function withAuth(handler: (req: NextRequest, userId: string) => Promise<Response>) {
    return async (req: NextRequest) => {
        const auth = await authMiddleware(req);
        const reqUser = auth?.headers.get("req-user-id");
        if (!reqUser) return auth;
        return handler(req, reqUser);
    };
}