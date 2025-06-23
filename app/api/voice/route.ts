import { NextResponse } from "next/server";

export async function POST(request: Request){
    try {
        const body = await request.json();
        const text = body.text;

        const endpoint = process.env.VOICE_ENDPOINT;
        const key = process.env.VOICE_KEY;

        if (!endpoint) {
            return NextResponse.json({ error: "Error endpoint not set", status: 500});
        } 

        const data = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`,
            },
            body: JSON.stringify({
                "model": "elevenlabs",
                "input": text,
                "voice": "Will (US male)"
            })
        });

        if (!data.ok) {
            const error = await data.text();
            return NextResponse.json({ error }, { status: data.status });
        }

        const audio = await data.arrayBuffer();

        return new NextResponse(audio, {
            headers: {
                "Content-Type": 'audio/wav',
                "Content-Length": audio.byteLength.toString(),
            }
        });
    } catch (error) {
        console.log("Error in VoiceAPI", error);
        return NextResponse.json({ error: "Error in voiceAPI", status: 500})
    }
}