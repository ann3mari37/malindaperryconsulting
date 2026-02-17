/* ============================================================
   MALINDA PERRY CONSULTING
   Interactive Scripts
   ============================================================ */

(function () {
  'use strict';

  // --- Navigation Scroll Effect ---
  var nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.pageYOffset > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile Navigation ---
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth Scroll ---
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
      if (elementTop < windowHeight - 100) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
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
          navLink.style.color = '#E8923E';
        } else {
          navLink.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // --- Hero Parallax ---
  var heroContent = document.querySelector('.hero-content');
  var heroPattern = document.querySelector('.hero-bg-pattern');
  var heroFloats = document.querySelectorAll('.hero-float');

  function handleParallax() {
    var scrollY = window.pageYOffset;
    if (scrollY < window.innerHeight) {
      var offset = scrollY * 0.25;
      heroContent.style.transform = 'translateY(' + offset + 'px)';
      heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.7));
      if (heroPattern) {
        heroPattern.style.transform = 'translateY(' + (scrollY * 0.1) + 'px)';
      }
      heroFloats.forEach(function (el, i) {
        var speed = 0.05 + (i * 0.03);
        el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
      });
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // --- Form Handling (Netlify) ---
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    });
  }

  // --- CTA Card Cursor Glow ---
  var ctaCard = document.querySelector('.cta-card');
  if (ctaCard) {
    ctaCard.addEventListener('mousemove', function (e) {
      var rect = ctaCard.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      ctaCard.style.background =
        'radial-gradient(500px circle at ' + x + 'px ' + y + 'px, rgba(212,120,58,0.1), transparent 40%), linear-gradient(135deg, #FBF6EF, #FDF8F2)';
    });

    ctaCard.addEventListener('mouseleave', function () {
      ctaCard.style.background = '';
    });
  }

  // --- Service Card Tilt ---
  document.querySelectorAll('.service-card:not(.service-card--featured)').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * 3;
      var tiltY = (x - 0.5) * -3;
      card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  var featuredCard = document.querySelector('.service-card--featured');
  if (featuredCard) {
    featuredCard.addEventListener('mousemove', function (e) {
      var rect = featuredCard.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * 3;
      var tiltY = (x - 0.5) * -3;
      featuredCard.style.transform = 'scale(1.03) perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
    });

    featuredCard.addEventListener('mouseleave', function () {
      featuredCard.style.transform = '';
    });
  }

  // --- Journey Step Animation ---
  var journeySteps = document.querySelectorAll('.journey-step-marker span');
  var journeyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.closest('.journey-step').classList.add('visible');
        entry.target.style.animation = 'counterPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
    });
  }, { threshold: 0.5 });

  journeySteps.forEach(function (step) {
    journeyObserver.observe(step);
  });

  // --- Philosophy Card Number Fade-in ---
  var philNums = document.querySelectorAll('.philosophy-card-num');
  var philObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'numReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        philObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  philNums.forEach(function (num) {
    philObserver.observe(num);
  });

  // --- Dynamic keyframes ---
  var style = document.createElement('style');
  style.textContent =
    '@keyframes counterPop { 0% { transform: scale(0.3); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }' +
    '@keyframes numReveal { 0% { transform: translateY(20px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 0.15; } }';
  document.head.appendChild(style);

})();
