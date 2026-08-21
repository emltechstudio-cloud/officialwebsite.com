# EML Youniversity PWA Approach

## Decision

EML Youniversity will become an **installable browser app** without adding a recurring background job or a fixed app count. The portal remains the start page. A file named **`university-service-worker.js`** caches the branded app shell for offline reopening, while the live course catalogue and learner data remain network-first so course changes and saved progress are never treated as permanently offline data.

| Approach | Trade-offs | Ongoing cost | Setup complexity |
|---|---|---:|---:|
| **Chosen: cached shell + live data** | Landing, portal, styles, icons, and the latest known update register can reopen offline. Courses, assessment questions, login, progress, and certificate eligibility still require a connection. This avoids presenting stale learner data as current. | None beyond normal hosting | Low |
| Cache the full course catalogue and learner activity | Gives a richer offline reading experience, but risks exposing out-of-date course content, stale assessment availability, or old learner progress until the next refresh. | None beyond normal hosting | Medium |
| Add a separate background refresh process | Could collect release information independently, but is unnecessary because updates can be published with the course files and current API. It adds operational complexity without improving the core learner experience. | Potential hosting/operations cost | High |

## Update experience

The hamburger menu contains a **What’s New** route. Its content comes from `updates.json`, a small release register that is updated when EML adds or materially changes a course or platform feature. The service worker caches the latest known register, then refreshes it whenever the browser is online.

When a new app version is installed, the current page shows a concise “A new Youniversity version is ready” message with a **Refresh now** action. The service worker does not silently replace an active learner page during a quiz or lesson.

## Cache boundaries

| Cached for offline shell | Never treated as offline-authoritative |
|---|---|
| `index.html`, `portal.html`, the manifest, icons, `updates.json`, and `offline.html` | Learner authentication, Learner ID verification, enrollment, progress, section completion, quizzes, final exams, and certificate eligibility |

The PWA is therefore useful when a learner reopens the app with an unreliable connection, but it preserves backend authority for personal learning records and protected assessment delivery.
