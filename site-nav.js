(() => {
  const mount = document.querySelector('[data-eml-site-nav]');
  if (!mount) return;

  const links = [
    { label: 'Home', href: '/index.html' },
    { label: 'Services', href: '/services.html' },
    { label: 'Catalogue', href: 'https://wa.me/447918449756', external: true },
    { label: 'About', href: '/about.html' },
    { label: 'App Suite', href: '/app-suite.html' },
    { label: 'EML Youniversity', href: '/youniversity/' },
    { label: 'ETS Community', href: '/community.html' },
    { label: 'Starting Point', href: '/starting-point.html' },
    { label: 'Chat SEM', href: '/chatsem.html' },
    { label: 'Contact', href: '/contact.html' },
  ];

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const isCurrent = (href) => {
    if (href.startsWith('https://')) return false;
    const path = new URL(href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    return currentPath === path || (href === '/index.html' && currentPath === '/');
  };
  const navItems = links.map(({ label, href, external }) => {
    const current = isCurrent(href);
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<li><a href="${href}"${target}${current ? ' aria-current="page"' : ''}>${label}</a></li>`;
  }).join('');

  mount.className = 'eml-nav-mount';
  mount.innerHTML = `
    <header class="eml-site-header">
      <div class="eml-site-header-inner">
        <a class="eml-site-brand" href="/index.html" aria-label="EML Tech Studio home">
          <img src="/ETSlogo.png" alt="" width="42" height="42">
          <span>EML <strong>TECH STUDIO</strong></span>
        </a>
        <button class="eml-menu-toggle" type="button" aria-expanded="false" aria-controls="eml-primary-navigation" aria-label="Open navigation menu">
          <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
        </button>
        <nav class="eml-primary-navigation" id="eml-primary-navigation" aria-label="Main navigation">
          <ul>${navItems}</ul>
        </nav>
      </div>
    </header>
    <button class="eml-nav-backdrop" type="button" aria-label="Close navigation menu" tabindex="-1"></button>
  `;

  const menuButton = mount.querySelector('.eml-menu-toggle');
  const nav = mount.querySelector('.eml-primary-navigation');
  const backdrop = mount.querySelector('.eml-nav-backdrop');
  const setOpen = (open) => {
    mount.classList.toggle('eml-nav-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    nav.setAttribute('aria-hidden', String(!open && window.matchMedia('(max-width: 900px)').matches));
    backdrop.setAttribute('tabindex', open ? '0' : '-1');
  };

  menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
  backdrop.addEventListener('click', () => setOpen(false));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 900px)').matches) setOpen(false);
  });

  setOpen(false);
})();
