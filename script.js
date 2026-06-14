// ===== Theme toggle =====
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme){
  body.setAttribute('data-theme', theme);
  try{ localStorage.setItem('portfolio-theme', theme); }catch(e){}
}

let savedTheme;
try{ savedTheme = localStorage.getItem('portfolio-theme'); }catch(e){}
if(!savedTheme){
  savedTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
}
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== Mobile nav toggle =====
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Scroll reveal animations =====
const revealEls = document.querySelectorAll('.section-head, .about-grid, .skills-grid .skill-card, .projects-grid .project-card, .timeline-item, .certs, .contact-grid');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// ===== Certificate Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(src, caption){
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeLightbox();
});


// SETUP REQUIRED:
// 1. Create a free account at https://www.emailjs.com/
// 2. Add an Email Service (e.g. Gmail) -> copy the Service ID
// 3. Create an Email Template with variables: from_name, reply_to, message -> copy the Template ID
// 4. Find your Public Key under Account -> General
// 5. Replace the three placeholders below
const EMAILJS_PUBLIC_KEY = 'J7C7fRjzTtNoQJRgp';
const EMAILJS_SERVICE_ID = 'service_ni6heeb';
const EMAILJS_TEMPLATE_ID = 'template_tlyuevg';

if (window.emailjs) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = form.querySelector('.form-submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const originalText = btnText.textContent;

  status.textContent = '';
  status.className = 'form-status';

  if (!window.emailjs || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    status.textContent = 'Contact form not yet configured — please email me directly.';
    status.classList.add('error');
    return;
  }

  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';

  try {
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
    status.textContent = 'Message sent — thanks for reaching out, I\'ll reply soon.';
    status.classList.add('success');
    form.reset();
  } catch (err) {
    status.textContent = 'Something went wrong. Please try emailing me directly.';
    status.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = originalText;
  }
});
