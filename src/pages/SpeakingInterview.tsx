import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  getQuestionsForPart,
  type SpeakingPart,
} from "../data/speakingData";

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  0: SpeechRecognitionAlternativeLike;
  length: number;
  isFinal: boolean;
};

type SpeechRecognitionEventLike = {
  results: SpeechRecognitionResultListLike;
};

type SpeechRecognitionResultListLike = {
  [index: number]: SpeechRecognitionResultLike;
  length: number;
};

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionLike;

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function SpeakingInterview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestedPart = Number(searchParams.get("part"));

  const initialPart: SpeakingPart =
    requestedPart === 2 || requestedPart === 3
      ? requestedPart
      : 1;

  const [part, setPart] = useState<SpeakingPart>(initialPart);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] =
    useState("");

  const [conversation, setConversation] = useState<
    ConversationMessage[]
  >([]);

  const [annaReply, setAnnaReply] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [browserSpeechSupported, setBrowserSpeechSupported] =
    useState(true);

  const recognitionRef =
    useRef<SpeechRecognitionLike | null>(null);

  const manuallyStoppedRef = useRef(false);
  const shouldKeepListeningRef = useRef(false);

  const questions = useMemo(
    () => getQuestionsForPart(part),
    [part],
  );

  const question = questions[questionIndex];

  useEffect(() => {
    const Recognition =
      window.SpeechRecognition ??
      window.webkitSpeechRecognition;

    if (!Recognition) {
      setBrowserSpeechSupported(false);
      return;
    }

    setBrowserSpeechSupported(true);

    const recognition = new Recognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let index = 0;
        index < event.results.length;
        index += 1
      ) {
        const result = event.results[index];

        if (result.isFinal) {
          finalText += `${result[0].transcript} `;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText.trim()) {
        setTranscript((current) =>
          `${current} ${finalText}`.trim(),
        );
      }

      setInterimTranscript(interimText);
    };

    recognition.onend = () => {
      setIsListening(false);

      // Safari/Chrome can terminate recognition after a short
      // silence. Restart while the user is still recording.
      if (
        shouldKeepListeningRef.current &&
        !manuallyStoppedRef.current
      ) {
        window.setTimeout(() => {
          try {
            recognition.start();
            setIsListening(true);
          } catch {
            // Recognition may already be running.
          }
        }, 250);
      }
    };

    recognition.onerror = () => {
      if (
        shouldKeepListeningRef.current &&
        !manuallyStoppedRef.current
      ) {
        window.setTimeout(() => {
          try {
            recognition.start();
            setIsListening(true);
          } catch {
            // Ignore duplicate-start errors.
          }
        }, 350);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      manuallyStoppedRef.current = true;
      shouldKeepListeningRef.current = false;
      recognition.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || isThinking) {
      return;
    }

    setTranscript("");
    setInterimTranscript("");

    manuallyStoppedRef.current = false;
    shouldKeepListeningRef.current = true;

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // Recognition is already running.
      setIsListening(true);
    }
  };

  const stopListening = () => {
    manuallyStoppedRef.current = true;
    shouldKeepListeningRef.current = false;

    recognitionRef.current?.stop();

    setIsListening(false);
  };

  const speakAnna = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const sendToAnna = async () => {
    const finalTranscript = transcript.trim();

    if (
      !finalTranscript ||
      !question ||
      isThinking
    ) {
      return;
    }

    stopListening();
    setIsThinking(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:3000/api/ai/speaking/respond",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            part,
            question: question.prompt,
            transcript: finalTranscript,
            history: conversation,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.reply) {
        throw new Error(
          data.error || "Anna could not respond.",
        );
      }

      const reply = String(data.reply);

      setConversation((current) => [
        ...current,
        {
          role: "user",
          content: finalTranscript,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);

      setAnnaReply(reply);

      speakAnna(reply);

      setTranscript("");
      setInterimTranscript("");
    } catch (error) {
      console.error(error);

      setAnnaReply(
        "I couldn't connect to the AI interviewer. Please try again.",
      );
    } finally {
      setIsThinking(false);
    }
  };

  const nextQuestion = () => {
    stopListening();
    window.speechSynthesis.cancel();

    setTranscript("");
    setInterimTranscript("");
    setAnnaReply("");

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    if (part < 3) {
      setPart((current) => (current + 1) as SpeakingPart);
      setQuestionIndex(0);
      return;
    }

    navigate("/speaking/results", {
      state: {
        completed: true,
        conversation,
      },
    });
  };

  if (!question) {
    return (
      <div className="reading-error-page">
        <p className="eyebrow">SPEAKING</p>

        <h1>Interview unavailable.</h1>

        <Link
          to="/speaking"
          className="primary-button"
        >
          Back to Speaking
        </Link>
      </div>
    );
  }

  return (
    <div className="speaking-interview-page">
      <header className="speaking-interview-header">
        <div>
          <Link
            to="/speaking"
            className="reading-back-link"
          >
            ← Speaking
          </Link>

          <div className="speaking-interview-heading">
            <span>AI INTERVIEW</span>
            <h1>Anna</h1>
          </div>
        </div>

        <div className="speaking-interview-status">
          <div>
            <span>PART</span>
            <strong>{part}</strong>
          </div>
        </div>
      </header>

      <div className="speaking-interview-layout">
        <section className="speaking-interviewer-panel">
          <div className="speaking-scene-glow" />

          <div className="speaking-large-avatar">
            <div className="speaking-large-face">
              <span className="face-eye left" />
              <span className="face-eye right" />

              <span
                className={
                  isListening || isThinking
                    ? "face-mouth active"
                    : "face-mouth"
                }
              />
            </div>
          </div>

          <span className="speaking-listening-state">
            {isThinking
              ? "Anna is thinking..."
              : isListening
                ? "Listening to you..."
                : "Anna is ready"}
          </span>

          <strong>Anna</strong>
          <small>Professional · Adaptive · Natural</small>
        </section>

        <section className="speaking-conversation-panel">
          <div className="speaking-part-header">
            <div>
              <span>PART {part}</span>

              <h2>
                {part === 1
                  ? "Introduction & Interview"
                  : part === 2
                    ? "Individual Long Turn"
                    : "Discussion"}
              </h2>
            </div>

            <div className="speaking-question-progress">
              {questionIndex + 1} / {questions.length}
            </div>
          </div>

          <div className="speaking-question-card">
            <span className="dashboard-label">
              {annaReply ? "ANNA" : "ANNA ASKS"}
            </span>

            <h3>
              {annaReply || question.prompt}
            </h3>

            {question.followUp && (
              <div className="speaking-followups">
                {question.followUp.map((followUp) => (
                  <span key={followUp}>
                    {followUp}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="speaking-transcript-panel">
            <div className="speaking-transcript-header">
              <span>YOUR RESPONSE</span>

              {isListening && (
                <span className="speaking-live-indicator">
                  LIVE
                </span>
              )}
            </div>

            <div className="speaking-transcript">
              {transcript || interimTranscript ? (
                <>
                  <span>{transcript}</span>
                  <em>{interimTranscript}</em>
                </>
              ) : (
                <span className="speaking-transcript-placeholder">
                  Press Start speaking and talk naturally.
                </span>
              )}
            </div>
          </div>

          <div className="speaking-controls">
            <button
              className={
                isListening
                  ? "speaking-mic-button listening"
                  : "speaking-mic-button"
              }
              type="button"
              onClick={
                isListening
                  ? stopListening
                  : startListening
              }
              disabled={
                !browserSpeechSupported ||
                isThinking
              }
            >
              <span>
                {isListening ? "Ⅱ" : "●"}
              </span>

              {isListening
                ? "Stop recording"
                : "Start speaking"}
            </button>

            <button
              className="speaking-next-button"
              type="button"
              onClick={sendToAnna}
              disabled={
                isThinking ||
                !transcript.trim()
              }
            >
              {isThinking
                ? "Anna is thinking..."
                : "Send to Anna"}

              <span>→</span>
            </button>
          </div>

          <button
            className="speaking-skip-button"
            type="button"
            onClick={nextQuestion}
            disabled={isListening || isThinking}
          >
            Continue to next question
          </button>

          {!browserSpeechSupported && (
            <p className="speaking-browser-warning">
              Speech recognition is not available in this
              browser.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default SpeakingInterview;