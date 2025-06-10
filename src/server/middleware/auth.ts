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
    console.log("authHeader:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("At error in authMiddleware: No authorization header found or invalid format");
        return NextResponse.json({ status: 401, message: "Authentication required" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret" as string) as DecodedToken;
        console.log("decoded token:", decoded);
        // Attach user info to request
        return NextResponse.json({ status: 200, user: decoded });
        return NextResponse.next(); // Proceed to the next middleware or route handler
        // return next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({ status: 401, message: "Invalid token" });
    }
}