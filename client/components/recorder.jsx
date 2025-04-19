'use client';

import React from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

export default function SpeechComponent() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check for browser support
  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleStart = () => {
    SpeechRecognition.startListening({
      continuous: true, // keep listening continuously 
      language: 'en-US', // set the language
      interimResults: true, // get interim results
    });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };



  //Will continue to listen as long as all the words are met.



  return (
    <>
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🎙️ Voice Input</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Start
        </button>

        <button
          onClick={handleStop}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Stop
        </button>

        <button
          onClick={resetTranscript}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
        <p className="text-sm text-gray-600 mb-2">
          Listening: <span className={listening ? 'text-green-600' : 'text-red-600'}>
            {listening ? 'Yes' : 'No'}
          </span>
        </p>
        <p className="text-gray-800 whitespace-pre-wrap font-mono">{transcript || 'Say something...'}</p>
      </div>
    </div>
    </>
  );
}
