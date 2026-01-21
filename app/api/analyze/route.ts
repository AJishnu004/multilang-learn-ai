import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { text, goal, language = "English" } = await req.json();

    // Basic validation
    if (!text || text.trim().length < 40) {
      return NextResponse.json({
        result:
          "Please paste meaningful study notes related to your exam or topic.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a STRICT, exam-aware educational analyst.

Core Rules:
- Always align analysis with the student's EXAM GOAL.
- Detect the exam type automatically from the goal.
- Prioritize only subjects relevant to that exam.
- Ignore irrelevant subjects or noise.
- NEVER analyze code, UI text, or instructions unless the goal is programming-related.
- Base every gap strictly on the provided notes.
- Avoid generic advice.
`,
        },
        {
          role: "user",
          content: `
STUDENT GOAL:
${goal}

STUDENT NOTES:
${text}

LANGUAGE:
${language}

ANALYSIS RULES:
- First infer the exam type from the goal (e.g., JEE, NEET, GATE, UPSC, School, Programming, General Learning).
- Identify which subjects/topics matter MOST for that exam.
- Ignore topics not required for the exam.
- Select the 3 MOST CRITICAL learning gaps based on:
  1. Repeated confusion
  2. Conceptual weakness
  3. Exam relevance

TASKS:
1. Identify exactly 3 critical learning gaps
2. Each gap must clearly match the exam goal
3. Quote or paraphrase the note causing the gap
4. Explain simply at the learner’s level
5. Generate exam-style practice questions

OUTPUT FORMAT (STRICT):

Gap 1 (Subject / Topic):
Cause (from notes):
Explanation:
Practice Questions:

Gap 2 (Subject / Topic):
Cause (from notes):
Explanation:
Practice Questions:

Gap 3 (Subject / Topic):
Cause (from notes):
Explanation:
Practice Questions:

Respond ONLY in ${language}.
`,
        },
      ],
      temperature: 0.5,
      top_p: 0.85,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("GROQ ERROR:", err);
    return NextResponse.json(
      { error: "AI analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
