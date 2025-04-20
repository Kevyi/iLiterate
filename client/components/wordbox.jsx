"use client";

import { useState, useEffect, useReducer } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/popover";

function Word({ word, index, currentIndex, activeWordIndex, setActiveWordIndex, isWrong}) {
  const normalizedWord = word.replace(/[^\w']/g, "");
  const wrongWordBool = isWrong && currentIndex  == index;
  const correctWordbool = index <= currentIndex -1;


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
          <span className = {`${correctWordbool ? "text-green-500": ""} transition-all duration-300 ease-in-out hover:text-sky-600 hover:text-4xl`}>
            <a className = {`${wrongWordBool ? "text-red-600" : ""}`}>{word}</a>
          </span>
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
  const [currentWords, setCurrentWords] = useState([]);
  //const words = text.split(" ");
  const correctWords = correctText.split(" ");
  const [words, setWords] = useState(text.split(" "));

  const [, forceUpdate] = useReducer(x => x + 1, 0);



  //currentIndex tracks current wor.


  //remove commas, periods, 

  useEffect(() => {

   
    
    

    if(wordsInput){
      
      
      // for(const wordInput in wordsInput){
      //   if(words[currentIndex].toLowerCase() == wordInput.toString().toLowerCase()){
      //     setCurrentIndex(currentIndex + 1);
      //   }
      // }

      if(correctWords[currentIndex].toLowerCase() == wordsInput[wordsInput.length -1].toString().toLowerCase()){
        setCurrentIndex(currentIndex + 1);
        setIsWrong(false);
      }else{
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
  }, [currentIndex]);
  
  

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