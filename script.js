/* ============================================================
   PORTFOLIO — script.js
   Scroll animations, navigation, skill bars, form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------
  // STICKY NAVIGATION
  // ----------------------------------------
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ----------------------------------------
  // MOBILE MENU TOGGLE
  // ----------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navList   = document.getElementById('nav-list');

  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');

    // Animate hamburger → X
    const spans = navToggle.querySelectorAll('span');
    if (navList.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu when a link is clicked
  navList.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // ----------------------------------------
  // SMOOTH SCROLL (supplements CSS)
  // ----------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----------------------------------------
  // SCROLL REVEAL ANIMATION
  // ----------------------------------------
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ----------------------------------------
  // ADD REVEAL CLASSES DYNAMICALLY
  // (so you don't have to add them manually to every element)
  // ----------------------------------------
  const animateOnScroll = [
    { selector: '.section__header',      cls: 'reveal'       },
    { selector: '.service-card',         cls: 'reveal'       },
    { selector: '.project-card',         cls: 'reveal'       },
    { selector: '.skills__category',     cls: 'reveal'       },
    { selector: '.about__visual',        cls: 'reveal-left'  },
    { selector: '.about__content',       cls: 'reveal-right' },
    { selector: '.contact__info',        cls: 'reveal-left'  },
    { selector: '.contact__form',        cls: 'reveal-right' },
    { selector: '.hero__text',           cls: 'reveal-left'  },
    { selector: '.hero__visual',         cls: 'reveal-right' },
    { selector: '.quote-block',          cls: 'reveal'       },
    { selector: '.stat',                 cls: 'reveal'       },
  ];

  // Stagger sibling cards
  const staggerGroups = [
    '.service-card',
    '.project-card',
    '.skills__category',
    '.stat',
  ];

  animateOnScroll.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      // Add stagger delay for grouped card elements
      if (staggerGroups.includes(selector)) {
        const delayIndex = (i % 5) + 1;
        el.classList.add(`delay-${delayIndex}`);
      }
      revealObserver.observe(el);
    });
  });

  // ----------------------------------------
  // SKILL BAR ANIMATION
  // ----------------------------------------
  const skillBars = document.querySelectorAll('.skill-item__bar');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-item__fill');
          if (fill) fill.classList.add('animated');
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ----------------------------------------
  // CONTACT FORM — handled by @formspree/ajax (see index.html)

  // ----------------------------------------
  // ACTIVE NAV LINK HIGHLIGHT ON SCROLL
  // ----------------------------------------
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--color-accent)';
      }
    });
  });

  // ----------------------------------------
  // HERO CANVAS — INTERACTIVE PARTICLE NETWORK
  // ----------------------------------------
  const heroCanvas  = document.getElementById('hero-canvas');
  const heroSection = document.getElementById('home');

  if (heroCanvas) {
    const ctx  = heroCanvas.getContext('2d');
    const PARTICLE_COUNT  = 65;
    const LINK_DIST       = 130;
    const MOUSE_RADIUS    = 145;
    const ACCENT          = '91, 110, 255';
    let width, height, particles = [];
    const mouse = { x: null, y: null };

    function resizeCanvas() {
      width  = heroCanvas.width  = heroCanvas.offsetWidth;
      height = heroCanvas.height = heroCanvas.offsetHeight;
    }

    class Particle {
      constructor() { this.init(); }
      init() {
        this.x  = Math.random() * width;
        this.y  = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.r  = Math.random() * 1.8 + 1.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width)  this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_RADIUS && d > 0) {
            const force = (1 - d / MOUSE_RADIUS) * 0.018;
            this.x += (dx / d) * force * MOUSE_RADIUS;
            this.y += (dy / d) * force * MOUSE_RADIUS;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, 0.5)`;
        ctx.fill();
      }
    }

    function drawLinks() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${ACCENT}, ${(1 - dist / LINK_DIST) * 0.2})`;
            ctx.lineWidth   = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      drawLinks();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }

    function init() {
      resizeCanvas();
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
      animate();
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      particles.forEach(p => { if (p.x > width || p.y > height) p.init(); });
    });

    if (heroSection) {
      heroSection.addEventListener('mousemove', e => {
        const rect = heroCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    init();
  }

});
