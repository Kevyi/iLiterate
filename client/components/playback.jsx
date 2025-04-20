"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import WordBox from "@/components/wordbox";

// Helper function to call Google TTS using an API key
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

// Create an array of 50 topics
const topics = [
  "Technology", "Health", "Education", "Travel", "Food", "Music", "Art", "Sports", "History", "Science",
  "Literature", "Movies", "Fashion", "Nature", "Environment", "Economics", "Politics", "Philosophy", "Adventure", "Mystery",
  "Comedy", "Drama", "Romance", "Innovation", "Culture", "Architecture", "Photography", "Astronomy", "Mathematics", "Biology",
  "Geography", "Psychology", "Fitness", "Wellness", "Gardening", "Cooking", "Baking", "Entrepreneurship", "Finance", "Investing",
  "Mindfulness", "Hiking", "Cycling", "Animals", "Mythology", "Robotics", "Gaming", "Poetry", "Meditation", "Travel Photography"
];

export default function AudioPlayer() {
  const audioRef = useRef(null); // For TTS audio playback
  const correctAudioRef = useRef(null); // For playing correct.mp3
  const [isPlaying, setIsPlaying] = useState(false);
  const [mp3Url, setMp3Url] = useState("");
  const [sentences, setSentences] = useState([]);
  const [entry, setEntry] = useState(""); // Topic input
  const [loading, setLoading] = useState(false);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

  // Labels for options A, B, C, D
  const optionLabels = ["A", "B", "C", "D"];

  // Function to handle Random Topic selection
  const handleRandomTopic = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setEntry(randomTopic);
    // Optionally auto-submit:
    // handleSubmit({ preventDefault: () => {} });
  };

  // Fetch multiple sentences from the backend
  const fetchSentences = async (inputText) => {
    try {
      console.log("Fetching sentences for:", inputText);
      const response = await axios.post("http://127.0.0.1:5000/api/generate-multiple-sentences", { prompt: inputText });
      console.log("Backend response:", response.data);
      // Expected format: { sentence_1:"...", sentence_2:"...", sentence_3:"...", sentence_4:"..." }
      const data = response.data;
      const fetched = [data.sentence_1, data.sentence_2, data.sentence_3, data.sentence_4];
      if (fetched && Array.isArray(fetched)) {
        setSentences(fetched);
        return fetched;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching sentences:", error);
      return null;
    }
  };

  // Generate TTS for the chosen (correct) sentence and play it
  const generateAndPlayAudio = async (sentence) => {
    try {
      console.log("Generating TTS for sentence:", sentence);
      const base64Audio = await synthesizeSpeech(sentence);
      console.log("Received TTS audio. Base64 length:", base64Audio.length);
      const audioBlob = base64ToBlob(base64Audio, "audio/mpeg");
      const url = URL.createObjectURL(audioBlob);
      setMp3Url(url);
      console.log("Audio URL created:", url);
      
      // Give React a moment to update, then play the audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              console.log("TTS audio playback started.");
            })
            .catch((err) => console.error("Audio playback error:", err));
        } else {
          console.error("Audio element not available.");
        }
      }, 100);
    } catch (error) {
      console.error("Error generating TTS audio:", error);
    }
  };

  // Handle form submission: generate four sentences and choose a random correct one
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fetchedSentences = await fetchSentences(entry);
    setLoading(false);
    if (fetchedSentences && fetchedSentences.length > 0) {
      // Choose a random index (0 to 3) as the correct answer
      const randomIndex = Math.floor(Math.random() * fetchedSentences.length);
      setCorrectIndex(randomIndex);
      // Generate TTS and play audio for the chosen correct sentence
      generateAndPlayAudio(fetchedSentences[randomIndex]);
    }
  };

  // When an answer (the square) is selected, check if it's correct
  const handleSelect = (index) => {
    if (index === correctIndex) {
      // Correct answer: show green overlay and play correct.mp3
      setShowCorrect(true);
      if (correctAudioRef.current) {
        correctAudioRef.current.play().catch((err) => console.error("Correct audio error:", err));
      }
      setTimeout(() => {
        setShowCorrect(false);
        resetState();
      }, 3000);
    } else {
      // Incorrect: show red overlay, display the correct sentence, and replay TTS audio
      setShowIncorrect(true);
      if (audioRef.current) {
        audioRef.current.play().catch((err) => console.error("Audio replay error:", err));
      }
    }
  };

  // Handle replay button on the red (incorrect) overlay.
  // This button replays the TTS audio while keeping the red overlay visible.
  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Restart audio from beginning
      audioRef.current.play().catch((err) => console.error("Audio replay error:", err));
    }
  };

  // Handle return button on the red overlay.
  // This button closes the red overlay so the user can try answering again.
  const handleReturn = () => {
    setShowIncorrect(false);
  };

  // Reset the page to its default state for a new prompt
  const resetState = () => {
    setSentences([]);
    setMp3Url("");
    setIsPlaying(false);
    setEntry("");
    setCorrectIndex(null);
    setShowIncorrect(false);
  };

  // New function to replay the generated audio.
  const handleReplayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Restart from the beginning
      audioRef.current.play().catch((err) => console.error("Audio replay error:", err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col sm:flex-row items-center">
        <div className="flex flex-row items-center space-x-2">
          <label>
            <b>Enter topic: </b>
          </label>
          <input
            type="text"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="border p-2"
          />
        </div>
        <div className="flex mt-4 sm:mt-0 sm:ml-4 space-x-2">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Generate Sentences
          </button>
          <button
            type="button"
            onClick={handleRandomTopic}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Random Topic
          </button>
        </div>
      </form>

      {/* Audio element for synthesized TTS */}
      <audio ref={audioRef} src={mp3Url || undefined} preload="auto" />

      {/* Replay button for TTS audio */}
      <button onClick={handleReplayAudio} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Replay
      </button>

      {/* Render generated sentences in a two-column layout:
          Left: clickable square buttons for answer selection
          Right: non-clickable sentence display via WordBox */}
      <div className="mt-6 space-y-4 w-full max-w-10xl">
        {loading ? (
          <p>Loading sentences...</p>
        ) : sentences.length > 0 ? (
          sentences.map((sentence, idx) => (
            <div key={idx} className="flex items-center border rounded p-2">
              {/* Left column: clickable square button */}
              <button
                onClick={() => handleSelect(idx)}
                className="w-10 h-10 border border-blue-500 rounded-md flex items-center justify-center hover:bg-blue-50 focus:outline-none"
              >
                <span className="font-bold text-blue-500">{optionLabels[idx]}</span>
              </button>
              {/* Right column: sentence display */}
              <div className="ml-4">
                <WordBox text={sentence} />
              </div>
            </div>
          ))
        ) : (
          <p>No sentences available.</p>
        )}
      </div>

      {/* Hidden audio element for correct.mp3 */}
      <audio ref={correctAudioRef} src="/correct.mp3" preload="auto" />

      {/* Green overlay for correct answer */}
      {showCorrect && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-500 z-50 transition-all duration-300">
          <h1 className="text-white text-6xl">Correct</h1>
        </div>
      )}

      {/* Red overlay for incorrect answer */}
      {showIncorrect && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-red-500 z-50 transition-all duration-300 p-4">
          <h1 className="text-white text-4xl mb-4">Incorrect</h1>
          <p className="text-white text-2xl mb-4">
            The correct sentence is: <br /><em>{sentences[correctIndex]}</em>
          </p>
          <div className="flex space-x-4">
            <button onClick={handleReplay} className="px-4 py-2 bg-white text-red-500 rounded">
              Replay Audio
            </button>
            <button onClick={handleReturn} className="px-4 py-2 bg-white text-red-500 rounded">
              Return to Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}