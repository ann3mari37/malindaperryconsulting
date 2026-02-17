/* ============================================================
   MALINDA PERRY CONSULTING
   Interactive Scripts
   ============================================================ */

(function () {
  'use strict';

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
    }, 800);
  });

  // --- Navigation Scroll Effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav when clicking a link
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        var offset = 80;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll Reveal Animations ---
  function revealOnScroll() {
    var reveals = document.querySelectorAll('.fade-up, .reveal-up, .reveal-left, .reveal-right');
    var windowHeight = window.innerHeight;

    reveals.forEach(function (el) {
      var elementTop = el.getBoundingClientRect().top;
      var revealPoint = 120;
      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  // Trigger once on load
  revealOnScroll();

  // --- Active Nav Link Highlight ---
  var sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    var scrollY = window.pageYOffset;

    sections.forEach(function (section) {
      var sectionHeight = section.offsetHeight;
      var sectionTop = section.offsetTop - 120;
      var sectionId = section.getAttribute('id');
      var navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLink.style.color = '#D4956A';
        } else {
          navLink.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // --- Parallax Subtle Movement on Hero ---
  var heroContent = document.querySelector('.hero-content');
  var heroPattern = document.querySelector('.hero-bg-pattern');

  function handleParallax() {
    var scrollY = window.pageYOffset;
    if (scrollY < window.innerHeight) {
      var offset = scrollY * 0.3;
      heroContent.style.transform = 'translateY(' + offset + 'px)';
      heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
      if (heroPattern) {
        heroPattern.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
      }
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // --- Form Handling (Netlify) ---
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Let Netlify handle the form submission natively
      // The form has data-netlify="true" which Netlify processes automatically
    });
  }

  // --- Subtle cursor glow on CTA card ---
  var ctaCard = document.querySelector('.cta-card');
  if (ctaCard) {
    ctaCard.addEventListener('mousemove', function (e) {
      var rect = ctaCard.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      ctaCard.style.background =
        'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(184,115,51,0.06), transparent 40%), linear-gradient(135deg, #FAF6F1, #FFF9F4)';
    });

    ctaCard.addEventListener('mouseleave', function () {
      ctaCard.style.background = '';
    });
  }

  // --- Typed effect on philosophy quote (subtle) ---
  var quoteEl = document.querySelector('.philosophy-quote p');
  if (quoteEl) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(quoteEl);
  }

  // --- Service card tilt effect ---
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * 4;
      var tiltY = (x - 0.5) * -4;
      card.style.transform = 'perspective(1000px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-8px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // Handle featured card separately to maintain scale
  var featuredCard = document.querySelector('.service-card--featured');
  if (featuredCard) {
    featuredCard.addEventListener('mousemove', function (e) {
      var rect = featuredCard.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * 4;
      var tiltY = (x - 0.5) * -4;
      featuredCard.style.transform = 'scale(1.02) perspective(1000px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-8px)';
    });

    featuredCard.addEventListener('mouseleave', function () {
      featuredCard.style.transform = '';
    });
  }

  // --- Journey step counter animation ---
  var journeySteps = document.querySelectorAll('.journey-step-marker span');
  var journeyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.closest('.journey-step').classList.add('visible');
        entry.target.style.animation = 'counterPop 0.4s var(--ease-out) forwards';
      }
    });
  }, { threshold: 0.5 });

  journeySteps.forEach(function (step) {
    journeyObserver.observe(step);
  });

  // Add counter pop keyframes dynamically
  var style = document.createElement('style');
  style.textContent = '@keyframes counterPop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }';
  document.head.appendChild(style);

})();
