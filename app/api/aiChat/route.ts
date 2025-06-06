import { NextResponse } from "next/server";

export async function POST(request: Request){
    const body = await request.json();
    const userMessages = body?.messageHistory;
    const user = body?.user;
    const words = body?.userWordsData;
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

    if (!endpoint) {
      throw new Error("Missing endpoint in env");
    }
    // console.log("API chat request:", userMessages);
    
    const messages = [
      { role: "system", content: process.env.NEXT_PUBLIC_SYSTEM },
      { role: "user", content: `UserData: Name: ${user}`},
      { role: "user", content: `List of words captured: ${JSON.stringify(words)}`},
      ...userMessages
    ];

    const data = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
    })

    const aidata = await data.json()

    return NextResponse.json({ data: aidata.choices[0].message.content, status: 200})
}
