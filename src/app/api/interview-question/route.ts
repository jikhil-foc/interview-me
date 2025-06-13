import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, difficulty, count } = body;

    // Validate input
    if (!topic || !difficulty || !count) {
      return NextResponse.json(
        { error: "Missing required fields: topic, difficulty, count" },
        { status: 400 }
      );
    }

    // Get questions for the requested topic
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY, // Ensure you set this environment variable
    });

    const prompt = `
Generate ${count || 5} ${
      difficulty || "medium"
    } level multiple-choice interview questions on the topic "${topic}".

${"Provide ONLY a valid JSON object, without any markdown formatting (like ```json), without explanation, and without any text before or after the JSON."} Format example:

{
  "questions": [
    {
      "question": "What does 'var' do in JavaScript?",
      "options": ["A) Declares a block-scoped variable", "B) Declares a function-scoped variable", "C) Declares a constant", "D) Declares a class"], // String array of options
      "answer": 1 // Index of the correct answer in the options array (0-based index)
    }
  ]
}
`;

    try {
      const response = await model.invoke(prompt);
      return NextResponse.json(response?.content);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error generating interview questions" },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
