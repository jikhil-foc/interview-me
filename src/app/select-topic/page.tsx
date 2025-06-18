"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultyOption {
  value: Difficulty;
  label: string;
  description: string;
  icon: string;
  color: {
    bg: string;
    text: string;
    border: string;
    hover: string;
  };
}

const difficultyOptions: DifficultyOption[] = [
  {
    value: "easy",
    label: "Easy",
    description: "Basic concepts and fundamentals",
    icon: "🌱",
    color: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      hover: "hover:border-green-300",
    },
  },
  {
    value: "medium",
    label: "Medium",
    description: "Intermediate knowledge and applications",
    icon: "⭐",
    color: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      hover: "hover:border-blue-300",
    },
  },
  {
    value: "hard",
    label: "Hard",
    description: "Advanced concepts and edge cases",
    icon: "🔥",
    color: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      hover: "hover:border-red-300",
    },
  },
];

export default function SelectTopic() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get user name from localStorage
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    } else {
      // If no name is found, redirect back to landing page
      router.push("/");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      router.push(
        `/questions?topic=${encodeURIComponent(
          topic.trim()
        )}&difficulty=${difficulty}`
      );
    }
  };

  const popularTopics = [
    "React.js",
    "JavaScript",
    "Python",
    "Node.js",
    "TypeScript",
  ];

  const handleTopicClick = (selectedTopic: string) => {
    setTopic(selectedTopic);
  };

  if (!userName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Choose any programming topic and get instant feedback on your
              knowledge.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 text-left mb-2"
                >
                  Enter a Topic
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="topic"
                    name="topic"
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-lg"
                    placeholder="e.g., React.js, JavaScript"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-left mb-3">
                  Select Difficulty Level
                </label>
                <div className="grid gap-4">
                  {difficultyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDifficulty(option.value)}
                      className={`
                        relative flex items-center p-4 rounded-lg border-2 transition-all duration-200
                        ${
                          difficulty === option.value
                            ? `${option.color.bg} ${option.color.text} border-current ring-2 ring-current ring-offset-2`
                            : `border-gray-200 ${option.color.hover}`
                        }
                      `}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{option.icon}</span>
                          <div className="text-left">
                            <p
                              className={`font-medium ${
                                difficulty === option.value
                                  ? "text-current"
                                  : "text-gray-900"
                              }`}
                            >
                              {option.label}
                            </p>
                            <p
                              className={`text-sm ${
                                difficulty === option.value
                                  ? "text-current"
                                  : "text-gray-500"
                              }`}
                            >
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ml-4 ${
                            difficulty === option.value
                              ? "border-current bg-current"
                              : "border-gray-300"
                          }`}
                        >
                          {difficulty === option.value && (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!topic.trim()}
                className={`w-full py-3 px-4 rounded-md text-lg font-medium text-white transition-colors
                  ${
                    topic.trim()
                      ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                Start Quiz
              </button>
            </form>
          </div>

          <div className="max-w-xl mx-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Popular Topics
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTopics.map((popularTopic) => (
                <button
                  key={popularTopic}
                  onClick={() => handleTopicClick(popularTopic)}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  {popularTopic}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-indigo-600 text-2xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Test Your Skills
              </h3>
              <p className="text-gray-500">
                Get instant feedback on your knowledge with our carefully
                crafted questions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-indigo-600 text-2xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-500">
                See your score immediately and identify areas for improvement.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-indigo-600 text-2xl mb-4">🚀</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Learn & Improve
              </h3>
              <p className="text-gray-500">
                Get personalized tips and recommendations based on your
                performance.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
