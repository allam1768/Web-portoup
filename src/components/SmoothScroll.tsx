"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });
    
    // Optional: Log to verify it's running
    // console.log("Lenis initialized");

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
