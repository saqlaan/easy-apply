"use client";

import Match from "@/components/match/Match";
import Upload from "@/components/upload/Upload";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0); // Default to the first tab

  return (
    <div>
      <div className="grid items-center justify-items-center min-h-screen gap-10 px-10 font-[family-name:var(--font-geist-mono)]">
        <h1 className="mt-10">Your CV Database: Empowering Your Career Journey</h1>
        <div className="max-w-4xl mx-auto p-4">
          {/* Tab Container */}
          <div className="flex justify-center mb-4">
            <div className="flex border-b border-gray-300">
              <button
                onClick={() => setActiveTab(0)}
                className={`tab-button px-6 py-2 text-lg font-medium text-white border-b-2 border-transparent hover:border-white focus:outline-none ${activeTab === 0
                  ? "border-white text-white"
                  : "text-gray-400"}`}
              >
                Match
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`tab-button px-6 py-2 text-lg font-medium text-white border-b-2 border-transparent hover:border-white focus:outline-none ${activeTab === 1
                  ? "border-white text-white"
                  : "text-gray-400"}`}
              >
                Upload
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 0 ? (
              <div className="tab-panel mb-4">
                <Match />
              </div>
            ) : (
              <div className="tab-panel mb-4">
                <Upload />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
