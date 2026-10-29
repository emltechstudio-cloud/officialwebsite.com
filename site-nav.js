(() => {
  const mount = document.querySelector('[data-eml-site-nav]');
  if (!mount) return;

  fetch('/site-nav.html', { headers: { Accept: 'text/html' } })
    .then((response) => {
      if (!response.ok) throw new Error(`Navigation component returned ${response.status}`);
      return response.text();
    })
    .then((markup) => {
      mount.innerHTML = markup;

      const sidebar = mount.querySelector('#sidebar');
      const overlay = mount.querySelector('#overlay');
      const menuToggle = document.getElementById('menuToggle');
      if (!sidebar || !overlay || !menuToggle) return;

      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
      const isHome = currentPath === '/' || currentPath === '/index.html';
      const homeLink = sidebar.querySelector('[data-nav-home]');
      const homeOnlyLink = sidebar.querySelector('[data-home-only]');
      if (homeLink) homeLink.href = isHome ? '#' : '/index.html';
      if (homeOnlyLink) homeOnlyLink.hidden = !isHome;

      sidebar.querySelectorAll('[data-nav-page]').forEach((link) => {
        const pagePath = link.getAttribute('data-nav-page').replace(/\/$/, '') || '/';
        if (currentPath === pagePath || (currentPath === '/' && pagePath === '/index.html')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });

      const closeMenu = () => {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      };

      menuToggle.setAttribute('aria-controls', 'sidebar');
      menuToggle.setAttribute('aria-expanded', String(window.innerWidth >= 1024));
      menuToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('active');
        overlay.classList.toggle('active', isOpen && window.innerWidth < 1024);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });
      overlay.addEventListener('click', closeMenu);
      sidebar.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
          sidebar.classList.add('active');
          overlay.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'true');
        } else {
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    })
    .catch((error) => console.error('EML navigation could not be loaded:', error));
})();
