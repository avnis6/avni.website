// Accessible tabs, keyboard navigation, dark-mode persistence, contact form handling
// + micro-interactions: tab pulse and button ripple (no frameworks)
// Single-page behavior: smooth anchors, mobile nav, active nav highlighting, contact form handling, ripple + toast
(function () {
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const mobileToggle = document.getElementById('mobile-toggle');
  const header = document.querySelector('.site-header');

  // Initialize year if element exists (kept for compatibility)
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // IntersectionObserver to highlight active nav link
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));

  // CTA button scroll to experience
  const cta = document.getElementById('cta-experience');
  if (cta) cta.addEventListener('click', () => {
    const target = document.getElementById('experience');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  document.querySelectorAll('.btn').forEach(b => b.addEventListener('click', addRipple));

  // CONTACT FORM — client-side only + toast
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thanks! Please email me directly.');
      if (feedback) feedback.textContent = 'Thanks! Please email me directly.';
      form.reset();
    });
  }

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

})();