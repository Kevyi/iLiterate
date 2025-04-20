"use client"

import Image from "next/image";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";

export default function AboutUs() {
  const [animate, setAnimate] = useState(false);
  const [showArrow, setShowArrow] = useState(true);


  useEffect(() => {
    // Trigger animation on mount
    setAnimate(true);
  }, []);

  const handleScroll = () => {
    const el = document.getElementById("nextSection");
    el?.scrollIntoView({ behavior: "smooth" });
    setShowArrow(false); // Hide arrow after scroll
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-[#faf1e4]">
      <header className="w-full fixed top-0 z-50">
        <Navbar />
      </header>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative">
        <div
          className={`
            flex flex-col items-center justify-center
            transform transition-all duration-1000 ease-out
            ${animate ? "scale-175 opacity-100" : "scale-50 opacity-0"}
          `}
        >
          <Image
            src="/logo.png"
            alt="iLiterate Logo"
            width={200}
            height={200}
            priority
          />
          <p className="ml-4 text-4xl font-extrabold text-black font-mono">
            iLiterate
          </p>
        </div>

        {/* ↓ Scroll Arrow */}
        {showArrow && (
          <div
            onClick={handleScroll}
            className="absolute bottom-6 animate-bounce text-[#a89e91] cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </section>

      {/* Content Section */}
      <main
        id="nextSection"
        className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center p-8 gap-16 sm:p-20 max-w-4xl mx-auto"
      >
        <p className="text-3xl text-center text-[#8f8477] font-mono">
          Welcome to iLiterate! Our innovative product leverages Gemini AI to transform voice into text, helping users learn English effectively and efficiently.
        </p>
        <p className="text-3xl text-center text-[#8f8477] font-mono">
          With cutting-edge technology and a user-friendly interface, iLiterate is designed to make language learning accessible and engaging. Whether you're a beginner or looking to refine your skills, iLiterate is here to support your journey.
        </p>
      </main>

      <footer className="w-full flex justify-center py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} iLiterate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
