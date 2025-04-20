"use client";

import Image from "next/image";
import tempImage from "@/public/logo.png";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("nextSection");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visibilityAnimation = `transition-transform transition-opacity duration-500 ease-in-out ${
    isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
  }`;

  return (
    <div className={`py-4 sticky top-0 z-50 bg-[#e7dccb] font-mono ${visibilityAnimation}`}>
      <div className="transition-all duration-700 ease-in-out">
        <div className="p-5 flex h-14 items-center">
          {/* Logo */}
          <a href="/" className="mr-1 flex items-center gap-2 lg:mr-6">
            <Image src={tempImage} alt="Temp" width={75} height={75} />
            <p className="font-extrabold text-4xl">iLiterate</p>
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
  );
}
