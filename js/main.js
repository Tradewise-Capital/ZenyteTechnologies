// Nav scroll state
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 10 ? '#2a2a2a' : '#222222';
}, { passive: true });

// Performance tabs
document.querySelectorAll('.perf-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.perf-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.perf-tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab)?.classList.add('active');
  });
});

// Contact form
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  e.target.hidden = true;
  document.getElementById('formSuccess').hidden = false;
});
