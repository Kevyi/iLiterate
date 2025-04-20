'use client';

import React, { useEffect, useRef, useState } from 'react';
import WordBox from "./wordbox.jsx";

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

  


  return (
    <>
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🎙️ Speech Recognition</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={startListening}
          disabled={listening}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Start Listening
        </button>

        <button
          onClick={stopListening}
          disabled={!listening}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Stop Listening
        </button>
      </div>

      <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
        <p className="font-semibold text-gray-700 mb-2">Transcript:</p>
        <p className="text-gray-800 whitespace-pre-wrap">{transcript || 'Start speaking...'}</p>
      </div>
    </div>
    <WordBox text={data.sentence_with_blanks} correctText = {data.actual_sentence} wordsInput = {transcript ? transcript.trim().split(/\s+/) : null } correctWord1={data.correct_blank_1} correctWord2={data.correct_blank_2}/>
    </>
  );
}

export default SpeechComponent;
