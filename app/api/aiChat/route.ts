import { NextResponse } from "next/server";

export async function POST(request: Request){
    const body = await request.json();
    console.log("API chat request:", body);

    return NextResponse.json({ data: {message: "This is a test response from AI"}, status: 200})
}