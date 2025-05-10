// src\app\page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import Image from "next/image";

export default function Home() {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsMd(e.matches);
    mql.addEventListener("change", onChange);
    setIsMd(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const clip = isMd ? "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" : "none";

  return (
    <div className="flex-1">
      <div className="flex flex-col md:flex-row">
        <div className="align-items-center col-12 flex p-6 text-center md:col-6 md:text-left">
          <section>
            <span className="mb-1 block text-6xl font-bold">
              Welcome to Streamia!
            </span>
            <div className="text-primary mb-3 text-6xl font-bold">
              The No. 1 video streaming platform.
            </div>
            <p className="text-700 line-height-3 mt-0 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="mt-6 flex gap-2">
              <Button
                label="Check it out"
                type="button"
                className="p-button-raised mr-3"
              />
              <Button
                label="Learn more"
                type="button"
                className="p-button-outlined"
              />
            </div>
          </section>
        </div>
        <div className="relative col-12 overflow-hidden md:col-6">
          <Image
            width={768}
            height={576}
            priority={true}
            src="https://setplex.com/blog/wp-content/uploads/2022/04/video-streaming-platform-1024x576.jpg"
            alt="hero-1"
            className="object-cover md:ml-auto md:h-full"
            style={{ clipPath: clip, transition: "clip-path 0.3s ease" }}
          />
        </div>
      </div>
      <div className="surface-0 text-700 pt-10 pb-20 text-center">
        <div className="text-900 mb-3 text-5xl font-bold">Join Us!</div>
        <div className="text-700 mb-5 text-2xl">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
          numquam eligendi quos.
        </div>
        <Button
          label="Join Now"
          icon="pi pi-check-circle"
          className="p-button-raised p-button-rounded white-space-nowrap px-5 py-3 font-bold"
        />
      </div>
    </div>
  );
}
