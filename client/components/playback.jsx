"use client";
import React, { useRef, useState } from "react";
import WordBox from "@/components/wordbox";

// Helper function to call Google TTS from the front-end using an API key
async function synthesizeSpeech(text) {
  // Read the API key from the environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    console.error("API key is missing. Please set NEXT_PUBLIC_GOOGLE_TTS_API_KEY in your .env.");
    throw new Error("API key is missing");
  }
  
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  const requestBody = {
    input: { text },
    voice: { languageCode: "en-US", name: "en-US-Wavenet-D", ssmlGender: "MALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    // Log the error response for debugging
    const errorText = await response.text();
    console.error("TTS request failed:", errorText);
    throw new Error("TTS request failed with status " + response.status);
  }

  const data = await response.json();
  return data.audioContent; // a base64-encoded MP3
}

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mp3Url, setMp3Url] = useState("");

  // Function to trigger Google TTS and play the resulting audio
  const generateAndPlayAudio = async () => {
    try {
      console.log("Requesting TTS audio...");
      const base64Audio = await synthesizeSpeech("A quick fox jumps over the lazy dog");
      console.log("Received TTS audio. Base64 length:", base64Audio.length);

      // Convert base64 data to a blob and create an object URL
      const audioBlob = base64ToBlob(base64Audio, "audio/mpeg");
      const url = URL.createObjectURL(audioBlob);
      setMp3Url(url);
      console.log("Audio URL created:", url);
      
      // Give React a moment to update, then play the audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              console.log("Audio playback started.");
            })
            .catch((err) => {
              console.error("Audio playback error:", err);
            });
        } else {
          console.error("Audio element not available.");
        }
      }, 100);
    } catch (error) {
      console.error("Error generating TTS audio:", error);
    }
  };

  // Toggle play/pause functionality
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Audio element not found.");
      return;
    }

    if (!isPlaying) {
      if (mp3Url) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log("Resumed audio playback.");
          })
          .catch((err) => {
            console.error("Audio playback error:", err);
          });
      } else {
        console.log("No audio URL available. Generating via TTS...");
        generateAndPlayAudio();
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      console.log("Audio paused.");
    }
  };

  // Demo WordBox sentences; adjust as needed:
  const sentence1 = "The quick brown fox jumps over the lazy dog.";
  const sentence2 = "A quick brown fox jumps over the lazy dog.";
  const sentence3 = "The quick brown fox leaps over the lazy dog.";
  const sentence4 = "A swift brown fox jumps over the lazy dog.";

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Always render the audio element; src is set if mp3Url is available */}
      <audio ref={audioRef} src={mp3Url || undefined} preload="auto" />
      
      <button
        onClick={togglePlayPause}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <div className="mt-6 space-y-4 w-full max-w-4xl">
        <WordBox text={sentence1} />
        <WordBox text={sentence2} />
        <WordBox text={sentence3} />
        <WordBox text={sentence4} />
      </div>
    </div>
  );
}