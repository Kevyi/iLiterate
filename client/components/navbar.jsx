"use client";

import Image from "next/image";
import tempImage from "@/public/logo.png";
import { useEffect, useState } from "react";

export default function Navbar({ scroll = false }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!scroll) {
      setIsVisible(true);
      return;
    }

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
  }, [scroll]);

  const visibilityAnimation = `transition-transform transition-opacity duration-500 ease-in-out ${
    isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
  }`;

  return (
    <div className={`py-4 sticky top-0 z-50 bg-[#dcd2c2] font-mono ${visibilityAnimation}`}>
      <div className="transition-all duration-700 ease-in-out">
        <div className="p-5 flex h-14 items-center">
          {/* Logo */}
          <a href="/" className="mr-1 flex items-center gap-2 lg:mr-6">
            <Image src={tempImage} alt="Temp" width={50} height={50} />
            <p className="font-extrabold text-2xl text-[#1f1f1f]">iLiterate</p>
          </a>

          {/* Navigation Links */}
          <nav className="flex flex-1 justify-evenly items-center text-xl">
            {[
              { label: "Home", href: "" },
              { label: "Kevin", href: "kevin" },
              { label: "iSpeak", href: "product" },
              { label: "iListen", href: "product2" },
            ].map((nav, i) => (
              <a
                key={i}
                className="px-4 py-2 rounded-md transition-colors duration-300 hover:text-[#3c5037] text-[#1f1f1f] font-semibold"
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
