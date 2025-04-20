"use client";

import WordBox from "../../components/wordbox.jsx";
import { Button } from "../../components/button.jsx";
import Navbar from "@/components/navbar.jsx";
import { Skeleton } from "../../components/skeleton.jsx";
import { useEffect, useState } from "react";

export default function testPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setText("Generated text goes here! Hello, 123");
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <Navbar />
      <div>test</div>
      <div className="flex justify-evenly items-center">
        <div className="flex border border-gray-300 rounded-md p-4">
          {loading ? (
            <Skeleton className="h-16 w-[300px]" />
          ) : (
            <WordBox text={text} />
          )}
        </div>
      </div>
    </>
  );
}
