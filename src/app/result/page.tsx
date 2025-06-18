"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Certificate from "@/components/Certificate";
import Modal from "@/components/Modal";

// Dynamically import ReactConfetti to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export default function ResultPage() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0", 10);
  const topic = searchParams.get("topic") || "";
  const timeExpired = searchParams.get("timeExpired") === "true";
  const [userName, setUserName] = useState<string>("");
  const [showCertificate, setShowCertificate] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const isPassing = score >= 70; // Set passing score to 70%

  useEffect(() => {
    // Get user name from localStorage or prompt
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      const name =
        prompt("Please enter your name for the certificate:") ||
        "Anonymous User";
      localStorage.setItem("userName", name);
      setUserName(name);
    }

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
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br mb-6 ${
                  isPassing
                    ? "from-green-400 to-green-600"
                    : "from-red-400 to-red-600"
                }`}
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
                  ? "Congratulations! You&apos;ve passed the quiz! 🎉"
                  : timeExpired
                  ? "Time&apos;s up! Keep practicing to improve your speed and accuracy."
                  : "Keep practicing to improve your score."}
              </p>

              <div className="space-y-6">
                {isPassing && (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    View Certificate
                  </button>
                )}

                <div className="flex justify-center mt-4">
                  <Link
                    href="/"
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${
                      isPassing
                        ? "text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                        : "text-white bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isPassing ? "Try Another Topic" : "Try Again"}
                  </Link>
                </div>

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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <Modal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        title="Your Certificate"
      >
        <Certificate
          userName={userName}
          topic={topic}
          score={score}
          date={new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </Modal>
    </div>
  );
}
