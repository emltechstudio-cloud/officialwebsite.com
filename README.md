EML Tech Studio — Static Website

What I changed
- Added accessible, responsive logo (`rc_images/y.jpeg`) in the header of each page.
- Set descriptive <title> and <meta name="description"> for `index.html`, `about.html` and `contact.html`.
- Added `.site-logo` and `.site-header` CSS rules to each page stylesheet for responsive layout.
- Kept existing structure and external JS (`rc_images/wsp_menu.js`, `rc_images/wsp_slideshow.js`).

Quick checks before deploy
- Open `index.html` in a browser to verify the logo appears and pages navigate correctly.
- Ensure `rc_images/y.jpeg` is present (it is in `rc_images/`).

Deploy options
- GitHub Pages: create a new repository, push the folder content to `main` and enable Pages from the repository settings (root branch). Recommended for simple static sites.
- Netlify / Vercel: drag & drop the folder in Netlify's Deploy UI or connect the Git repo. Both provide free tiers with HTTPS.

Notes & next steps
- Consider consolidating shared CSS into one `styles.css` and reducing inline/generated classes for maintainability.
- Replace RocketCake-generated markup with semantic HTML where possible (nav/header/main/footer) for better accessibility and SEO.
- Add a simple contact form backend or integrate Formspree/Netlify Forms if you want users to message without exposing email.
