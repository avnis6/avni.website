// Accessible tabs, keyboard navigation, dark-mode persistence, contact form handling
// + micro-interactions: tab pulse and button ripple (no frameworks)
(function () {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const tablist = document.getElementById('tabs');
  const themeToggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  // Initialize year
  yearEl.textContent = new Date().getFullYear();

  // TAB HANDLING
  function activateTab(tab, setFocus = true, pulse = true) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
    });

    panels.forEach(p => {
      p.classList.toggle('hidden', p.id !== tab.getAttribute('aria-controls'));
    });

    if (pulse) {
      tab.classList.add('pulse');
      setTimeout(() => tab.classList.remove('pulse'), 360);
    }

    if (setFocus) {
      tab.focus();
      document.getElementById('main').focus();
    }
  }

  // Click to activate
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab, true, true));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (i + dir + tabs.length) % tabs.length;
        activateTab(tabs[nextIndex], true, true);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(tab, true, true);
      }
    });
  });

  // Start with Home active (first tab) by default
  const initialTab = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  activateTab(initialTab, false, false);

  // THEME TOGGLE
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed', 'false');
    }
    // gentle rotate micro-interaction
    themeToggle.style.transform = 'rotate(20deg) scale(1.05)';
    setTimeout(() => themeToggle.style.transform = '', 260);
  }

  // Load persisted theme or system preference
  const stored = localStorage.getItem('theme');
  if (stored) {
    applyTheme(stored);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  // BUTTON RIPPLE micro-interaction
  function addRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  // CONTACT FORM — client-side only + ripple + toast
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thanks! Please email me directly.');
    feedback.textContent = "Thanks! Please email me directly.";
    form.reset();
  });

  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('click', addRipple);
  });

  function showToast(msg) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => t.classList.remove('show'), 2600);
  }

  // Basic accessibility: ensure tablist arrow keys also work when focus is on the container
  tablist.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const idx = tabs.indexOf(active);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (idx + dir + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex], false, true);
    }
  });

})();