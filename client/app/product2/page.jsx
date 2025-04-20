"use client";
import React from "react";
import Navbar from "@/components/navbar";
import AudioPlayer from "@/components/playback";

export default function VoiceToTextPage() {
  return (
    <div className="min-h-screen bg-[#faf1e4]">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4 font-mono">Practice Comprehension</h1>
        <AudioPlayer />
      </div>
    </div>
  );
}