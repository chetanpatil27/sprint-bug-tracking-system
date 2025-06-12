import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface DecodedToken {
    id: string;
    email: string;
    iat?: number;
    exp?: number;
    [key: string]: unknown;
}

interface AuthenticatedRequest extends NextRequest {
    user?: DecodedToken;
}

// type NextFunction = () => void | Promise<void>;

export const authMiddleware = async (
    req: AuthenticatedRequest,
): Promise<void | NextResponse> => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ status: 401, message: "Authentication required" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret" as string) as DecodedToken;

        const response = NextResponse.next();
        response.headers.set("req-user-id", decoded.id);
        response.headers.set("req-user-email", decoded.email);
        return response;
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({ status: 401, message: "Invalid token" });
    }
}