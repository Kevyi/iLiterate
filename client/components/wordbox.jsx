"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/popover";

function Word({ word, index, activeWordIndex, setActiveWordIndex }) {
  const normalizedWord = word.replace(/[^\w']/g, "");
  return (
    <Popover
      open={activeWordIndex === index}
      onOpenChange={(open) => setActiveWordIndex(open ? index : null)}
    >
      <PopoverTrigger asChild>
        <span
          onClick={() => setActiveWordIndex(index)}
          style={{ cursor: "pointer", padding: "0 2px", userSelect: "none", fontFamily: "sans-serif", fontSize: "30px" }}
        >
          <b className = "transition-all duration-300 ease-in-out hover:text-sky-600 hover:text-4xl ">{word}</b>
        </span>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-64">
        <p className="text-base">Definition for "{normalizedWord}" goes here...</p>
      </PopoverContent>
    </Popover>
  );
}

export default function WordBox({ text }) {
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const words = text.split(" ");

  return (
    <div style={{ lineHeight: "2em", fontSize: "18px", flexWrap: "wrap" }}>
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        const next = words[index + 1];
        const needsSpace =
          !/\s/.test(word) && !/[^\w\s]/.test(word) && !/^\s/.test(next ?? "");

        return (
          <span key={index} style={{ display: "inline" }}>
            <Word
              word={word}
              index={index}
              activeWordIndex={activeWordIndex}
              setActiveWordIndex={setActiveWordIndex}
            />
            {needsSpace && " "}
          </span>
        );
      })}
    </div>
  );
}