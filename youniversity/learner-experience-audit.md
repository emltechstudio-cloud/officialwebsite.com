# EML Youniversity Learner Experience Audit

## Confirmed diagnosis

The automatic return to `portal.html` is a **frontend session-gate behaviour**, not a backend authentication failure. `dashboard.html` currently reads the browser’s local `eml_youniversity_token` and `eml_youniversity_learner` values and immediately redirects to the sign-in portal when either value is absent. A direct preview opened on a different phone or browser therefore has no stored session and is sent to sign-in before it can display the dashboard.

The AI for Web & PWA Building video problem is a **private curriculum mapping issue**, not a frontend source-resolver or backend delivery issue. The live API returns the same mapping stored in the private dataset: Week 1, “Define a narrow user problem,” currently points to a React AI-app development video. That source does not sufficiently match the week’s product-brief objective. The course needs a source audit and corrected week-to-source assignments in the private dataset; the backend will then serve the corrected source without embedding course content in code.

| Concern | Root cause | Corrective direction |
|---|---|---|
| Dashboard sends an unauthenticated preview to sign-in | Deliberate immediate local-storage session gate | Replace automatic redirect with an in-page access state that explains sign-in is required and offers an explicit sign-in action. Keep a protected authenticated course route once a valid session exists. |
| Returning learner waits while the course list is scanned | Active-course preference can be absent, forcing a full enrolment discovery scan | Preserve the fast saved-course route and add a clear, cancellable loading/access state rather than a silent dashboard shell. |
| AI Web/PWA Week 1 video does not match the lesson | Curriculum manifest maps the product-brief lesson to a React AI app course video | Replace the source mapping after a week-by-week source relevance audit, then commit the corrected manifest to the private dataset. |

## Learning-platform interaction inspiration

The corrected EML experience should borrow **interaction principles**, not third-party copy, names, images, or branding.

| Platform insight | EML application |
|---|---|
| Canvas organizes course navigation as an intentional ordered set of visible links and hides areas that have no learner content.[1] | Keep the learner route to a minimal set of meaningful destinations: **Course home**, **Lessons**, **Progress**, and **Completion record**. Do not show decorative dashboard controls that do not lead to learner work. |
| Moodle’s mobile work emphasizes easier resume, improved movement between course sections and activities, a course-index menu, and less distracting activity pages.[2] | Use a course index that always lists every week; make the current lesson prominent; give every lesson a consistent direct action; and provide a visible return to the lesson list from inside a lesson. |
| Coursera pairs a course-home progress bar and week-by-week summary with a prominent next-step action, while still allowing the learner to navigate to any outline item.[3] | Keep a compact “Continue where you stopped” card above the complete lesson list, but never lock or hide completed lessons. Completed lessons must say **Review lesson** and retain their original source, practice, evidence, and quiz access. |

## Week 1 source-correction candidate

The audit located a stronger direct candidate for Week 1 than the current React-AI source: **“Product Requirements Document | How To Build A Web App ep2”** by WisePup. Its published chapters cover product requirements, functional versus non-functional requirements, user stories, scope, and requirements creation—topics that are directly related to a narrow user problem and workable build constraints.[4] Nielsen Norman Group’s short explanation of user-need statements provides a complementary conceptual check: define the user need before designing the next experience.[5]

The Week 1 private curriculum update should use the WisePup video as the credited weekly video source, retain the existing EML-authored product-brief activity and assessment alignment, and add the Nielsen Norman Group resource as an optional reading link only if the curriculum schema supports a supplementary resource. The candidate must still be rechecked for availability and creator attribution immediately before it is published to the private dataset.

## Corrected interaction model

The dashboard becomes an explicit **course home**, not a destination that assumes an active browser session. If the learner is not signed in, it shows an access panel with a clear sign-in button and a course-catalogue link. If signed in with no enrollment, it shows the learner’s account and a clear course-selection action. If enrolled, it shows: the resumed lesson; a vertically ordered full course index; direct access to completed, current, and future lessons; a visible final-assessment status; and a separate learning-record summary.

## References

[1] [Canvas: Course Navigation links](https://community.instructure.com/en/kb/articles/660741-how-do-i-manage-course-navigation-links)

[2] [Moodle App 4.0 release notes](https://moodledev.io/general/app_releases/v4/v4.0.0)

[3] [Coursera: progress tracking features](https://blog.coursera.org/new-progress-tracking-features-on-coursera/)

[4] [WisePup: Product Requirements Document | How To Build A Web App ep2](https://www.youtube.com/watch?v=F_zDMnTLfcs)

[5] [Nielsen Norman Group: User Need Statements in Design Thinking](https://www.nngroup.com/videos/need-statements/)
