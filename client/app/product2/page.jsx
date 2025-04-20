"use client";
import React from "react";
import AudioPlayer from "@/components/playback";

export default function VoiceToTextPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Audio Player</h1>
      <AudioPlayer />
    </div>
  );
}