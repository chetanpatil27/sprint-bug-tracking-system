import { NextResponse } from "next/server";

export function handleError(error: unknown) {
    console.log("at handleError",);
    if (error instanceof Error) {
        if (error.code === 11000 && error.keyValue) {
            const field = Object.keys(error.keyValue)[0];
            return NextResponse.json(
                {
                    status: 409,
                    messages: { [field]: `${field} already exists.` },
                    field,
                },
                { status: 409 }
            );
        }
    }
    return NextResponse.json(
        { status: 500, message: "Internal Server Error" },
        { status: 500 }
    );
}