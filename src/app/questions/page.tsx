"use client";

import { useEffect, useState } from "react";
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

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get("topic");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allAnswered, setAllAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
            difficulty: "medium",
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
  }, [topic]);

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

  const calculateScore = () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.answer ? 1 : 0);
    }, 0);
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    return percentage;
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    const score = calculateScore();
    router.push(
      `/result?score=${score}&topic=${encodeURIComponent(topic || "")}`
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
            <h1 className="text-red-600 text-xl font-medium mb-4">
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-red-600 text-xl font-medium mb-4">{error}</h2>
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
