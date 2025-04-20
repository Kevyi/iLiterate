"use client";

import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/popover";

function Word({ word, index, currentIndex, activeWordIndex, setActiveWordIndex, isWrong }) {
  const normalizedWord = word.replace(/[^\w']/g, "");
  const wrongWordBool = isWrong && currentIndex === index;
  const correctWordBool = index <= currentIndex - 1;
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <Popover
      open={activeWordIndex === index}
      onOpenChange={(open) => setActiveWordIndex(open ? index : null)}
    >
      <PopoverTrigger asChild>
        <span
          onClick={() => setActiveWordIndex(index)}
          style={{ cursor: "pointer", padding: "0 2px", userSelect: "none", fontSize: "30px" }}
        >
          <span className={`${correctWordBool ? "text-green-500" : ""} transition-all duration-300 ease-in-out hover:text-sky-600 hover:text-4xl`}>
            <a className={`${wrongWordBool ? "text-red-600" : ""}`}>{word}</a>
          </span>
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

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (wordsInput) {
      if (
        correctWords[currentIndex]?.toLowerCase() ===
        wordsInput[wordsInput.length - 1]?.toString().toLowerCase()
      ) {
        setCurrentIndex(currentIndex + 1);
        setIsWrong(false);
      } else {
        setIsWrong(true);
      }
    }
  }, [wordsInput]);

  useEffect(() => {
    let correctWordIndex1 = -1;
    let correctWordIndex2 = -1;
    let found = false;

    for (let i = 0; i < words.length; i++) {
      if (words[i].includes("_") && !found) {
        correctWordIndex1 = i;
        found = true;
      } else if (words[i].includes("_") && found) {
        correctWordIndex2 = i;
      }
    }

    setWords((prev) => {
      const newWords = [...prev];
      if (correctWordIndex1 !== -1 && currentIndex > correctWordIndex1) {
        newWords[correctWordIndex1] = correctWord1;
      }
      if (correctWordIndex2 !== -1 && currentIndex > correctWordIndex2) {
        newWords[correctWordIndex2] = correctWord2;
      }
      return newWords;
    });
  }, [currentIndex, correctWord1, correctWord2, words.length]);

  return (
    <>
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