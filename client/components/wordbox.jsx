"use client";

import { useState, useEffect, useRef, useReducer } from "react";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/popover";

// Helper function for Google TTS (from playback.jsx)
async function synthesizeSpeech(text) {
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
    const errorText = await response.text();
    console.error("TTS request failed:", errorText);
    throw new Error("TTS request failed with status " + response.status);
  }
  const data = await response.json();
  return data.audioContent; // base64-encoded MP3
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

function Word({ word, index, currentIndex, activeWordIndex, setActiveWordIndex, isWrong }) {
  const normalizedWord = word.replace(/[^\w']/g, "");
  const wrongWordBool = isWrong && currentIndex === index;
  const correctWordBool = index <= currentIndex - 1;
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mp3Url, setMp3Url] = useState("");
  const audioRef = useRef(null);

  // Fetch definition as before
  useEffect(() => {
    const fetchDefinition = async () => {
      setLoading(true);
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/get-definition", { word: normalizedWord });
        setDefinition(response.data.definition);
      } catch (error) {
        setDefinition("Definition not available.");
      } finally {
        setLoading(false);
      }
    };
    if (activeWordIndex === index) {
      fetchDefinition();
    }
  }, [activeWordIndex, index, normalizedWord]);

  // TTS: Generate and play audio when word is clicked
  const handleWordClick = async () => {
    setActiveWordIndex(index);
    try {
      const base64Audio = await synthesizeSpeech(normalizedWord);
      const audioBlob = base64ToBlob(base64Audio, "audio/mpeg");
      const url = URL.createObjectURL(audioBlob);
      setMp3Url(url);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => console.error("Audio playback error:", err));
        }
      }, 100);
    } catch (err) {
      console.error("TTS error:", err);
    }
  };
  

  return (
    <Popover
      open={activeWordIndex === index}
      onOpenChange={(open) => setActiveWordIndex(open ? index : null)}
    >
      <PopoverTrigger asChild>
        <span
          onClick={handleWordClick}
          style={{ cursor: "pointer", padding: "0 2px", userSelect: "none", fontSize: "30px" }}
        >
          <span className={`${correctWordBool ? "text-green-500" : ""} transition-all duration-300 ease-in-out hover:text-[#6a9e5e] hover:text-4xl`}>
            <a className={`${wrongWordBool ? "text-red-600" : ""}`}>{word}</a>
          </span>
          {/* Hidden audio element for TTS */}
          <audio ref={audioRef} src={mp3Url || undefined} preload="auto" />
        </span>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-64">
        <p className="text-base">
          {loading
            ? "Loading definition..."
            : definition
              ? `Definition for "${normalizedWord}": ${definition}`
              : `No definition found.`}
        </p>
      </PopoverContent>
    </Popover>
  );
}

export default function WordBox({ text, correctText, wordsInput, correctWord1, correctWord2 }) {
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWords, setCurrentWords] = useState([]);
  const correctWords = (correctText || "").split(" ");
  const [words, setWords] = useState(text.split(" "));
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  //Trigger win overlay.
  const triggerOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => {
      setShowOverlay(false);
    }, 500); // overlay lasts 500ms
  };

  useEffect(() => {
    if (wordsInput) {
      if (
        correctWords[currentIndex]?.toLowerCase().replace(/[^\w]/g, "") ===
        wordsInput[wordsInput.length - 1]?.toString().toLowerCase().replace(/[^\w]/g, "")
      ) {
        setCurrentIndex(currentIndex + 1);
        setIsWrong(false);
      } else {
        setIsWrong(true);
      }
    }

    if(currentIndex === words.length && !overlayDone){
      triggerOverlay();
      setOverlayDone(true);
      const audio = new Audio("/correct.mp3");
      audio.play();
    }

  }, [wordsInput]);

  useEffect(() => {
    const originalWords = text.split(" ");
    let blankIndexes = [];

    originalWords.forEach((w, i) => {
      if (w.includes("_")) blankIndexes.push(i);
    });

    console.log({ blankIndexes, correctWord1, correctWord2 });

    setWords((prev) => {
      const newWords = [...prev];
      if (blankIndexes[0] !== undefined && currentIndex > blankIndexes[0]) {
        newWords[blankIndexes[0]] = correctWord1;
      }
      if (blankIndexes[1] !== undefined && currentIndex > blankIndexes[1]) {
        newWords[blankIndexes[1]] = correctWord2;
      }
      return newWords;
    });
  }, [currentIndex, correctWord1, correctWord2, text]);

  return (
    <>

    {/* Overlay layer */}
    {showOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-green-500 opacity-60 z-50 transition-opacity duration-500 pointer-events-none" />
    )}
      <div style={{ lineHeight: "2em", fontSize: "18px", flexWrap: "wrap" }}>
        {words.map((word, index) => {
          const next = words[index + 1];
          const needsSpace =
            !/\s/.test(word) && !/[^\w\s]/.test(word) && !/^\s/.test(next ?? "");

          return (
            <span key={index} style={{ display: "inline" }}>
              <Word
                word={word}
                index={index}
                currentIndex={currentIndex}
                activeWordIndex={activeWordIndex}
                setActiveWordIndex={setActiveWordIndex}
                isWrong={isWrong}
              />
              {needsSpace && " "}
            </span>
          );
        })}
      </div>
    </>
  );
}