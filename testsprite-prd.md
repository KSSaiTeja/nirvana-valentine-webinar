# Product Requirements – Nirvana Valentine Webinar Landing Page

## Overview
Single-page marketing site for a live webinar on Feb 14, 2026. Goal: inform users and drive registrations at ₹499 (incl. GST).

## Core Features

### Hero
- Scroll-driven image sequence (canvas) with headline: "Love Grows. So Should Your Wealth."
- Subtext: Valentine's financial partner message; date, duration (90 min), price.
- Primary CTA: "Reserve my seat." (opens registration modal).
- Secondary CTA: "Scroll to know more" (scroll to #details).

### Preloader
- Black screen with logo; logo fades out when content is ready (minimum display time ~1.4s).

### Sections (below hero)
- **Not for** – Who the webinar is not for.
- **Why this matters** – Value proposition.
- **In 90 minutes** – What attendees will learn.
- **Webinar details** – Date, time, format, price, CTA "Reserve my seat."
- **Footer** – Links and branding.

### Registration flow
- "Reserve my seat" opens a modal.
- Form: name, email, phone (or similar); submit triggers API (e.g. `/api/register`).
- Success: thank-you state or redirect; errors shown in modal.

### Header
- Sticky header with logo/brand and CTA "Reserve my seat."

## Technical context
- Next.js (App Router), React, TypeScript.
- Frontend runs at `http://localhost:3000` in development.
- No login required for viewing; registration is the main conversion action.

## Test focus
- Hero and preloader load and animate.
- All "Reserve my seat" CTAs open the registration modal.
- Scroll and navigation (e.g. #details) work.
- Registration form submits and shows success/error.
- Layout is responsive; header and footer present.
