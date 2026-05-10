/* =============================================
   SCRIPT.JS – Premium Landing Page
   Molly Black Golden Ebook
   ============================================= */

// ─── 1. GSAP REGISTER PLUGINS ───────────────
gsap.registerPlugin(ScrollTrigger);

// ─── 2. PARTICLES CANVAS ────────────────────
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#f59e0b' : '#ffffff',
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

// ─── 3. AOS INIT ────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  // ─── 4. HERO GSAP ENTRANCE ──────────────
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-badge', { y: -30, opacity: 0, duration: 0.7, delay: 0.2 })
    .from('h1', { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
    .from('.hero-section p', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.ebook-mockup-wrapper', { scale: 0.7, opacity: 0, duration: 1, ease: 'back.out(1.4)' }, '-=0.4')
    .from('.stat-chip', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.5')
    .from('.cta-button-hero', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.3')
    .from('.trust-badge', { y: 15, opacity: 0, stagger: 0.08, duration: 0.4 }, '-=0.2');

  // ─── 5. COUNTER ANIMATION ───────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = Math.min(now - start, duration);
      const progress = elapsed / duration;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString('id-ID') + suffix;
      if (elapsed < duration) requestAnimationFrame(update);
      else el.textContent = prefix + target.toLocaleString('id-ID') + suffix;
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-number').forEach(el => counterObserver.observe(el));

  // ─── 6. COUNTDOWN TIMER ─────────────────
  (function initCountdown() {
    // Set end time = 23h from now (stored in sessionStorage to persist on reload)
    let endTime = sessionStorage.getItem('promoEndTime');
    if (!endTime) {
      endTime = Date.now() + 23 * 60 * 60 * 1000 + 47 * 60 * 1000;
      sessionStorage.setItem('promoEndTime', endTime);
    }
    endTime = parseInt(endTime);

    function updateTimer() {
      const now = Date.now();
      let diff = Math.max(0, endTime - now);
      const h = Math.floor(diff / 3600000);
      diff -= h * 3600000;
      const m = Math.floor(diff / 60000);
      diff -= m * 60000;
      const s = Math.floor(diff / 1000);

      const hEl = document.getElementById('hours');
      const mEl = document.getElementById('minutes');
      const sEl = document.getElementById('seconds');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');

      // Animate when second changes
      if (sEl && s !== parseInt(sEl.dataset.prev || '-1')) {
        sEl.dataset.prev = s;
        gsap.from(sEl, { y: -8, opacity: 0.3, duration: 0.25, ease: 'power2.out' });
      }
    }
    updateTimer();
    setInterval(updateTimer, 1000);
  })();

  // ─── 7. FLOATING CTA (MOBILE) ───────────
  const floatingCTA = document.getElementById('floatingCTA');
  let heroSection = document.getElementById('hero');

  function handleScroll() {
    if (!floatingCTA || !heroSection) return;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom < 0) {
      floatingCTA.style.display = 'flex';
    } else {
      floatingCTA.style.display = 'none';
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ─── 8. TESTIMONIAL SLIDER ──────────────
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testiDots');
  if (track && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let current = 0;
    let autoSlideInterval;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function getVisible() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function goTo(index) {
      const vis = getVisible();
      const max = Math.max(0, total - vis);
      current = Math.max(0, Math.min(index, max));
      const cardWidth = cards[0].offsetWidth + 24; // gap-6 = 24px
      gsap.to(track, {
        x: -current * cardWidth,
        duration: 0.5,
        ease: 'power3.out'
      });
      dotsContainer.querySelectorAll('.testi-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoSlideInterval = setInterval(() => {
        const vis = getVisible();
        const max = Math.max(0, total - vis);
        const next = current >= max ? 0 : current + 1;
        goTo(next);
      }, 4000);
    }

    function stopAuto() { clearInterval(autoSlideInterval); }

    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
    window.addEventListener('resize', () => goTo(current));

    startAuto();
    window.prevTestimonial = function () { stopAuto(); goTo(current - 1); startAuto(); };
    window.nextTestimonial = function () { stopAuto(); goTo(current + 1); startAuto(); };
  }

  // ─── 9. SCROLL-TRIGGERED PARALLAX ───────
  gsap.to('.hero-bg-gradient', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  gsap.to('.ebook-mockup', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // ─── 10. GSAP SCROLL ANIMATIONS ─────────
  // Solution cards stagger
  gsap.from('.solution-card', {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.solution-card',
      start: 'top 85%',
    }
  });

  // Pricing card glow pulse
  gsap.to('.pricing-card', {
    boxShadow: '0 0 80px rgba(245,158,11,0.2), 0 30px 80px rgba(0,0,0,0.4)',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // ─── 11. MAGNETIC BUTTON EFFECT ─────────
  document.querySelectorAll('.cta-button-hero, .final-cta-btn, .pricing-cta').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(this, {
        x: x * 0.12,
        y: y * 0.12,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(this, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // ─── 12. SECTION REVEAL (GSAP + ScrollTrigger) ───
  const revealSections = document.querySelectorAll('section');
  revealSections.forEach(sec => {
    gsap.from(sec.querySelectorAll('.section-tag, h2'), {
      y: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sec, start: 'top 80%', once: true },
    });
  });

  // ─── 13. SMOOTH HOVER ON PAIN CARDS ─────
  document.querySelectorAll('.pain-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // ─── 14. FISH TRAIL CURSOR (subtle) ─────
  let lastFish = 0;
  document.addEventListener('mousemove', function (e) {
    const now = Date.now();
    if (now - lastFish < 500) return;
    lastFish = now;
    if (window.innerWidth < 768) return;

    const emojis = ['🐟', '🐠', '🐡', '✨'];
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      font-size: 1.2rem;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(el);
    gsap.to(el, {
      y: -40,
      x: (Math.random() - 0.5) * 40,
      opacity: 0,
      scale: 0.5,
      duration: 1.2,
      ease: 'power2.out',
      onComplete: () => el.remove(),
    });
  });

  // ─── 15. NUMBER FORMATTING ──────────────
  // Already handled in animateCounter

});

// ─── 16. ACCORDION ──────────────────────────
window.toggleAccordion = function (header) {
  const item = header.closest('.accordion-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.accordion-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    const body = openItem.querySelector('.accordion-body');
    gsap.to(body, { maxHeight: 0, duration: 0.35, ease: 'power2.inOut' });
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
    const body = item.querySelector('.accordion-body');
    gsap.to(body, { maxHeight: 200, duration: 0.4, ease: 'power2.out' });
  }
};

// ─── 17. TESTIMONIAL CONTROLS (global) ──────
// Defined inside DOMContentLoaded but exposed globally above

// ─── 18. PAGE LOAD SHIMMER ──────────────────
window.addEventListener('load', function () {
  document.body.style.opacity = '0';
  gsap.to(document.body, { opacity: 1, duration: 0.5, ease: 'power2.out' });
});

// ─── 19. SMOOTH SCROLL FOR ANCHORS ──────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
