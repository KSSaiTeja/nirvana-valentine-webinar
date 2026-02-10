"use client";

import { useEffect, useState } from "react";

export function useImagePreloader() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const imgElements: HTMLImageElement[] = [];

    async function load() {
      try {
        const res = await fetch("/api/sequence");
        if (!res.ok) throw new Error("Failed to fetch sequence");
        const { urls } = await res.json();
        if (!Array.isArray(urls) || urls.length === 0) {
          setError("No sequence images found");
          return;
        }
        if (cancelled) return;

        setTotalFrames(urls.length);
        let loaded = 0;

        const checkComplete = () => {
          if (cancelled) return;
          setProgress(loaded / urls.length);
          if (loaded === urls.length) {
            setImages(imgElements);
            setIsReady(true);
          }
        };

        urls.forEach((src: string) => {
          const img = new Image();
          img.onload = () => {
            loaded++;
            checkComplete();
          };
          img.onerror = () => {
            loaded++;
            checkComplete();
          };
          img.src = src;
          imgElements.push(img);
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load sequence");
      }
    }

    load();
    return () => {
      cancelled = true;
      imgElements.forEach((img) => (img.src = ""));
    };
  }, []);

  return { images, isReady, progress, totalFrames, error };
}
