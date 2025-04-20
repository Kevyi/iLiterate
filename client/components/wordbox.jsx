"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/popover";

function Word({ word, index, currentIndex, activeWordIndex, setActiveWordIndex, isWrong}) {
  const normalizedWord = word.replace(/[^\w']/g, "");

  const wrongWordBool = isWrong && currentIndex + 1 === index;
  const correctWordbool = index <= currentIndex;

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
          <a className = {`${correctWordbool ? "text-green-500": ""} ${wrongWordBool ? "text-500-red" : ""} transition-all duration-300 ease-in-out hover:text-sky-600 hover:text-4xl`}>{word}</a>
        </span>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-64">
        <p className="text-base">Definition for "{normalizedWord}" goes here...</p>
      </PopoverContent>
    </Popover>
  );
}

export default function WordBox({ text, correctText, wordsInput, correctWord1, correctWord2 }) {
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = text.split(" ");

  //indexNum tracks current word that needs to be read.

  //currentIndex tracks word that has been read.
  const wordsInputs = wordsInput;


  //remove commas, periods, 

  useEffect(() => {
    for(const wordInput in wordsInput){
      // if(words[currentIndex].toLowerCase() === wordInput.toLowerCase()){
      //   setCurrentIndex(currentIndex + 1);
      // }
      
    }

  }, [wordsInput]);
  

  
  

  return (
    <>
    <a>{currentIndex}</a>
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
              currentIndex = {currentIndex}
              activeWordIndex={activeWordIndex}
              setActiveWordIndex={setActiveWordIndex}
              isWrong = {isWrong}
            />
            {needsSpace && " "}
          </span>
        );
      })}
    </div>
    </>
  );
}