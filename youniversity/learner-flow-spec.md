# EML Youniversity Learner Flow Specification

## Product intent

The authenticated experience is a **simple online course campus**, not a single page that attempts to display all learning details at once. Learners should always know where they are, what they are studying now, what they completed before, and the next small action to take.

The visual direction is a modern, EML-branded interpretation of a conventional online-learning campus. It should use the clarity of established course platforms—ordered navigation, a course home, individual weekly units, and a grade view—without copying any third-party identity, imagery, or page composition.

## Persistent learner shell

| Area | Required behaviour |
|---|---|
| **Top-left menu** | Opens a concise learner drawer with the current course, Grades, All Courses, and Sign out at the bottom. |
| **Top-right profile** | Displays a circular learner-initial avatar. Opening it may show the learner’s safe email hint and account-level Learner ID, but it must not expose personal details unnecessarily. |
| **Current course** | Appears as the learner’s primary course destination, labelled with the actual enrolled course title rather than a generic dashboard label. |
| **Grades** | Opens a dedicated grade view of weekly quizzes and final assessment status. Scores and eligibility remain backend-authoritative. |
| **All Courses** | Opens the separate catalogue; it does not crowd the active course page. |

## Course home

The current-course home contains seven **distinct rectangular week cards**, in chronological order. A week card is not an expanded lesson. It is a concise gateway that states the week number, lesson title, short outcome, state, and one action: **Start**, **Continue**, or **Review**. Completed weeks remain directly available indefinitely.

The final assessment has its own card after Week 7. Its presentation must show only a truthful backend-derived state: locked with requirements, ready, or recorded.

## Weekly learning route

Selecting a week opens a separate weekly route with a small progress stepper and four clear screens. The learner can move back and forward between the first three screens without losing access to the week.

| Screen | Learner sees | Completion requirement |
|---|---|---|
| **1. Notes and outcomes** | The week’s concise EML study notes, why the work matters, expected outcomes, guided practice, independent variation, review criteria, and evidence artifact. | Learner reads the materials and chooses **Continue to video**. |
| **2. Credited video study** | A plain-language preview of the selected source, original creator attribution and link/embed, plus the exact practical relationship between the video and the week’s learning goal. | Learner chooses **Continue to quiz check** after studying. |
| **3. Quiz readiness** | A short confirmation that the quiz contains five questions about this week’s video and learning outcome. It reiterates the evidence required and offers **Start quiz**. | Learner deliberately starts the protected backend quiz. |
| **4. Quiz and result** | Server-delivered questions, one answer flow, a backend result, and an explicit return to the course home. The stored quiz result then appears in Grades. | The backend records the attempt. No correct answer key is sent to the browser. |

## Grade view

Grades are not a generic decorative statistic. The learner sees one row for each weekly quiz and one row for the final assessment, each with a truthful state: not attempted, recorded, passed/complete where the backend provides it, or unavailable. It must include a direct return to the course home.

## Non-negotiable usability rules

The user must never be redirected away from a page without a clear explanation and an explicit action. The learner must be able to reopen any completed week. A source video must be selected only after checking its actual content against the notes, practice, outcome, and five-question quiz blueprint. The platform remains free and non-accredited; any completion record is an EML self-study record rather than a degree, academic credit, licence, or professional certification.
