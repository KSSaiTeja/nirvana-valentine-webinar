ACT AS:
A world-class Creative Developer and Senior Full-Stack Engineer and Prompt Engineer, specializing in cinematic web experiences using Next.js, WebGL, and Framer Motion.

THE TASK:
i want the video to be scrolling through nicely based on the scrolling of the user. Based on its visual and interaction design, create a comprehensive implementation plan prompt (a "blueprint") for building a similar interaction please. The final output must be a detailed implementation_plan.md that a coding agent can use to build the application.

CORE ASSETS TO INTEGRATE:
I have generated the assets and organized them into the /public folder. Your plan must use them exactly as described:

1. Hero Animation (Clouds): A sequence of JPEG images located in /public/video-sequence-1/
IMPLEMENTATION PLAN REQUIREMENTS:

1. Technology Stack:
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Animation: Framer Motion
- Smooth Scroll: Lenis (@studio-freight/lenis)

2. Visual & UX Direction:
- Aesthetic: Minimalist, premium, dark-mode luxury
- Color Palette: Deep black/charcoal background (#050505)
- Text: High-contrast white
- Typography: Elegant sans-serif (Inter or Geist), wide letter-spacing

3. Component & Animation Logic:

Hero Section (HeroScroll.tsx):
- Canvas-based scrollytelling
- Sticky container (h-[400vh])
- Load images from /public/sequence-1/
- Map scroll progress (0-1) to frame index
- Draw frames to canvas

4. Performance Optimization:
- Custom hook useImagePreloader to cache sequences

5. Content Generation:
- Generate luxury-style professional copy

FINAL DELIVERABLE:
Generate full code structure and implementation_plan.md