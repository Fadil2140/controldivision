/* =========================================================
   NAVBAR — sticky, active section, mobile menu, theme toggle
   ========================================================= */
(() => {
  const root = document.documentElement;
  const nav = document.querySelector('.nav');
  const menuBtn = document.getElementById('menuBtn');
  const mobilePanel = document.getElementById('mobilePanel');
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const progress = document.getElementById('navProgress');
  const links = [...document.querySelectorAll('.links a[data-section]')];

  const applyTheme = (dark) => {
    root.classList.toggle('dark', dark);
    localStorage.setItem('wks-theme', dark ? 'dark' : 'light');
    if (themeToggle) {
      themeToggle.textContent = dark ? '☀' : '☾';
      themeToggle.setAttribute('aria-label', dark ? 'Enable light mode' : 'Enable dark mode');
      themeToggle.title = dark ? 'Light mode' : 'Dark mode';
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.textContent = dark ? '☀  Light mode' : '☾  Dark mode';
    }
  };

  applyTheme(localStorage.getItem('wks-theme') === 'dark');
  themeToggle?.addEventListener('click', () => applyTheme(!root.classList.contains('dark')));
  mobileThemeToggle?.addEventListener('click', () => applyTheme(!root.classList.contains('dark')));

  const closeMobile = () => {
    mobilePanel?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    if (menuBtn) menuBtn.textContent = '☰';
  };

  menuBtn?.addEventListener('click', () => {
    const open = mobilePanel.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '×' : '☰';
  });

  mobilePanel?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
  document.addEventListener('click', e => {
    if (mobilePanel?.classList.contains('open') && !nav.contains(e.target)) closeMobile();
  });

  const updateScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 12);
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateScroll, { passive:true });
  updateScroll();

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.dataset.section === entry.target.id));
    });
  }, { rootMargin:'-35% 0px -55% 0px', threshold:0 });

  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
})();
