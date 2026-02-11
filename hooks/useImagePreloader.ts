"use client";

import { useEffect, useRef, useState } from "react";

/** Frames 0..N load first so hero can show quickly; rest load in background. */
const MIN_FRAMES_TO_START = 15;
/** Max concurrent image requests to avoid browser throttling and improve throughput. */
const CONCURRENCY = 6;
/** Progress bar granularity to limit re-renders (at most this many progress updates). */
const PROGRESS_STEPS = 24;

type SequenceResponse = { urls: string[] };

function loadImage(
  src: string,
  signal: AbortSignal
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const onDone = () => {
      img.onload = null;
      img.onerror = null;
    };
    img.onload = () => {
      onDone();
      resolve(img);
    };
    img.onerror = () => {
      onDone();
      reject(new Error(`Failed to load ${src}`));
    };
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    signal.addEventListener("abort", () => {
      img.src = "";
      onDone();
      reject(new DOMException("Aborted", "AbortError"));
    });
    img.src = src;
  });
}

/** Run async tasks with a concurrency limit. */
async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  signal: AbortSignal,
  run: (item: T, index: number) => Promise<void>
): Promise<void> {
  let next = 0;
  let inFlight = 0;
  let done = false;

  return new Promise((resolve) => {
    const runNext = async () => {
      if (done || signal.aborted) {
        if (inFlight === 0) resolve();
        return;
      }
      if (next >= items.length) {
        if (inFlight === 0) resolve();
        return;
      }
      const index = next++;
      inFlight++;
      try {
        await run(items[index], index);
      } catch (e) {
        if ((e as Error)?.name !== "AbortError") done = true;
        if (inFlight === 0) resolve();
        return;
      } finally {
        inFlight--;
      }
      runNext();
    };

    for (let i = 0; i < Math.min(concurrency, items.length); i++) {
      runNext();
    }
  });
}

export function useImagePreloader() {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const maxLoadedIndexRef = useRef(-1);
  const lastProgressStepRef = useRef(-1);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let loadedCount = 0;
    let n = 0;
    const imagesByIndex: (HTMLImageElement | null)[] = [];

    const setProgressThrottled = (count: number, total: number) => {
      const step = total <= 0 ? 0 : Math.floor((count / total) * PROGRESS_STEPS);
      if (step !== lastProgressStepRef.current && step <= PROGRESS_STEPS) {
        lastProgressStepRef.current = step;
        setProgress(count / total);
      }
    };

    const onFrameLoaded = (index: number, img: HTMLImageElement | null) => {
      if (signal.aborted) return;
      imagesByIndex[index] = img;
      loadedCount++;
      maxLoadedIndexRef.current = Math.max(maxLoadedIndexRef.current, index);
      imagesRef.current = imagesByIndex;
      setProgressThrottled(loadedCount, n);

      if (imagesByIndex[0] != null) setIsReady(true);
      if (loadedCount === n) setIsReady(true);
    };

    (async () => {
      try {
        const res = await fetch("/api/sequence", { signal });
        if (!res.ok) throw new Error("Failed to fetch sequence");
        const data = (await res.json()) as SequenceResponse;
        const urls = data?.urls;
        if (!Array.isArray(urls) || urls.length === 0) {
          setError("No sequence images found");
          return;
        }
        if (signal.aborted) return;

        n = urls.length;
        setTotalFrames(n);
        imagesByIndex.length = n;
        imagesByIndex.fill(null);

        const priorityIndices = Array.from(
          { length: MIN_FRAMES_TO_START },
          (_, i) => i
        ).filter((i) => i < n);
        const restIndices = Array.from({ length: n }, (_, i) => i).filter(
          (i) => i >= MIN_FRAMES_TO_START
        );

        await runWithConcurrency(
          priorityIndices,
          CONCURRENCY,
          signal,
          async (frameIndex) => {
            try {
              const img = await loadImage(urls[frameIndex], signal);
              onFrameLoaded(frameIndex, img);
            } catch {
              onFrameLoaded(frameIndex, null);
            }
          }
        );

        if (signal.aborted) return;

        await runWithConcurrency(
          restIndices,
          CONCURRENCY,
          signal,
          async (frameIndex) => {
            try {
              const img = await loadImage(urls[frameIndex], signal);
              onFrameLoaded(frameIndex, img);
            } catch {
              onFrameLoaded(frameIndex, null);
            }
          }
        );
      } catch (e) {
        if (signal.aborted) return;
        const message =
          e instanceof Error ? e.message : "Failed to load sequence";
        if ((e as Error)?.name !== "AbortError") setError(message);
      }
    })();

    return () => {
      controller.abort();
      imagesRef.current = [];
      maxLoadedIndexRef.current = -1;
      imagesByIndex.forEach((img) => img && (img.src = ""));
    };
  }, []);

  return {
    imagesRef,
    maxLoadedIndexRef,
    isReady,
    progress,
    totalFrames,
    error,
  };
}
