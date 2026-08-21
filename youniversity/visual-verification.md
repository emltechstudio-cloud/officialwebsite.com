# Visual Verification — 21 August 2026

The landing page renders the intended asymmetric EML composition: a full-height violet/cyan signal rail, a high-contrast white content workspace, an editorial hero, and a deep-indigo/cyan-accented project promise card. The existing EML logo image resolved successfully. Course catalogue data was still loading at the instant of capture, so the interface’s fallback and live API behaviour require an explicit console/network check.

The learner portal also renders correctly at desktop width. The email-plus-Learner-ID entry point is immediately visible, the instruction that no email is sent is prominent, and non-accredited self-study wording is retained. The primary action has sufficient dark-indigo/white contrast. The portal’s learner dashboard, course and quiz states remain data-driven and require an authenticated API check before delivery.

## Follow-up verification

The landing-page dynamic catalogue was checked after the asynchronous API requests settled. It successfully rendered the current live GSWC course cards, including Scratch, HTML, CSS, JavaScript, and Python. The initial portal catalogue loader contained a parenthesis error; it was repaired and the embedded scripts in both HTML pages now pass a local syntax validation. The portal entry view renders after that repair. No live learner account was created solely for visual testing.

## PWA verification

The landing page now contains the public **What’s New** route and loaded the three truthful launch updates from the local release register. In the served HTTPS-compatible preview, the manifest reported `display: standalone` with `/portal.html` as the start URL. The browser registered **University Service Worker** successfully for the Youniversity preview scope. The service worker intentionally caches only the app shell and update register; authenticated learner data and protected assessment actions remain live, backend-authoritative requests.

The portal’s new Menu trigger was opened successfully at desktop width. Its visible menu keeps personal learner actions in the portal while giving learners direct routes to **What’s New**, course paths, and SEM guidance. The interaction is compact and does not obscure the Learner ID sign-in instruction or the self-study notice.

## Cross-discipline catalogue verification

The landing-page catalogue now renders all **13** published starter pathways from the live API: five GSWC Coding courses, four GSWV Visuals courses, and four GSWAF Practical AI courses. The PWA loader now supports the published `course_order` contract and a safe temporary fallback for legacy `course_queue` records, so users do not lose Visuals or Practical AI cards during an API cache transition.

## Live registration flow check

The public portal was opened against the live API and its **Create my Learner ID** mode correctly removed the sign-in-only Learner ID field, leaving a single email field and an explicit registration action. The next verification step is a controlled, non-personal integration account registration followed by authenticated catalogue and learner-action checks.

The controlled live registration created an account-level Learner ID and displayed it only in the browser flow, with no email-delivery step. The immediate login check then revealed the true backend blocker: the Space did not have `JWT_SECRET`, so token signing was unavailable. A new private signing secret has now been added in the Space settings; the Space entered its automatic restart sequence and must complete that restart before login, enrollment, progress, quiz, and completion checks can be repeated.

## Modern campus-style learner dashboard verification

The dedicated `dashboard.html` was checked with the controlled non-personal learner account after successful live sign-in. It presents a focused learner workspace rather than a full course catalogue: the signed-in account, active course, current week, credited source link, guided practical outcome, visible next action, section and quiz record, backend-controlled completion-record notice, and the entire seven-week route all appear in one clear hierarchy.

The verified active state loaded **AI for Everyone** at 14% completion, identified Week 2 as the next weekly action after the saved Week 1 record, named the credited CVC / @ONE source, and made the remaining five-week route visible without distracting the learner from the current task. The desktop view retains the EML violet/cyan signal rail, while the compact layout moves the account and current course panels into a readable single-column sequence on smaller screens.

The authenticated no-enrollment state was also verified. It replaces the active-course canvas with a single, clear first-course action and accurately states that all 13 published courses are available. Following that action opens the separate course catalogue, which then populated all five Coding, four Visuals, and four Practical AI course cards from the live backend.

### Course-home clarification pass

The revised authenticated course-home layout was verified with the live **AI for Everyone** curriculum structure and a non-persistent active-course progress fixture. The page showed Week 1 as saved, Week 2 as the current module, Weeks 3–7 as separate readable module cards, and the 40-question final assessment as a distinct locked card after the seventh week. Each weekly card exposes its direct opening action, while the course home provides separate visible destinations for Course Modules, Activities, Progress, and Course Information. The layout preserves the EML violet/cyan identity while making the complete learning sequence easier to scan than the earlier compact week tiles.

The direct Week 7 module route was also checked in the live preview. Its course link opened **Complete and explain a responsible outcome** with the correct Google AI Essentials source, guided practice, independent variation, evidence artifact, and quiz action; it did not default the learner back to Week 1.

The final-assessment route was checked before enrollment and showed a clear locked state instead of protected questions. It explained that enrollment, every completed weekly section, and every attempted weekly quiz are required before the backend makes the single final-assessment attempt available.

An exact 390 × 844 CSS-pixel fixture capture confirmed the narrow mobile course-home hierarchy: the full course name wraps cleanly, the learner account card remains readable, course-area controls remain available as an intentionally horizontally scrollable row, and the current weekly module maintains its large, practical-task-first presentation. The EML violet/cyan identity remains visible without relying on a copied University of the People visual treatment.
