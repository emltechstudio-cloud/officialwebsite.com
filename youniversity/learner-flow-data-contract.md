# Learner Flow Data Contract

## Current course contract

The existing public course endpoint already provides the core content for the weekly learning route. Each course exposes a chronologically ordered `sections` array. Every section supplies a `section_id`, week/order, title, `video_source_id`, objectives, guided practice, independent variation, review checklist, evidence artifact, and quiz blueprint. A matching object in `source_registry` provides the credited provider, title, creator, canonical URL, and optional YouTube embed ID.

The new weekly **notes and outcomes** screen can therefore be constructed from the public section material without placing private answers or backend course text in the frontend. It should label EML-authored activity material clearly and separately from the third-party credited source.

| Learner screen | Existing data | Protected boundary |
|---|---|---|
| Course home week card | `sections[].week`, `title`, objectives, learner completion and quiz attempt state | No questions or correct answers are needed. |
| Notes and outcomes | objectives, guided practice, independent variation, review checklist, evidence artifact | The frontend does not invent a score or completion record. |
| Credited video | `source_registry` entry selected by `video_source_id` | The player/link is a credited external source; EML guidance remains independent. |
| Quiz readiness | section title, outcome, evidence artifact, quiz blueprint | No questions are loaded until the learner explicitly starts the quiz. |
| Quiz and result | learner-safe questions from the authenticated section quiz endpoint; score from its submit endpoint | Correct option IDs, explanations, and source traceability stay private. |

## Existing learner-state contract

The authenticated `GET /youniversity/me/courses/{course_id}` endpoint returns a learner-specific `state`. The state contains completed section records, quiz attempts, a final-assessment attempt if one exists, progress data, and backend-derived completion eligibility. Quiz and final records store the count of correct answers, total question count, and timestamp; they do not store selected answers. This supports a truthful Grades view without requiring a new backend endpoint.

| Grade row | State source | Display rule |
|---|---|---|
| Weekly quiz | `state.section_quiz_attempts` matched by `section_id` | Show Not attempted or the recorded score percentage and attempt time. |
| Final assessment | `state.final_exam` | Show Not available, Ready, or the recorded score percentage and attempt time. |
| Completion record | `state.completion_eligible` plus `completion_record` | Render only when the backend confirms eligibility. |

## Routing contract to implement

The new route model stays within the existing static PWA package:

| Route | Purpose |
|---|---|
| `dashboard.html` | Authenticated learner shell, menu, profile initial, current course, week cards, and concise course status. |
| `portal.html?course={id}&discipline={id}&section={id}` | Dedicated weekly route. A `step=notes`, `step=video`, `step=ready`, or `step=quiz` parameter will select the clearly separated weekly screen. |
| `portal.html?course={id}&discipline={id}&grades=1` | Dedicated Grades view for the selected active course. |
| `portal.html?catalogue=1` | Separate course catalogue. |

This route model preserves the existing backend boundary: the browser requests learning material and learner-safe questions only when needed, while scoring, eligibility, and durable progress remain controlled by the backend.
