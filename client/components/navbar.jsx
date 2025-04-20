"use client";

import Image from "next/image";
import tempImage from "@/public/logo.png";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBarAnimation = `transition-all duration-300 ease-in-out ${isShrunk ? "py-2" : "py-4"}`;
  
  return (
    <>
      <div className={`${navBarAnimation} sticky top-0 z-10 bg-slate-900 border-b border-b-blue-500/50 font-sans`}>
        <div className={`${isShrunk ? "mr-auto ml-20" : ""} transition-all duration-700 ease-in-out`}>
          <div className="p-5 flex h-14 items-center">
            {/* Logo */}
            <a href="/home" className="mr-4 flex items-center gap-2 lg:mr-6">
              <Image src={tempImage} className="mr-5" alt="Temp" width={200} height={200} />
            </a>
            {/* Navigation Links */}
            <nav className="flex flex-1 justify-evenly items-center text-xl">
              <a className="transition-colors hover:text-foreground/80 text-foreground/80" href="/nav1">
                <span className="font-semibold text-yellow-500">Nav 1</span>
              </a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/80" href="/nav2">
                <span className="font-semibold text-yellow-500">Nav 2</span>
              </a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/80" href="/nav3">
                <span className="font-semibold text-yellow-500">Nav 3</span>
              </a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/80" href="/nav4">
                <span className="font-semibold text-yellow-500">Nav 4</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}