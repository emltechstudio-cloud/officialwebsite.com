# EML Youniversity Learner Dashboard Approach

## Purpose

After sign-in, learners should arrive at a **single clear workspace**, not at a full catalogue. The page answers four questions in order: **Where am I? What do I do next? What will I study this week? How is my work progressing?**

## Information hierarchy

| Priority | Dashboard area | Learner-facing purpose |
|---|---|---|
| 1 | Account strip | Confirms the signed-in learner, their account-level Learner ID, and a secure sign-out action. |
| 2 | Current course focus | Names the active course, shows its completion state, and gives one explicit “Continue Week” action. |
| 3 | This week’s learning brief | Makes the credited video/source, weekly learning objective, guided practice, independent variation, review checklist, and evidence artifact visible before a learner opens the learning room. |
| 4 | Seven-week pathway | Shows every week as a readable sequence with current, completed, and upcoming states. |
| 5 | Learning record | Summarises completed sections, saved evidence expectations, quiz availability, and the backend-controlled completion-record rule. |
| 6 | Course discovery | Keeps “Explore all courses” in navigation and as a secondary action, rather than leading the learner away from the active path. |

## Routing rule

The existing `portal.html` remains the **sign-in and account-creation start URL**. A successful login redirects to `dashboard.html`. `dashboard.html` reads the stored authenticated session and uses live API calls to load the learner profile, enrolled courses, course section data, and progress. If no course is enrolled, it renders a first-course selection state with the catalogue as the next clear action.

## Visual direction

The dashboard retains the **Signal Classroom** identity: EML violet and cyan rails, warm-white paper workspace, Sora for decisive hierarchy, and DM Sans for instructional detail. The desktop layout uses a thin navigation rail, a generous current-course canvas, and a smaller “Learning record” column. On mobile, the weekly brief and “Continue learning” action remain first; the full seven-week pathway follows below.

## Scope boundaries

The dashboard must show sources with creator credit and open them in the learner’s browser. It must never place assessment answers, private source traceability, or a degree-equivalent claim in the client. Certificates remain backend-verified completion records only.
