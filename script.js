/* ==========================================================================
   MAISON DORÉ — script.js
   Vanilla JS: loader, cursor, nav, parallax, reveal, counters,
   testimonial slider, floating label form.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 400);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('loaded'), 2500);

  /* ---------- Custom cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .service-card, .price-card, .gallery-item, input, textarea, select')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });
  }

  /* ---------- Sticky navbar on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    backTop.classList.toggle('show', y > 600);
    parallaxHero();
    highlightNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ---------- Active nav link highlight ---------- */
  const sections = ['home', 'about', 'services', 'gallery', 'reviews', 'appointment']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinkEls = document.querySelectorAll('.navbar .nav-link');

  function highlightNav() {
    let current = sections[0].id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Hero parallax ---------- */
  const heroBg = document.getElementById('heroBg');
  const floaters = document.getElementById('floaters');
  function parallaxHero() {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.25}px) scale(1.05)`;
      floaters.style.transform = `translateY(${y * 0.12}px)`;
    }
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal:not(.hero .reveal), .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--d');
        if (delay) entry.target.style.animationDelay = (parseFloat(delay) * 0.12) + 's';
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => counterIO.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testiTrack');
  const slides = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  let testiIndex = 0;
  let testiTimer;

  if (track && slides.length) {
    slides.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'testi-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(d);
    });

    function goToSlide(i) {
      testiIndex = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${testiIndex * 100}%)`;
      dotsWrap.querySelectorAll('.testi-dot').forEach((d, idx) =>
        d.classList.toggle('active', idx === testiIndex));
      resetAutoplay();
    }

    prevBtn.addEventListener('click', () => goToSlide(testiIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(testiIndex + 1));

    function resetAutoplay() {
      clearInterval(testiTimer);
      testiTimer = setInterval(() => goToSlide(testiIndex + 1), 6000);
    }
    resetAutoplay();
  }

  /* ---------- Appointment form ---------- */
  const form = document.getElementById('appointmentForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const dateInput = document.getElementById('fDate');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      submitBtn.classList.add('success');
      submitBtn.disabled = true;
      formSuccess.classList.add('show');

      setTimeout(() => {
        form.reset();
        submitBtn.classList.remove('success');
        submitBtn.disabled = false;
      }, 3200);
    });
  }

  /* ---------- Smooth scroll for in-page anchors (extra easing beyond CSS) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const offset = 78;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* initial calls */
  onScroll();
});
