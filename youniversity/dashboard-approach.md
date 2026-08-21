# EML Youniversity Learner Dashboard Approach

## Purpose

After sign-in, learners should arrive at a **single clear course home**, not at a full catalogue or an abstract progress summary. The page answers five questions in order: **Where am I? What course am I in? What module should I open now? What remains after it? How is my work progressing?**

## Information hierarchy

| Priority | Dashboard area | Learner-facing purpose |
|---|---|---|
| 1 | Course header | Names the active course, confirms the course is free self-study, and gives a visible completion summary. |
| 2 | Course navigation | Provides explicit Home, Course Modules, Activities, Progress, and Course Information destinations. On mobile this becomes a slide-out course menu. |
| 3 | Current module | Shows the present week’s credited source, practical outcome, evidence artifact, five-question quiz, and one clear “Open this lesson” action. |
| 4 | Course modules | Displays all seven weekly modules as large, individually readable cards with progress state, lesson count, activity/quiz expectations, and direct opening actions. |
| 5 | Final assessment | Always displays a separate final-assessment card after Week 7. It states the 40-question, one-attempt rule and clearly explains whether it is locked, ready, or already recorded. |
| 6 | Learning record | Summarises completed weekly modules, attempted weekly quizzes, assessment status, and the backend-controlled completion-record rule. |
| 7 | Course discovery | Keeps course catalogue access as a secondary option outside the learner’s active course path. |

## Routing rule

The existing `portal.html` remains the **sign-in and account-creation start URL**. A successful login redirects to `dashboard.html`. `dashboard.html` reads the stored authenticated session and uses live API calls to load the learner profile, enrolled courses, course section data, and progress. A module card opens the linked section in `portal.html` through a `section` query parameter, so a learner can go directly to the first, current, or final weekly lesson without manually searching the course view. The final assessment opens only through the existing backend eligibility gate.

## Visual direction

The dashboard retains the **Signal Classroom** identity: EML violet and cyan rails, warm-white paper workspace, Sora for decisive hierarchy, and DM Sans for instructional detail. The design shifts from compact milestone tiles to high-clarity course-module cards, inspired by the practical structure of a familiar online campus while remaining recognisably EML. Desktop uses a slim course navigation rail, a wide module canvas, and a concise progress column. Mobile uses a visible course-home header and slide-out navigation; the current module appears first, followed by every weekly card and the final-assessment card in a natural reading sequence.

## Scope boundaries

The dashboard must show sources with creator credit and open them in the learner’s browser. It must never place assessment answers, private source traceability, or a degree-equivalent claim in the client. Certificates remain backend-verified completion records only.
