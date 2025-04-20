"use client";

import Image from "next/image";
import tempImage from "@/public/logo.png";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBarAnimation = `transition-all duration-300 ease-in-out ${isShrunk ? "py-2" : "py-4"}`;
  const visibilityAnimation = `transition-transform transition-opacity duration-700 ease-in-out ${
    isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
  }`;

  return (
    <>
      <div className={`${navBarAnimation} ${visibilityAnimation} sticky top-0 z-10 bg-[#e7dccb] font-mono`}>
        <div className={`${isShrunk ? "mr-auto ml-20" : ""} transition-all duration-700 ease-in-out`}>
          <div className="p-5 flex h-14 items-center">
            {/* Logo */}
            <a href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
              <Image src={tempImage} className="mr-5" alt="Temp" width={200} height={200} />
            </a>
            {/* Navigation Links */}
            <nav className="flex flex-1 justify-evenly items-center text-xl">
              {[
                { label: "Product", href: "product" },
                { label: "Kevin", href: "kevin" },
                { label: "Log In", href: "login" },
                { label: "Sign Up", href: "signup" },
              ].map((nav, i) => (
                <a
                  key={i}
                  className="px-4 py-2 rounded-md transition-colors duration-300 hover:bg-blue-600 text-yellow-500 font-semibold"
                  href={`/${nav.href}`}
                >
                  {nav.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}