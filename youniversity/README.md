# EML Youniversity HTML Review Files

This directory contains two standalone, browser-ready HTML pages for review before the user connects the EML Tech Studio repository.

| File | Purpose |
|---|---|
| `index.html` | Public EML Youniversity landing page with live catalogue loading, course-path filters, self-study explanation, and completion-record clarity. |
| `portal.html` | Learner portal with registration, email-plus-Learner-ID login, catalogue, enrollment, seven-week lesson view, progress, five-question quiz, and completion-record states. |
| `manifest.webmanifest` | Installable PWA metadata with `portal.html` as the start URL. |
| `university-service-worker.js` | The named University Service Worker; caches only the app shell and current update register. |
| `updates.json` | The truthful What’s New release register displayed on the public landing page. |
| `offline.html` | Honest offline fallback: learners can reopen the shell, while personal learning records still require a connection. |
| `app-suite-handoff.md` | Controlled future App Suite and new-website-branch handoff plan; it does not change the live App Suite today. |
| `ideas.md` | Chosen EML brand direction and design decisions. |
| `visual-verification.md` | Visual and dynamic-catalogue verification record. |

## Live API contract used

The pages call `https://emltechstudio-eml-tech-studio-api.hf.space`.

| User action | Route |
|---|---|
| Load disciplines | `GET /youniversity/disciplines` |
| Load course list for a discipline | `GET /youniversity/disciplines/{discipline_id}` plus `GET /youniversity/courses/{course_id}` |
| Register | `POST /youniversity/auth/register` with an email address |
| Sign in | `POST /youniversity/auth/login` with email and Learner ID |
| Enrol | `POST /youniversity/enroll` with a bearer token |
| Save section progress | `POST /youniversity/courses/{course_id}/sections/{section_id}/complete` |
| Open/submit weekly quiz | `GET` / `POST` section quiz routes |
| Check completion record eligibility | `GET /youniversity/courses/{course_id}/certificate-eligibility` |

The learner-facing API removes correct answers and explanations. The protected private dataset now contains **455 weekly quiz questions** — five for each of 91 weekly sections — and **520 final-exam questions** — 40 for each course. Internal assessment traceability connects each question to its weekly video source and EML learning activity; this metadata is not sent to learners.

## Progressive web application behaviour

The portal is the PWA start page. The site registers **University Service Worker** and can cache its landing page, learner portal, offline notice, manifest, icon, and What’s New register. The browser shows an update-ready message rather than silently replacing an open learner page.

> Login, Learner ID verification, enrollment, progress, section completion, quizzes, final exams, and certificate eligibility remain live backend requests. The service worker does not treat personal learner data or protected assessment data as offline-authoritative.

## Local preview

Run the following command from this directory:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/` for the landing page or `http://localhost:4173/portal.html` for the learner portal.

> The pages clearly label EML Youniversity as free self-study. The completion record is not a degree, academic credit, licence, professional certification, or guarantee of employment.
