import Image from "next/image";
import Navbar from "@/components/navbar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/hover-card";

function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-blue-500">
          Contact Us
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-1">
          <p className="text-sm">
            Feel free to get in touch with us anytime for inquiries or collaborations.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function AboutUs() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-[#faf1e4]">
      <header className="w-full fixed top-0 z-50">
        <Navbar />
      </header>
      <main className="pt-20 grid grid-rows-[auto_1fr_auto] items-center justify-items-center p-8 gap-16 sm:p-20 max-w-4xl mx-auto">
        <Image
          className="rounded-full mx-auto"
          src="/logo.png"
          alt="iLiterate Logo"
          width={400}
          height={400}
          priority
        />
        <p className="text-3xl text-center text-[#a89e91] font-mono">
          Welcome to iLiterate! Our innovative product leverages Gemini AI to transform voice into text, helping users learn English effectively and efficiently.
        </p>
        <p className="text-3xl dark:text-gray-300 text-center text-[#a89e91] font-mono">
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