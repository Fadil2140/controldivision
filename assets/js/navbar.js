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



document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("#siteNav");
  const menu = nav?.querySelector(".links");

  if (!nav || !menu) return;

  const links = [
    ...menu.querySelectorAll("a[data-section]")
  ];

  const sections = links
    .map(link =>
      document.getElementById(link.dataset.section)
    )
    .filter(Boolean);

  if (!links.length) return;

  let activeId = "";
  let animationFrame = null;
  let resizeTimer = null;

  // Memasang class efek liquid
  nav.classList.add("liquid-nav-ready");

  // Memindahkan kaca ke menu tujuan
  function moveGlass(id, animate = true) {
    const link = links.find(
      item => item.dataset.section === id
    );

    if (!link) return;

    const menuRect = menu.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    // Posisi relatif terhadap area menu,
    // tetap akurat saat menu HP digulir horizontal.
    const x =
      linkRect.left -
      menuRect.left -
      menu.clientLeft +
      menu.scrollLeft;

    const width = linkRect.width;
    const changed = activeId !== id;

    if (!animate) {
      menu.classList.add("liquid-no-transition");
    }

    // Efek peregangan saat berpindah
    if (animate && changed && activeId) {
      menu.classList.remove("liquid-stretch");
      void menu.offsetWidth;
      menu.classList.add("liquid-stretch");
    }

    menu.style.setProperty("--glass-x", `${x}px`);
    menu.style.setProperty("--glass-width", `${width}px`);
    menu.style.setProperty("--glass-opacity", "1");

    links.forEach(item => {
      const selected = item === link;

      item.classList.toggle("active", selected);

      if (selected) {
        item.setAttribute("aria-current", "location");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    activeId = id;

    // Pastikan menu aktif tetap terlihat di HP
    if (window.innerWidth <= 760) {
      const visibleLeft = menu.scrollLeft;
      const visibleRight = visibleLeft + menu.clientWidth;

      const itemLeft = link.offsetLeft;
      const itemRight = itemLeft + link.offsetWidth;

      if (itemLeft < visibleLeft) {
        menu.scrollTo({
          left: itemLeft - 12,
          behavior: animate ? "smooth" : "auto"
        });
      } else if (itemRight > visibleRight) {
        menu.scrollTo({
          left: itemRight - menu.clientWidth + 12,
          behavior: animate ? "smooth" : "auto"
        });
      }
    }

    if (!animate) {
      requestAnimationFrame(() => {
        menu.classList.remove("liquid-no-transition");
      });
    }

    // Kilau singkat saat kaca mendarat
    if (animate && changed) {
      nav.classList.remove("liquid-glint");
      void nav.offsetWidth;
      nav.classList.add("liquid-glint");

      window.setTimeout(() => {
        nav.classList.remove("liquid-glint");
      }, 650);
    }
  }

  // Menentukan bagian halaman yang sedang aktif
  function updateActiveSection() {
    let current = null;
    const threshold = 160;

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) {
        current = section;
      }
    }

    // Sebelum mencapai bagian pertama, gunakan menu pertama
    if (!current && sections.length) {
      current = sections[0];
    }

    if (current && current.id !== activeId) {
      moveGlass(current.id);
    }

    nav.classList.toggle(
      "is-scrolled",
      window.scrollY > 20
    );
  }

  // Klik menu: kaca bergerak dan halaman scroll
  links.forEach(link => {
    link.addEventListener("click", event => {
      const id = link.dataset.section;
      const target = document.getElementById(id);

      if (!target) return;

      event.preventDefault();

      moveGlass(id);

      if (location.hash !== `#${id}`) {
        history.pushState(null, "", `#${id}`);
      }

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    // Efek preview saat diarahkan mouse
    link.addEventListener("mouseenter", () => {
      menu.style.setProperty("--glass-hover", "1");
      moveGlass(link.dataset.section);
    });
  });

  // Kembalikan kaca ke menu aktif setelah hover
  menu.addEventListener("mouseleave", () => {
    menu.style.setProperty("--glass-hover", "0");

    if (activeId) {
      moveGlass(activeId);
    }
  });

  // Gerakan saat fokus menggunakan keyboard
  links.forEach(link => {
    link.addEventListener("focus", () => {
      moveGlass(link.dataset.section);
    });
  });

  // Sinkronisasi dengan scroll halaman
  window.addEventListener(
    "scroll",
    () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(
        updateActiveSection
      );
    },
    { passive: true }
  );

  // Sinkronisasi ukuran saat layar berubah
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      if (activeId) {
        moveGlass(activeId, false);
      }
    }, 100);
  });

  // Dukungan tombol Back / Forward browser
  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1);
    const target = sections.find(
      section => section.id === id
    );

    if (target) {
      moveGlass(target.id);
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });

  // Tentukan menu awal
  const hashId = location.hash.slice(1);

  const initialSection = sections.find(
    section => section.id === hashId
  );

  let initial = initialSection;

  if (!initial) {
    initial = [...sections].reverse().find(
      section => section.getBoundingClientRect().top <= 160
    );
  }

  moveGlass(
    initial?.id || sections[0]?.id || links[0].dataset.section,
    false
  );

  updateActiveSection();
});
