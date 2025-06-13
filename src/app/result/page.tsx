"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactConfetti to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export default function ResultPage() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0", 10);
  const topic = searchParams.get("topic");

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const isPassing = score >= 50;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Show confetti for passing scores
    if (isPassing) {
      setShowConfetti(true);
      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isPassing]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {showConfetti && isPassing && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br mb-6
                ${isPassing ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'}"
              >
                {isPassing ? (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Results: {topic}
              </h1>

              <div
                className={`text-7xl font-bold my-8 ${
                  isPassing ? "text-green-600" : "text-red-600"
                }`}
              >
                {score}%
              </div>

              <p className="text-xl mb-8 text-gray-600">
                {isPassing
                  ? "Congratulations! You passed the quiz! 🎉"
                  : "Keep practicing to improve your score."}
              </p>

              <div className="space-y-6">
                <Link
                  href="/"
                  className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors ${
                    isPassing
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isPassing ? "Try Another Topic" : "Try Again"}
                </Link>

                {isPassing && (
                  <div className="bg-green-50 rounded-lg p-4 mt-6">
                    <p className="text-green-800">
                      Well done! You&apos;ve demonstrated good understanding of{" "}
                      {topic}.
                    </p>
                  </div>
                )}

                {!isPassing && (
                  <div className="mt-8 text-left">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Tips for Improvement:
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600">
                          Review the core concepts of {topic}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600">
                          Practice with more examples
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600">
                          Take notes on areas where you&apos;re unsure
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600">
                          Consider using additional learning resources
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
