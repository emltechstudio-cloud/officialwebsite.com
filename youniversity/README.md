# EML Youniversity HTML Review Files

This directory contains standalone, browser-ready EML Youniversity pages for review before deployment to the new website branch.

| File | Purpose |
|---|---|
| `index.html` | Public EML Youniversity landing page with live catalogue loading, course-path filters, self-study explanation, and completion-record clarity. |
| `portal.html` | Learner portal with display-name registration, email-plus-Learner-ID login, catalogue, enrollment, dedicated weekly notes/video/readiness/quiz routing, five-question quizzes, and Grades. |
| `dashboard.html` | Post-sign-in course home with a learner drawer, profile initial, current-course identity, seven rectangular weekly cards, and a visible final-assessment card. |
| `profile.html` | Authenticated learner profile with refreshed display name, masked email identifier, Learner ID, and account-created date. |
| `assessment.html` | Dedicated backend-gated final-assessment page that never renders final questions until eligibility is confirmed. |
| `manifest.webmanifest` | Installable PWA metadata with `portal.html` as the start URL. |
| `university-service-worker.js` | The named University Service Worker; caches only the app shell and current update register. |
| `updates.json` | The truthful What’s New release register displayed on the public landing page. |
| `offline.html` | Honest offline fallback: learners can reopen the shell, while personal learning records still require a connection. |
| `app-suite-handoff.md` | Controlled future App Suite and new-website-branch handoff plan; it does not change the live App Suite today. |
| `ideas.md` | Chosen EML brand direction and design decisions. |
| `visual-verification.md` | Visual and dynamic-catalogue verification record. |
| `dashboard-approach.md` | Modern campus-style information architecture and post-login routing rationale. |
| `learner-flow-spec.md` | Learner-facing course-home, weekly-workspace, Grades, and final-assessment interaction specification. |
| `learner-flow-data-contract.md` | Authenticated course-state and page-route contract used by the static PWA. |

## Live API contract used

The pages call `https://emltechstudio-eml-tech-studio-api.hf.space`.

| User action | Route |
|---|---|
| Load disciplines | `GET /youniversity/disciplines` |
| Load course list for a discipline | `GET /youniversity/disciplines/{discipline_id}` plus `GET /youniversity/courses/{course_id}` |
| Register | `POST /youniversity/auth/register` with email address and required new-account display name |
| Sign in | `POST /youniversity/auth/login` with email and Learner ID |
| Refresh profile | `GET /youniversity/me/profile` with a bearer token |
| Enrol | `POST /youniversity/enroll` with a bearer token |
| Save section progress | `POST /youniversity/courses/{course_id}/sections/{section_id}/complete` |
| Open/submit weekly quiz | `GET` / `POST` section quiz routes |
| Open/submit final assessment | `GET` / `POST /youniversity/courses/{course_id}/final-exam` |
| Check completion record eligibility | `GET /youniversity/courses/{course_id}/certificate-eligibility` |
| Load learner course state | `GET /youniversity/me/courses/{course_id}` |

The learner-facing API removes correct answers and explanations. The protected private dataset now contains **455 weekly quiz questions** — five for each of 91 weekly sections — and **520 final-exam questions** — 40 for each course. Internal assessment traceability connects each question to its weekly video source and EML learning activity; this metadata is not sent to learners.

## Progressive web application behaviour

The portal is the PWA start page. After a successful sign-in, it routes the learner to `dashboard.html`; the full catalogue remains available as a deliberate secondary route. The site registers **University Service Worker** and can cache its landing page, learner portal, learner dashboard, offline notice, manifest, icon, and What’s New register. The browser shows an update-ready message rather than silently replacing an open learner page.

> Login, Learner ID verification, enrollment, progress, section completion, quizzes, final exams, and certificate eligibility remain live backend requests. The service worker does not treat personal learner data or protected assessment data as offline-authoritative.

## Local preview

Run the following command from this directory:

```bash
PORT=4173 node serve-preview.mjs
```

Then open `http://localhost:4173/` for the landing page, `http://localhost:4173/portal.html` for the sign-in portal, or `http://localhost:4173/dashboard.html` for the authenticated learner workspace.

> The pages clearly label EML Youniversity as free self-study. The completion record is not a degree, academic credit, licence, professional certification, or guarantee of employment.
