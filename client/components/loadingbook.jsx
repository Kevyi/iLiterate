"use client";

import Image from "next/image";

export default function LoadingBook({ width = 100}) {
  return (
    <div className="flex justify-center items-center p-4">
      <Image
        src="/loading.gif"
        alt="Loading..."
        width={width}
        height={width}
        style={{ filter: "grayscale(100%) brightness(0.2)" }}
      />
    </div>
  );
}

export { LoadingBook };
