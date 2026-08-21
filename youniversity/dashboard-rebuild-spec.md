# EML Youniversity Dashboard Rebuild Specification

## Rebuild decision

The previous dashboard is rejected as the implementation baseline. The replacement must be a **mobile-first learner course home**, not a desktop dashboard compressed into a phone screen. It must make the learning route usable without hidden horizontal controls, clipped titles, or an ambiguous distinction between completed and available lessons.

## Non-negotiable learner flows

| Learner need | Required dashboard behaviour | Acceptance check |
|---|---|---|
| Resume current work | A single primary card names the current week and opens its exact lesson. | A learner with Week 1 saved opens Week 2 from the primary action. |
| Revisit completed work | Every completed week remains in the module list with an explicit **Review lesson** action. | Selecting the Week 1 review action opens Week 1, not the current or first default week. |
| Inspect later work | Every future week is visible in the same list and opens its exact lesson. | Selecting Week 7 opens its own source, practice, evidence, and quiz screen. |
| Understand the course path | The seven weekly lessons and the final assessment use one plain-language sequence. | A learner can scan Weeks 1–7 and the final assessment in one vertical mobile flow. |
| Use a phone | The default layout is one column, uses no required horizontal scroll, and keeps titles/actions inside the viewport. | At 390 CSS pixels wide, course title, status, module title, and action remain readable without clipping. |
| Switch course or leave safely | The dashboard provides clear All courses and Sign out controls without hiding them behind a broken or oversized drawer. | Both controls work independently of the module list. |
| Understand assessment status | A final-assessment card is always visible and states Locked, Ready, or Recorded with the truthful condition. | Locked state exposes no protected questions; Ready opens the existing backend-gated final screen. |

## Replacement information structure

The replacement uses this fixed order on mobile: account header, course identity and progress, current lesson, full module sequence, final assessment, learning record, and course information. There is no horizontal course-area tab row. Desktop may place the course snapshot and learning record side by side only after the single-column mobile structure is complete.

> **Decision rule:** if an interface choice makes it harder to find a completed lesson, the current lesson, or the final assessment with one vertical scroll, it is rejected.
