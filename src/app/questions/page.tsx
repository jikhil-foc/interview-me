"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface QuestionResponse {
  questions: Question[];
}

type Difficulty = "easy" | "medium" | "hard";

const QUIZ_TIME_SECONDS = 120; // 2 minutes

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Timer = ({
  seconds,
  isWarning,
}: {
  seconds: number;
  isWarning: boolean;
}) => {
  return (
    <div
      className={`fixed top-4 right-4 flex items-center ${
        isWarning ? "text-red-600" : "text-gray-700"
      } bg-white rounded-lg shadow-lg px-4 py-2 border ${
        isWarning ? "border-red-200" : "border-gray-200"
      }`}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span
        className={`font-mono text-xl font-medium ${
          isWarning ? "animate-pulse" : ""
        }`}
      >
        {formatTime(seconds)}
      </span>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            {/* Header Skeleton */}
            <div className="text-center mb-8">
              <div className="animate-pulse">
                <div className="h-8 w-2/3 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Question Skeleton */}
            <div className="mb-8">
              <div className="animate-pulse">
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-6"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Skeleton */}
            <div className="flex items-center justify-between mt-8">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading your quiz...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function Quiz() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get("topic");
  const difficulty = (searchParams.get("difficulty") || "easy") as Difficulty;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allAnswered, setAllAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_SECONDS);
  const shouldAutoSubmit = useRef(false);

  const calculateScore = useCallback(() => {
    if (questions.length === 0) {
      return 0;
    }
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.answer ? 1 : 0);
    }, 0);
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    return percentage;
  }, [questions, selectedAnswers]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/interview-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            difficulty,
            count: 5,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data: QuestionResponse = JSON.parse(await response.json());
        setQuestions(data.questions);
        setSelectedAnswers(new Array(data.questions.length).fill(-1));
      } catch {
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (topic) {
      fetchQuestions();
    }
  }, [topic, difficulty]);

  useEffect(() => {
    // Timer countdown effect
    if (loading || error) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          shouldAutoSubmit.current = true;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, error]);

  // Handle auto-submit in a separate effect
  useEffect(() => {
    if (shouldAutoSubmit.current && timeRemaining === 0) {
      const score = calculateScore();
      router.push(
        `/result?score=${score}&topic=${encodeURIComponent(
          topic || ""
        )}&timeExpired=true`
      );
    }
  }, [timeRemaining, topic, router, calculateScore]);

  useEffect(() => {
    // Check if all questions have been answered
    if (
      questions.length > 0 &&
      selectedAnswers.every((answer) => answer !== -1)
    ) {
      setAllAnswered(true);
    } else {
      setAllAnswered(false);
    }
  }, [selectedAnswers, questions]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    const score = calculateScore();
    router.push(
      `/result?score=${score}&topic=${encodeURIComponent(
        topic || ""
      )}&timeExpired=false`
    );
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (
      direction === "next" &&
      currentQuestionIndex < questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-red-50 text-red-500 mb-4">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-gray-900 mb-4">
              No topic specified
            </h1>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-red-50 text-red-500 mb-4">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-red-600 mb-4">{error}</h2>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Try again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Timer seconds={timeRemaining} isWarning={timeRemaining <= 30} />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {topic} Quiz
              </h1>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>•</span>
                <span>
                  {allAnswered
                    ? "All questions answered"
                    : `${selectedAnswers.filter((a) => a !== -1).length} of ${
                        questions.length
                      } answered`}
                </span>
                <span>•</span>
                <span className="capitalize">Difficulty: {difficulty}</span>
              </div>
            </div>

            {questions[currentQuestionIndex] && (
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6">
                  {currentQuestionIndex + 1}.{" "}
                  {questions[currentQuestionIndex].question}
                </h3>
                <div className="space-y-4">
                  {questions[currentQuestionIndex].options.map(
                    (option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`relative rounded-lg border ${
                          selectedAnswers[currentQuestionIndex] === optionIndex
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        } transition-colors cursor-pointer p-4`}
                        onClick={() =>
                          handleAnswerSelect(currentQuestionIndex, optionIndex)
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[currentQuestionIndex] ===
                              optionIndex
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAnswers[currentQuestionIndex] ===
                              optionIndex && (
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <label className="ml-3 block text-sm sm:text-base text-gray-700 cursor-pointer">
                            {option}
                          </label>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => navigateQuestion("prev")}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentQuestionIndex === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => navigateQuestion("next")}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentQuestionIndex === questions.length - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel quiz
              </Link>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  allAnswered
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {allAnswered
                  ? "Submit Answers"
                  : `Answer all questions to submit`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Quiz />
    </Suspense>
  );
}
