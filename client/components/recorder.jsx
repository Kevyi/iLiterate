'use client';

import React, { useEffect, useRef, useState } from 'react';
import WordBox from "./wordbox.jsx";
import { Mic } from 'lucide-react';

function SpeechComponent({data}) {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  


  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        
            const result = event.results[event.results.length -1];
            const transcript = result[0].transcript;
            setTranscript(transcript)
          
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (!listening) {
        recognitionRef.current.start();
        setListening(true);
      } else {
        recognitionRef.current.stop();
        setListening(false);
      }
    }
  };

  //Press space to record.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable;
  
      if (!isTyping && e.code === 'Space') {
        e.preventDefault(); // prevent page scroll
        toggleListening();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listening]);
  
  

  
  return (
    <>


    <div className = "flex bg-gray-100">

    
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Speech Recognition</h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
              onClick={toggleListening}
              className={`cursor-pointer rounded-full w-16 h-16 flex items-center justify-center transition-colors duration-300 shadow-md ${
                listening ? 'bg-red-600 text-white' : 'bg-white text-gray-800'
              }`}
            >
            <Mic size={28} />
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
          <p className="font-semibold text-gray-700 mb-2">Transcript:</p>
          <p className="text-gray-800 whitespace-pre-wrap">{transcript || 'Start speaking...'}</p>
        </div>
      </div>

      <div className = "flex flex-col content-center max-w-xl mt-6">
        <WordBox text={data.sentence_with_blanks} correctText = {data.actual_sentence} wordsInput = {transcript ? transcript.trim().split(/\s+/) : null } correctWord1={data.correct_blank_1} correctWord2={data.correct_blank_2}/>
      </div>
    </div>
    </>
  );
}

export default SpeechComponent;
