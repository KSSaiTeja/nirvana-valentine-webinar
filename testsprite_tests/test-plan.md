# TestSprite Test Plan – Nirvana Valentine Webinar

Derived from `testsprite-prd.md`. Use with **Application URL**: `http://localhost:3000`. No test account (no login).

---

## 1. Preloader

| # | Step | Expected |
|---|------|----------|
| 1.1 | Load `http://localhost:3000` | Black preloader with logo visible. |
| 1.2 | Wait for content ready (~1.4s minimum) | Logo fades out; main page content appears. |

---

## 2. Hero and scroll-driven sequence

| # | Step | Expected |
|---|------|----------|
| 2.1 | On initial load (after preloader) | Hero visible with scroll-driven image sequence (canvas). |
| 2.2 | Verify copy | Headline: "Love Grows. So Should Your Wealth."; subtext with Valentine's message, date, duration (90 min), price. |
| 2.3 | Verify primary CTA | Button/link "Reserve my seat." present. |
| 2.4 | Verify secondary CTA | "Scroll to know more" or similar; links to or scrolls to `#details`. |

---

## 3. Reserve my seat – modal open (all CTAs)

| # | Step | Expected |
|---|------|----------|
| 3.1 | Click "Reserve my seat." in hero | Registration modal opens. |
| 3.2 | Close modal; click "Reserve my seat." in header | Registration modal opens. |
| 3.3 | Close modal; click "Reserve my seat." in Not for section | Registration modal opens. |
| 3.4 | Close modal; click "Reserve my seat." in In 90 minutes section | Registration modal opens. |
| 3.5 | Close modal; click "Reserve my seat." in Webinar details section | Registration modal opens. |

---

## 4. Scroll and navigation (#details)

| # | Step | Expected |
|---|------|----------|
| 4.1 | Click "Scroll to know more" (or scroll to #details) | Page scrolls to section with id `details` (webinar details). |
| 4.2 | Navigate to `http://localhost:3000/#details` | Page loads and shows webinar details section in view. |

---

## 5. Registration form – validation and submit

| # | Step | Expected |
|---|------|----------|
| 5.1 | Open modal; submit empty form | Validation prevents submit; required fields (name, email, phone) indicated. |
| 5.2 | Enter invalid phone (e.g. 12345); fill name/email; submit | Error shown: valid 10-digit Indian mobile required. |
| 5.3 | Enter valid name, email, phone (e.g. 9876543210); submit | Either: success (thank-you state then redirect to payment), or API error shown in modal. |

**Note:** Success path posts to `/api/register`; backend may return 500 if Google Sheet env is not set. Test can assert modal shows success or a clear error message.

---

## 6. Sections and content

| # | Step | Expected |
|---|------|----------|
| 6.1 | Scroll through page | Sections present: Not for, Why this matters, In 90 minutes, Webinar details. |
| 6.2 | Check footer | Footer visible with links and branding. |

---

## 7. Header (sticky)

| # | Step | Expected |
|---|------|----------|
| 7.1 | Scroll down | Header remains visible (sticky) with logo and "Reserve my seat." CTA. |

---

## 8. Responsive layout

| # | Step | Expected |
|---|------|----------|
| 8.1 | Resize viewport to mobile width (~375px) | Layout adapts; header and footer present; CTAs usable. |
| 8.2 | Resize to tablet and desktop | No horizontal overflow; content readable. |

---

## Configuration summary for TestSprite

- **Testing type:** Frontend (UI and user flows).
- **Scope:** Codebase (full project) or Code Diff (recent changes).
- **Application URL:** `http://localhost:3000`
- **Test account:** (none)
- **PRD:** Use repo file `testsprite-prd.md`.
