import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const MODEL =
  process.env.GEMINI_MODEL || "gemini-3.6-flash";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

console.log("🔧 Starting SelfEDU Gemini server...");
console.log("📦 Model:", MODEL);
console.log(
  "🔑 Gemini key loaded:",
  Boolean(process.env.GEMINI_API_KEY),
);

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (_req, res) => {
  res.send("SelfEDU Gemini AI server is running.");
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "SelfEDU Gemini AI",
    model: MODEL,
  });
});

/* =========================================================
   SPEAKING
   ========================================================= */

app.post("/api/ai/speaking/respond", async (req, res) => {
  console.log("📥 Speaking request received");
/* =========================================================
   SPEAKING AI EVALUATION
   ========================================================= */

app.post("/api/ai/speaking-evaluate", async (req, res) => {
  console.log("📥 Speaking evaluation request received");

  try {
    const {
      conversation = [],
      part = 1,
    } = req.body;

    if (!Array.isArray(conversation)) {
      return res.status(400).json({
        error: "conversation must be an array.",
      });
    }

    if (conversation.length === 0) {
      return res.status(400).json({
        error: "Conversation is empty.",
      });
    }

    const transcript = conversation
      .filter(
        (item) =>
          item &&
          typeof item.role === "string" &&
          typeof item.content === "string",
      )
      .map(
        (item) =>
          `${item.role === "assistant" ? "Anna" : "Student"}: ${item.content}`,
      )
      .join("\n");

    const speakingSchema = {
      type: Type.OBJECT,
      properties: {
        estimatedBand: {
          type: Type.NUMBER,
        },

        fluencyScore: {
          type: Type.NUMBER,
        },

        vocabularyScore: {
          type: Type.NUMBER,
        },

        grammarScore: {
          type: Type.NUMBER,
        },

        pronunciationScore: {
          type: Type.NUMBER,
        },

        summary: {
          type: Type.STRING,
        },

        strengths: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },

        weaknesses: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },

        improvements: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },

      required: [
        "estimatedBand",
        "fluencyScore",
        "vocabularyScore",
        "grammarScore",
        "pronunciationScore",
        "summary",
        "strengths",
        "weaknesses",
        "improvements",
      ],
    };

    const evaluationPrompt = `
You are SelfEDU IELTS, a speaking evaluation assistant.

Evaluate the STUDENT'S speaking performance from the transcript below.

IMPORTANT:
- This is an AI learning estimate, NOT an official IELTS score.
- Evaluate only what is supported by the transcript.
- Do not invent pronunciation problems from text alone.
- Because this is a transcript, pronunciation confidence must be conservative.
- Assess natural fluency, development of ideas, vocabulary range, grammatical accuracy and variety.
- Do not score Anna's speaking.
- Give practical feedback.

Speaking part:
${part}

Conversation transcript:
${transcript}

Return:
- Estimated overall band
- Fluency & Coherence
- Lexical Resource
- Grammatical Range & Accuracy
- Pronunciation estimate
- Summary
- Strengths
- Weaknesses
- Three specific improvements
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: evaluationPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: speakingSchema,
      },
    });

    const raw = response.text?.trim();

    if (!raw) {
      throw new Error(
        "Gemini returned an empty speaking evaluation.",
      );
    }

    const evaluation = JSON.parse(raw);

    const normalizedEvaluation = {
      estimatedBand:
        Number(evaluation.estimatedBand) || 0,

      fluencyScore:
        Number(evaluation.fluencyScore) || 0,

      vocabularyScore:
        Number(evaluation.vocabularyScore) || 0,

      grammarScore:
        Number(evaluation.grammarScore) || 0,

      pronunciationScore:
        Number(evaluation.pronunciationScore) || 0,

      summary:
        typeof evaluation.summary === "string"
          ? evaluation.summary
          : "",

      strengths:
        Array.isArray(evaluation.strengths)
          ? evaluation.strengths.filter(
              (item) => typeof item === "string",
            )
          : [],

      weaknesses:
        Array.isArray(evaluation.weaknesses)
          ? evaluation.weaknesses.filter(
              (item) => typeof item === "string",
            )
          : [],

      improvements:
        Array.isArray(evaluation.improvements)
          ? evaluation.improvements.filter(
              (item) => typeof item === "string",
            )
          : [],
    };

    console.log(
      "✅ Speaking evaluation generated:",
      normalizedEvaluation,
    );

    return res.json({
      ok: true,
      model: MODEL,
      evaluation: normalizedEvaluation,
    });
  } catch (error) {
    console.error(
      "❌ Gemini Speaking evaluation error:",
      error,
    );

    return res.status(500).json({
      error: "Speaking AI evaluation failed.",
    });
  }
});
  try {
    const {
      part,
      question,
      transcript,
      history = [],
    } = req.body;

    if (
      typeof part !== "number" ||
      typeof question !== "string" ||
      typeof transcript !== "string"
    ) {
      return res.status(400).json({
        error:
          "part, question and transcript are required.",
      });
    }

    if (!transcript.trim()) {
      return res.status(400).json({
        error: "Transcript is empty.",
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              typeof item.role === "string" &&
              typeof item.content === "string",
          )
          .slice(-12)
      : [];

    const historyText = safeHistory
      .map(
        (item) =>
          `${item.role === "assistant" ? "Anna" : "Student"}: ${item.content}`,
      )
      .join("\n");

    const prompt = `
You are Anna, the SelfEDU IELTS speaking interviewer.

Conduct a natural IELTS-style speaking interview.

Rules:
- Be professional, calm, and natural.
- React to what the student actually said.
- Keep your response short, usually 1–3 sentences.
- Ask one clear next question.
- Do not give a score during the interview.
- Do not claim to be an official IELTS examiner.
- Adapt follow-up questions to the student's answer.

Current IELTS Speaking Part: ${part}

Current examiner question:
${question}

Previous conversation:
${historyText || "No previous conversation."}

Student's latest response:
${transcript}

Return ONLY Anna's spoken response.
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const reply =
      response.text?.trim() ||
      "Thanks. Let's continue.";

    console.log("📤 Anna:", reply);

    return res.json({
      ok: true,
      reply,
    });
  } catch (error) {
    console.error("❌ Gemini Speaking error:", error);

    return res.status(500).json({
      error: "Speaking AI response failed.",
    });
  }
});

/* =========================================================
   WRITING
   ========================================================= */

app.post("/api/ai/writing-evaluate", async (req, res) => {
  console.log("📥 Writing evaluation request received");

  try {
    const {
      taskType,
      prompt,
      answer,
      wordCount,
    } = req.body;

    if (
      typeof taskType !== "string" ||
      typeof prompt !== "string" ||
      typeof answer !== "string"
    ) {
      return res.status(400).json({
        error:
          "taskType, prompt and answer are required.",
      });
    }

    if (!answer.trim()) {
      return res.status(400).json({
        error: "Writing response is empty.",
      });
    }

    const writingSchema = {
      type: Type.OBJECT,
      properties: {
        estimatedBand: {
          type: Type.NUMBER,
        },

        taskScore: {
          type: Type.NUMBER,
        },

        coherenceScore: {
          type: Type.NUMBER,
        },

        lexicalScore: {
          type: Type.NUMBER,
        },

        grammarScore: {
          type: Type.NUMBER,
        },

        summary: {
          type: Type.STRING,
        },

        strengths: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },

        weaknesses: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },

        improvements: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },

        examples: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original: {
                type: Type.STRING,
              },
              improved: {
                type: Type.STRING,
              },
              explanation: {
                type: Type.STRING,
              },
            },
            required: [
              "original",
              "improved",
              "explanation",
            ],
          },
        },
      },

      required: [
        "estimatedBand",
        "taskScore",
        "coherenceScore",
        "lexicalScore",
        "grammarScore",
        "summary",
        "strengths",
        "weaknesses",
        "improvements",
        "examples",
      ],
    };

    const evaluationPrompt = `
You are SelfEDU IELTS, an IELTS Writing learning assistant.

Evaluate the student's response as a learning estimate.
This is NOT an official IELTS score.

IMPORTANT:
- Base every comment on the actual response.
- Never invent mistakes.
- Do not give vague feedback.
- Explain why something is weak.
- Give specific, actionable improvements.
- Only use examples that actually come from the student's response.
- Keep the feedback concise enough to be useful.

Evaluate:

1. Task Response / Task Achievement
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

For strengths:
Give 2–4 specific strengths.

For weaknesses:
Give 2–4 specific weaknesses.

For improvements:
Give 3 practical actions the student can apply to their next essay.

For examples:
Choose up to 3 actual sentences or phrases from the student's response that could be improved.
For each one:
- quote the original
- provide an improved version
- explain the change

Task type:
${taskType}

Task prompt:
${prompt}

Student word count:
${wordCount}

Student response:
${answer}
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: evaluationPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: writingSchema,
      },
    });

    const raw = response.text?.trim();

    if (!raw) {
      throw new Error(
        "Gemini returned an empty writing evaluation.",
      );
    }

    const evaluation = JSON.parse(raw);

    const normalizedEvaluation = {
      estimatedBand:
        Number(evaluation.estimatedBand) || 0,

      taskScore:
        Number(evaluation.taskScore) || 0,

      coherenceScore:
        Number(evaluation.coherenceScore) || 0,

      lexicalScore:
        Number(evaluation.lexicalScore) || 0,

      grammarScore:
        Number(evaluation.grammarScore) || 0,

      summary:
        typeof evaluation.summary === "string"
          ? evaluation.summary
          : "",

      strengths:
        Array.isArray(evaluation.strengths)
          ? evaluation.strengths.filter(
              (item) => typeof item === "string",
            )
          : [],

      weaknesses:
        Array.isArray(evaluation.weaknesses)
          ? evaluation.weaknesses.filter(
              (item) => typeof item === "string",
            )
          : [],

      improvements:
        Array.isArray(evaluation.improvements)
          ? evaluation.improvements.filter(
              (item) => typeof item === "string",
            )
          : [],

      examples:
        Array.isArray(evaluation.examples)
          ? evaluation.examples
              .filter(
                (item) =>
                  item &&
                  typeof item.original === "string" &&
                  typeof item.improved === "string" &&
                  typeof item.explanation ===
                    "string",
              )
              .slice(0, 3)
          : [],
    };

    console.log(
      "✅ Writing evaluation generated:",
      {
        band: normalizedEvaluation.estimatedBand,
        strengths:
          normalizedEvaluation.strengths.length,
        weaknesses:
          normalizedEvaluation.weaknesses.length,
        improvements:
          normalizedEvaluation.improvements.length,
        examples:
          normalizedEvaluation.examples.length,
      },
    );

    return res.json({
      ok: true,
      model: MODEL,
      evaluation: normalizedEvaluation,
    });
  } catch (error) {
    console.error(
      "❌ Gemini Writing error:",
      error,
    );

    return res.status(500).json({
      error: "Writing AI evaluation failed.",
    });
  }
});
/* =========================================================
   AI COACH
   ========================================================= */

app.post("/api/ai/coach", async (req, res) => {
  console.log("📥 AI Coach request received");

  try {
    const {
      message,
      history = [],
    } = req.body;

    if (typeof message !== "string") {
      return res.status(400).json({
        error: "message is required.",
      });
    }

    if (!message.trim()) {
      return res.status(400).json({
        error: "message cannot be empty.",
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              (item.role === "user" ||
                item.role === "assistant") &&
              typeof item.content === "string",
          )
          .slice(-16)
      : [];

    const historyText = safeHistory
      .map(
        (item) =>
          `${item.role === "assistant" ? "Coach" : "Student"}: ${item.content}`,
      )
      .join("\n");

    const prompt = `
You are SelfEDU AI Coach, an IELTS learning coach.

Your job is to help a student improve efficiently.

Rules:
- Be direct, practical, and encouraging without overpraising.
- Focus on IELTS Listening, Reading, Writing, and Speaking.
- Explain difficult concepts clearly.
- Give examples when useful.
- When the student asks for a study plan, make it realistic.
- When the student asks for writing feedback, give specific advice.
- When the student asks about speaking, suggest natural answers, vocabulary, and structure.
- When the student asks about reading or listening, explain strategy and reasoning.
- Never claim to be an official IELTS examiner.
- Never invent test results.
- Do not overwhelm the student with unnecessary information.
- Prefer actionable next steps.

Previous conversation:
${historyText || "No previous conversation."}

Student's latest message:
${message}

Return a useful response for the student.
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const reply =
      response.text?.trim() ||
      "I couldn't generate a response right now.";

    console.log("📤 AI Coach response generated.");

    return res.json({
      ok: true,
      reply,
    });
  } catch (error) {
    console.error("❌ Gemini AI Coach error:", error);

    return res.status(500).json({
      error: "AI Coach response failed.",
    });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `✅ SelfEDU Gemini server running on http://127.0.0.1:${PORT}`,
  );
});