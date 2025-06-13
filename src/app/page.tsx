"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      router.push(`/questions?topic=${encodeURIComponent(topic.trim())}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Test Your Knowledge
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-8">
            Challenge yourself with our interactive quiz generator. Choose any
            programming topic and get instant feedback on your knowledge.
          </p>

          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
