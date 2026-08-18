import { useEffect, useRef, useState } from "react";

import { apiUrl } from "../lib/api";

interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

const quickPrompts = [
  "How can I improve my IELTS Reading score?",
  "Give me a 7-day IELTS study plan.",
  "How can I improve Writing Task 2?",
  "Practice IELTS Speaking with me.",
];

function AICoach() {
  const [messages, setMessages] =
    useState<CoachMessage[]>([
      {
        role: "assistant",
        content:
          "I'm your SelfEDU AI Coach. Tell me what you're struggling with, and I'll help you work on it.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    const saved = localStorage.getItem(
      "selfedu-ai-coach",
    );

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setMessages(parsed);
      }
    } catch {
      localStorage.removeItem(
        "selfedu-ai-coach",
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selfedu-ai-coach",
      JSON.stringify(messages),
    );
  }, [messages]);

  const sendMessage = async (
    customMessage?: string,
  ) => {
    const message =
      customMessage ?? input.trim();

    if (!message || loading) {
      return;
    }

    const userMessage: CoachMessage = {
      role: "user",
      content: message,
    };

    const nextMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        apiUrl("/api/ai/coach"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            history: messages.slice(-12),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.reply) {
        throw new Error(
          data.error ||
            "AI Coach failed.",
        );
      }

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: String(data.reply),
        },
      ]);
    } catch (error) {
      console.error(
        "AI Coach error:",
        error,
      );

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "I couldn't connect to the AI Coach right now. Check that the SelfEDU server is running and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const initialMessage: CoachMessage =
      {
        role: "assistant",
        content:
          "I'm your SelfEDU AI Coach. Tell me what you're struggling with, and I'll help you work on it.",
      };

    setMessages([initialMessage]);

    localStorage.removeItem(
      "selfedu-ai-coach",
    );
  };

  return (
    <div className="ai-coach-page">
      <section className="ai-coach-hero">
        <div>
          <p className="eyebrow">
            SELFEDU AI COACH
          </p>

          <h1>
            Your coach.
            <br />
            <span>
              Always available.
            </span>
          </h1>

          <p className="ai-coach-hero-description">
            Ask about IELTS strategy, writing,
            reading, listening, speaking, study
            planning, or anything you're currently
            stuck on.
          </p>
        </div>

        <div className="ai-coach-hero-orb">
          <div className="ai-coach-orb-core">
            ✦
          </div>

          <span>GEMINI</span>
        </div>
      </section>

      <section className="ai-coach-workspace">
        <div className="ai-coach-chat dashboard-glass-card">
          <div className="ai-coach-chat-header">
            <div>
              <span className="dashboard-label">
                AI COACH
              </span>

              <strong>
                SelfEDU Intelligence
              </strong>
            </div>

            <button
              type="button"
              className="ai-coach-clear-button"
              onClick={clearChat}
            >
              Clear
            </button>
          </div>

          <div className="ai-coach-messages">
            {messages.map(
              (message, index) => (
                <div
                  className={
                    message.role === "user"
                      ? "ai-coach-message user"
                      : "ai-coach-message assistant"
                  }
                  key={`${message.role}-${index}`}
                >
                  <span>
                    {message.role === "user"
                      ? "YOU"
                      : "COACH"}
                  </span>

                  <p>{message.content}</p>
                </div>
              ),
            )}

            {loading && (
              <div className="ai-coach-message assistant">
                <span>COACH</span>

                <p className="ai-coach-thinking">
                  Thinking...
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="ai-coach-input-area">
            <textarea
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Ask your coach anything..."
              rows={3}
            />

            <div className="ai-coach-input-footer">
              <span>
                Enter to send · Shift + Enter for a new line
              </span>

              <button
                type="button"
                className="primary-button"
                disabled={
                  loading ||
                  !input.trim()
                }
                onClick={() =>
                  void sendMessage()
                }
              >
                Send
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>

        <aside className="ai-coach-sidebar">
          <div className="ai-coach-quick dashboard-glass-card">
            <span className="dashboard-label">
              QUICK START
            </span>

            <h2>
              What do you need?
            </h2>

            <div className="ai-coach-prompt-list">
              {quickPrompts.map(
                (prompt) => (
                  <button
                    type="button"
                    key={prompt}
                    onClick={() =>
                      void sendMessage(
                        prompt,
                      )
                    }
                  >
                    <span>→</span>
                    {prompt}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="ai-coach-focus dashboard-glass-card">
            <span className="dashboard-label">
              COACHING AREAS
            </span>

            <div>
              <span>01</span>
              <strong>Reading</strong>
            </div>

            <div>
              <span>02</span>
              <strong>Listening</strong>
            </div>

            <div>
              <span>03</span>
              <strong>Writing</strong>
            </div>

            <div>
              <span>04</span>
              <strong>Speaking</strong>
            </div>

            <div>
              <span>05</span>
              <strong>
                Study Strategy
              </strong>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default AICoach;