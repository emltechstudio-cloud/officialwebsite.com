import fs from 'node:fs';

const checks = [
  ['index.html', ['/youniversity/disciplines', '/youniversity/courses/', 'course_order', 'portal.html']],
  ['portal.html', ['/youniversity/auth/register', '/youniversity/auth/login', '/youniversity/enroll', '/quiz', 'learner_id', 'dashboard.html']],
  ['dashboard.html', ['/youniversity/disciplines', '/youniversity/me/courses/', 'portal.html?course=', 'eml_youniversity_active_course', 'learner_id']],
];

for (const [name, required] of checks) {
  const html = fs.readFileSync(`/home/ubuntu/youniversity-html-review/${name}`, 'utf8');
  for (const value of required) if (!html.includes(value)) throw new Error(`${name} is missing ${value}`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  if (!scripts.length) throw new Error(`${name} has no embedded script`);
  scripts.forEach((script, index) => new Function(script));
  console.log(`${name}: embedded script syntax valid`);
}

const manifest = JSON.parse(fs.readFileSync('/home/ubuntu/youniversity-html-review/manifest.webmanifest', 'utf8'));
if (manifest.start_url !== 'portal.html' || manifest.scope !== './' || manifest.display !== 'standalone' || !manifest.icons?.length) throw new Error('PWA manifest does not define the required portable portal start experience');
const worker = fs.readFileSync('/home/ubuntu/youniversity-html-review/university-service-worker.js', 'utf8');
for (const value of ['University Service Worker', 'dashboard.html', 'offline.html', 'updates.json', 'EML_YOUNIVERSITY_ACTIVATE_UPDATE']) if (!worker.includes(value)) throw new Error(`University Service Worker is missing ${value}`);
const updates = JSON.parse(fs.readFileSync('/home/ubuntu/youniversity-html-review/updates.json', 'utf8'));
if (!Array.isArray(updates.items) || !updates.items.length) throw new Error('What’s New register is empty');
console.log('PWA manifest, University Service Worker, offline fallback, and update register valid');
