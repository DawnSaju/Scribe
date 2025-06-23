import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const body = await request.json();
  const wordOfTheDay = body?.word_of_the_day;
  const userMessages = body?.messageHistory || [];
  const user = body?.user;
  const words = body?.userWordsData;
  const apiKey = process.env.KEY;

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `${process.env.NEXT_PUBLIC_SYSTEM || ''}. Here are the word of the day for this user: ${JSON.stringify(wordOfTheDay)}`;

  const history = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `UserData: Name: ${user}`},
    { role: "user", content: `List of words captured: ${JSON.stringify(words)}`},
    ...userMessages
  ];

  const prompt = history.map(msg => `${msg.role}: ${msg.content}`).join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = response.text || response.candidates?.[0]?.content || response;
    let jsonResult;
    try {
      jsonResult = typeof result === "string" ? JSON.parse(result) : result;
    } catch (error) {
      jsonResult = { message: result };
    }

    return NextResponse.json({ data: jsonResult, status: 200});
  } catch (error: any) {
    console.log("Chat API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500});
  }
}