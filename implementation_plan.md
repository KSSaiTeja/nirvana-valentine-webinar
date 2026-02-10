# Scroll-Driven Hero — Implementation Plan

A blueprint for building a Jesko Jets–style scroll-driven image-sequence hero in Next.js. Use this document to implement or hand off to a coding agent.

---

## 1. Overview

**Goal:** A full-viewport hero where an image sequence (clouds/atmosphere) advances in sync with scroll. The hero stays sticky while the user scrolls through a tall spacer; scroll progress (0→1) maps to frame index (0→N−1). Smooth scroll via Lenis; optional overlay copy and “Scroll down” CTA.

**Reference:** [Jesko Jets](https://jeskojets.com/) — luxury private aviation site: dark, minimal, scroll-driven hero with “We are movement” / “Your freedom to enjoy life” and scroll-to-explore feel.

**Scope (this phase):** Hero section only. Rest of page (sections, copy, CTAs) to be added later.

---

## 2. Technology Stack

| Layer        | Choice |
|-------------|--------|
| Framework   | Next.js 14+ (App Router) |
| Language    | TypeScript |
| Styling     | Tailwind CSS |
| Animation   | Framer Motion (for overlay/UI) |
| Smooth Scroll | Lenis (`lenis` npm package) |

---

## 3. Asset Specification

**Location:** `/public/video-sequence-1/`

**Naming:** `ezgif-frame-001.jpg` … `ezgif-frame-120.jpg` (120 frames, zero-padded to 3 digits).

**Usage:** Load as image URLs (e.g. `/video-sequence-1/ezgif-frame-001.jpg`). Map scroll progress to `frameIndex = Math.min(floor(progress * 120), 119)`.

---

## 4. Visual & UX Direction

- **Aesthetic:** Minimalist, premium, dark-mode luxury (Jesko Jets–inspired).
- **Background:** Deep black `#050505`.
- **Text:** High-contrast white; elegant sans-serif (Inter or Geist), wide letter-spacing.
- **Hero:** Full viewport; canvas fills container; overlay copy and “Scroll down” are optional placeholders until final copy is provided.

---

## 5. Architecture

### 5.1 High-Level Structure

```
app/
  layout.tsx          — Root layout; Lenis/SmoothScroll wrapper (client)
  page.tsx            — Home: <SmoothScroll><HeroScroll /></SmoothScroll>
  globals.css         — #050505, typography, base styles
components/
  HeroScroll.tsx      — Sticky hero; canvas; scroll progress → frame
  SmoothScroll.tsx    — Lenis init, RAF loop, children
hooks/
  useImagePreloader.ts — Preload sequence images; return loaded count / ready
  useScrollProgress.ts — Optional: normalized scroll progress for hero section
```

### 5.2 Data Flow

1. **Lenis** wraps the page and provides smooth scroll.
2. **HeroScroll** lives inside a tall wrapper (e.g. `h-[400vh]`). The hero container is `position: sticky; top: 0; height: 100vh`.
3. **Scroll progress** is computed from scroll position relative to the tall wrapper (e.g. `progress = scrollY / (wrapperHeight - viewportHeight)`), clamped to `[0, 1]`.
4. **Frame index:** `frameIndex = Math.min(Math.floor(progress * totalFrames), totalFrames - 1)`.
5. **Canvas** draws the preloaded image at `frameIndex` each frame (e.g. in `requestAnimationFrame` or on scroll/raf).
6. **useImagePreloader** loads all sequence image URLs and exposes a “ready” state and optionally the list of loaded `HTMLImageElement`s or image URLs for drawing.

---

## 6. Component & Logic Detail

### 6.1 SmoothScroll (Lenis)

- **Type:** Client component (`"use client"`).
- **Responsibilities:** Create Lenis instance, run `lenis.raf(time)` in requestAnimationFrame, pass scroll position or progress to children if needed (or children read from ref/context).
- **Integration:** Optionally use a React context to expose Lenis instance or scroll position so HeroScroll can read scroll. Alternatively, HeroScroll can use a ref to a tall wrapper and listen to `window` scroll (or use a shared store).
- **Cleanup:** Destroy Lenis on unmount; cancel RAF.

### 6.2 HeroScroll

- **Type:** Client component.
- **Structure:**
  - Outer wrapper: tall block (e.g. `h-[400vh]`) so user has scroll distance.
  - Inner sticky wrapper: `sticky top-0 h-screen w-full` containing:
    - A `<canvas>` that fills the sticky container (100vw × 100vh).
    - Optional overlay: headline + subline + “Scroll down” (placeholder copy).
- **Canvas logic:**
  - Get canvas context `2d`.
  - On scroll (or on each RAF): compute progress from scroll position relative to outer wrapper (using refs or scroll listener). Compute `frameIndex` from progress and total frames (120).
  - Draw the frame: use preloaded image for `frameIndex`. Draw image to fill canvas (e.g. `ctx.drawImage(img, 0, 0, canvas.width, canvas.height)` with scaling to cover/contain as desired).
- **Image source:** Either use preloaded `HTMLImageElement[]` from `useImagePreloader`, or draw from image URLs by ensuring the correct frame’s image is loaded (preloading is strongly recommended for smooth playback).
- **Resize:** On window resize, set canvas width/height to container dimensions (and adjust CSS so it stays full viewport).

### 6.3 useImagePreloader

- **Input:** Array of image URLs (e.g. generate list for `ezgif-frame-001.jpg` … `ezgif-frame-120.jpg`).
- **Behavior:** Create `Image()` for each URL, set `src`, and track `onload`/`onerror`. Count loaded; when all loaded (or after a timeout), set “ready” to true.
- **Output:** `{ images: HTMLImageElement[], isReady: boolean, progress?: number }` so HeroScroll can use `images[frameIndex]` for drawing and optionally show a loading state until `isReady`.

### 6.4 Scroll Progress

- **Option A:** HeroScroll uses a ref on the outer tall wrapper and listens to scroll (or to Lenis’ scroll event). Compute `progress = (scrollY - sectionTop) / (sectionHeight - viewportHeight)`, clamp to [0, 1].
- **Option B:** Expose scroll position from Lenis in context; HeroScroll gets section bounds and computes progress the same way.

---

## 7. Performance

- **Preload:** useImagePreloader runs once and caches all 120 images so no network requests during scroll.
- **Canvas:** Single 2d context; only one image drawn per frame; avoid creating new Image objects during scroll.
- **RAF:** Tie Lenis and canvas updates to a single requestAnimationFrame loop if possible to avoid layout thrash.
- **Lazy:** Hero (and Lenis) can be above the fold; no need to lazy-load the hero for initial paint.

---

## 8. Styling Checklist

- Body/root background: `#050505`.
- Tailwind: Use `bg-[#050505]`, `text-white`, `tracking-wide` (or custom letter-spacing).
- Font: Geist or Inter from `next/font/google`.
- Canvas: `w-full h-full object-cover` (or equivalent) so it fills the sticky viewport; avoid overflow hidden on the wrong parent so sticky works.

---

## 9. File-by-File Summary

| File | Purpose |
|------|--------|
| `implementation_plan.md` | This blueprint. |
| `app/layout.tsx` | Fonts, metadata, dark background; wrap children in SmoothScroll. |
| `app/page.tsx` | Render SmoothScroll and HeroScroll only (hero section). |
| `app/globals.css` | #050505, typography variables. |
| `components/SmoothScroll.tsx` | Lenis init, RAF, cleanup. |
| `components/HeroScroll.tsx` | Sticky hero, canvas, scroll→frame, overlay placeholder. |
| `hooks/useImagePreloader.ts` | Preload 120 frames; return images + isReady. |

---

## 10. Testing Checklist

- [ ] Page loads; Lenis smooth scroll is active.
- [ ] Hero is sticky; scrolling through the tall section advances the sequence from frame 0 to 119.
- [ ] No visible jumps or missing frames once preload is complete.
- [ ] Resize window; canvas resizes and keeps correct aspect/cover.
- [ ] Copy and “Scroll down” are placeholders; easy to replace later.

---

## 11. Future Extensions (Out of Scope Here)

- Replace placeholder copy and add final CTA.
- Add more sections below the hero.
- Optional: parallax or Framer Motion animations on overlay text keyed to scroll progress.
- Optional: reduce motion / prefers-reduced-motion: use a single frame or shortened sequence.
