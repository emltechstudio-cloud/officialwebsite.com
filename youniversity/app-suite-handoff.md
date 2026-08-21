# App Suite and Repository Handoff

## Current decision

The EML Youniversity PWA is **review-ready but not deployed**. It must not be added to the current live App Suite until the new website branch, My Shop, and the final hosting/domain decision are reviewed together.

The App Suite must continue to obtain its catalogue dynamically from the backend. The PWA must therefore be added as a normal published app record after its final public URL exists; the frontend must not display or hard-code a fixed total such as “nine apps.”

## Future App Suite record

| Field | Planned value |
|---|---|
| `id` | `eml-youniversity` |
| `title` | `EML Youniversity` |
| `description` | `Free practical self-study starter courses in coding, visual work, and responsible AI, with a Learner ID portal, guided projects, and self-study completion records.` |
| `url` | Final HTTPS URL after the new website branch is approved and hosted |
| `status` | `published` only after live PWA, API, and domain checks pass |
| `metadata` | `source_page`, placement, and the final review date |

## Repository handoff contents

The future EML Tech Studio website branch should receive the following files together, retaining this root relationship so the PWA manifest and service-worker scope remain valid:

```text
youniversity/
├── index.html
├── portal.html
├── offline.html
├── manifest.webmanifest
├── university-service-worker.js
├── pwa-icon.svg
└── updates.json
```

The production web server must serve these files over HTTPS and must not redirect `university-service-worker.js` to HTML. Any content-security policy must permit the configured EML API origin.

## Pre-launch gates

1. Review the landing, portal, PWA install prompt, update toast, and offline fallback on the final host.
2. Confirm the new production domain and API origin are correct in both HTML files.
3. Create or update the dynamic App Suite record only after the final URL passes the above checks.
4. Add My Shop in the same controlled App Suite release, then verify the live dynamic catalogue rather than a fixed count.
5. Keep the current site and app catalogue unchanged until the new website branch is intentionally launched.
