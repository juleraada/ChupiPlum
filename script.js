/**
 * CHUPI PLUM — SCRIPT.JS
 * "Scrollear Nunca Fue Tan Divertido"
 * Interactions: cursor, navbar scroll, reveal animations,
 *               parallax, mobile nav, newsletter, back-to-top
 */

/* ── UTILIDADES ── */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* ====================================================
   1. CURSOR PERSONALIZADO
   ==================================================== */
const cursor      = $('#cursor');
const cursorTrail = $('#cursorTrail');

if (cursor && cursorTrail) {
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Trail suavizado con RAF
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Cursor crece en links y botones
  const interactives = $$('a, button, input, [role="button"]');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '30px';
      cursor.style.height = '30px';
      cursor.style.background = 'var(--yellow)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '';
      cursor.style.height = '';
      cursor.style.background = '';
    });
  });
}

/* ====================================================
   2. NAVBAR — SCROLL + MOBILE TOGGLE
   ==================================================== */
const navbar    = $('#navbar');
const navToggle = $('#navToggle');
const navLinks  = $('#navLinks');

// Scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Mobile toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar menú al hacer click en un link
  $$('.nav-link', navLinks).forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });
}

/* ====================================================
   3. SCROLL REVEAL — Intersection Observer
   ==================================================== */
const revealElements = $$('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Una vez revelado, dejar de observar
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ====================================================
   4. PARALLAX — Movimiento sutil al scroll
   ==================================================== */
const hero         = $('#hero');
const splatter1    = $('.splatter-1');
const splatter2    = $('.splatter-2');
const splatter3    = $('.splatter-3');
const heroMascot   = $('.hero-mascot');
const bgText       = $('.universe-bg-text');

let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

function updateParallax() {
  const scrollY = window.scrollY;

  // Hero salpicaduras
  if (splatter1) splatter1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (splatter2) splatter2.style.transform = `translateY(${scrollY * -0.1}px)`;
  if (splatter3) splatter3.style.transform = `translateY(${scrollY * 0.08}px)`;

  // Mascota hero
  if (heroMascot) {
    heroMascot.style.transform = `translateY(calc(-50% + ${scrollY * 0.2}px))`;
  }

  // Texto de fondo universo
  if (bgText) {
    const universeSection = $('#universe');
    if (universeSection) {
      const rect = universeSection.getBoundingClientRect();
      const offset = -rect.top * 0.05;
      bgText.style.transform = `translateX(calc(-50% + ${offset}px))`;
    }
  }

  ticking = false;
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ====================================================
   5. EFECTO TILT en las tarjetas de personajes
   ==================================================== */
const charCards = $$('.char-card');

charCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect    = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top  + rect.height / 2;
    const deltaX  = (e.clientX - centerX) / (rect.width  / 2);
    const deltaY  = (e.clientY - centerY) / (rect.height / 2);

    card.style.transform = `
      translateY(-12px)
      scale(1.02)
      rotateX(${-deltaY * 6}deg)
      rotateY(${deltaX * 6}deg)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

/* ====================================================
   6. TILT en tarjetas WHY
   ==================================================== */
const whyCards = $$('.why-card');

whyCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect    = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top  + rect.height / 2;
    const deltaX  = (e.clientX - centerX) / (rect.width  / 2);
    const deltaY  = (e.clientY - centerY) / (rect.height / 2);

    card.style.transform = `
      translateY(-8px)
      rotateX(${-deltaY * 4}deg)
      rotateY(${deltaX * 4}deg)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ====================================================
   7. EFECTO GLITCH en el hero title — ocasional
   ==================================================== */
const heroTitle = $('.hero-title');

if (heroTitle) {
  function glitchEffect() {
    heroTitle.style.filter = `
      drop-shadow(${(Math.random() - 0.5) * 6}px 0 var(--fucsia))
      drop-shadow(${(Math.random() - 0.5) * 6}px 0 var(--yellow))
    `;
    heroTitle.style.transform = `skewX(${(Math.random() - 0.5) * 3}deg)`;

    setTimeout(() => {
      heroTitle.style.filter    = '';
      heroTitle.style.transform = '';
    }, 80);
  }

  // Glitch cada 4-8 segundos aleatoriamente
  function scheduleGlitch() {
    const delay = 4000 + Math.random() * 4000;
    setTimeout(() => {
      glitchEffect();
      scheduleGlitch();
    }, delay);
  }

  scheduleGlitch();
}

/* ====================================================
   8. CONTADOR ANIMADO en stats
   ==================================================== */
const statNums = $$('.stat-num');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const text  = el.textContent.trim();
      const match = text.match(/^(\d+)/);

      if (match) {
        const target   = parseInt(match[1]);
        const suffix   = text.replace(match[1], '');
        const duration = 1200;
        const start    = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current + suffix;

          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      }

      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

/* ====================================================
   9. NEWSLETTER FORM
   ==================================================== */
const nlForm    = $('#nlForm');
const nlSuccess = $('#nlSuccess');

if (nlForm && nlSuccess) {
  nlForm.addEventListener('submit', e => {
    e.preventDefault();

    const nameInput  = $('#nlName');
    const emailInput = $('#nlEmail');

    // Validación básica
    let valid = true;

    if (!nameInput.value.trim()) {
      nameInput.style.borderColor = 'var(--fucsia)';
      nameInput.focus();
      valid = false;
    } else {
      nameInput.style.borderColor = '';
    }

    if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
      emailInput.style.borderColor = 'var(--fucsia)';
      if (valid) emailInput.focus();
      valid = false;
    } else {
      emailInput.style.borderColor = '';
    }

    if (!valid) return;

    // Simulación de envío (aquí se conectaría con el backend)
    const submitBtn = nlForm.querySelector('.nl-btn');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'ENVIANDO...';

    setTimeout(() => {
      nlForm.querySelector('.nl-fields').style.display = 'none';
      nlForm.querySelector('.nl-disclaimer').style.display = 'none';
      nlSuccess.hidden = false;
      submitBtn.disabled = false;
    }, 1200);
  });
}

/* ====================================================
   10. BACK TO TOP
   ==================================================== */
const backToTop = $('#backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ====================================================
   11. SMOOTH SCROLL para links internos
   ==================================================== */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = $(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* ====================================================
   12. ACTIVE NAV LINK — Highlighting al scroll
   ==================================================== */
const sections    = $$('section[id]');
const navLinkEls  = $$('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, {
  threshold: 0.3,
  rootMargin: '-80px 0px -40% 0px'
});

sections.forEach(section => sectionObserver.observe(section));

/* Active nav link style — injected */
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-link.active {
    color: var(--fucsia) !important;
  }
  .nav-link.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(navStyle);

/* ====================================================
   13. EFECTO HOVER en galería — cursor magnético
   ==================================================== */
const galleryItems = $$('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 15;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 15;
    const inner = item.querySelector('.gi-inner');
    if (inner) {
      inner.style.transform = `scale(1.07) translate(${x * 0.3}px, ${y * 0.3}px)`;
    }
  });

  item.addEventListener('mouseleave', () => {
    const inner = item.querySelector('.gi-inner');
    if (inner) inner.style.transform = '';
  });
});

/* ====================================================
   14. CLICK RIPPLE en botones
   ==================================================== */
$$('.btn, .btn-ghost-sm').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width:  ${size}px;
      height: ${size}px;
      left:   ${x}px;
      top:    ${y}px;
      background: rgba(255,255,255,0.25);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.5s ease-out forwards;
      pointer-events: none;
    `;

    // Asegurar position relative en el botón
    if (getComputedStyle(this).position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Keyframe para ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to {
      transform: scale(3);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

/* ====================================================
   15. PARTÍCULAS ADICIONALES al click en hero
   ==================================================== */
const heroSection = $('#hero');

if (heroSection) {
  heroSection.addEventListener('click', e => {
    const emojis = ['🍭', '💥', '⭐', '🌀', '✨', '🎉'];
    const count  = 6;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      const angle    = (Math.PI * 2 / count) * i;
      const speed    = 80 + Math.random() * 80;
      const emoji    = emojis[Math.floor(Math.random() * emojis.length)];

      particle.textContent = emoji;
      particle.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top:  ${e.clientY}px;
        font-size: ${16 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 9999;
        transition: none;
        transform: translate(-50%, -50%);
      `;

      document.body.appendChild(particle);

      const destX = e.clientX + Math.cos(angle) * speed;
      const destY = e.clientY + Math.sin(angle) * speed;

      requestAnimationFrame(() => {
        particle.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        particle.style.left      = destX + 'px';
        particle.style.top       = destY + 'px';
        particle.style.opacity   = '0';
        particle.style.transform = `translate(-50%, -50%) scale(0.3) rotate(${Math.random() * 360}deg)`;
      });

      setTimeout(() => particle.remove(), 800);
    }
  });
}

/* ====================================================
   16. TICKER — pausa en hover
   ==================================================== */
$$('.ticker-track').forEach(track => {
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
});

/* ====================================================
   17. LAZY — Asegurar que la imagen del hero
       cargue con máxima prioridad (preload hint)
   ==================================================== */
// (Las imágenes reales se añadirían aquí como link preload)
// Placeholder para integración futura de imágenes reales

/* ====================================================
   INIT LOG
   ==================================================== */
console.log(`
%c💥 CHUPI PLUM — 2027 💥
%c"Scrollear Nunca Fue Tan Divertido"
%cDesarrollo web: Julian
Estrategia: Javier | Copy: Richard | SEM/SEO: Daniela
`,
  'font-size:20px; font-weight:bold; color:#e9008c;',
  'font-size:14px; color:#ffe600;',
  'font-size:11px; color:rgba(255,255,255,0.5);'
);
