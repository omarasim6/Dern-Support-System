import { useState } from "react";

const articles = [
  { title: "Reset your device", content: "Hold power button for 10 seconds." },
  { title: "Internet not working", content: "Restart router and check cables." },
  { title: "App crashing", content: "Clear cache and update the app." },
];

function KnowledgeBase() {
  const [search, setSearch] = useState("");

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl p-6 max-w-5xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Knowledge Base</h3>

      {/* Search bar with icon */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {/* Magnifying glass icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>
      </div>

      {filtered.map((a, i) => (
        <div key={i} className="mb-4 border-b pb-3">
          <p className="font-medium">{a.title}</p>
          <p className="text-sm text-gray-600">{a.content}</p>
        </div>
      ))}
    </div>
  );
}

export default KnowledgeBase;
