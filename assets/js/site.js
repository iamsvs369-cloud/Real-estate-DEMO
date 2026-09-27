(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transition = document.querySelector('.page-transition');
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.site-menu');
  const panel = document.querySelector('.mobile-panel');

  let ticking = false;
  const syncHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 28);
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(syncHeader);
      ticking = true;
    }
  };
  syncHeader();
  window.addEventListener('scroll', onScroll, { passive:true });

  if (menu && panel) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
      panel.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      header?.classList.remove('menu-context');
    };
    const openMenu = () => {
      menu.classList.add('is-open');
      menu.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-label', 'Close navigation');
      panel.classList.add('is-open');
      document.body.classList.add('menu-open');
      header?.classList.add('menu-context');
    };
    menu.addEventListener('click', () => panel.classList.contains('is-open') ? closeMenu() : openMenu());
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const path = (location.pathname.split('/').pop() || 'index.html').replace('.html','') || 'index';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === path) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
        href.startsWith('javascript:') || link.target === '_blank') return;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      e.preventDefault();
      if (transition && !reduce) {
        document.body.classList.add('page-leaving');
        transition.style.pointerEvents = 'auto';
        requestAnimationFrame(() => transition.style.transform = 'translateY(0)');
        setTimeout(() => location.href = url.href, 560);
      } else location.href = url.href;
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') { e.preventDefault(); return; }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block:'start' });
      }
    });
  });

  if (!reduce && window.Lenis) {
    const lenis = new Lenis({ duration: 1.2, smoothWheel:true, wheelMultiplier:.8, touchMultiplier:1.05 });
    if (window.gsap) {
      lenis.on('scroll', () => window.ScrollTrigger && ScrollTrigger.update());
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    window.siteLenis = lenis;
  }

  let motionTries = 0;
  const startLuxuryMotion = () => {
    if (reduce) return;
    if (!window.gsap) {
      if (motionTries++ < 40) setTimeout(startLuxuryMotion, 50);
      return;
    }
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const seen = new WeakSet();
    const play = (els, from, to) => {
      gsap.utils.toArray(els).forEach(el => {
        if (!el || seen.has(el)) return;
        seen.add(el);
        gsap.fromTo(el, from, to);
      });
    };

    const heroCopy = document.querySelector(
      '.hero-content, .svc-hero-panel, .properties-hero-content, .contact-hero-copy, .about-hero .hero-copy'
    );

    play('.hero-media, .svc-hero-image img, .properties-hero-media img, .contact-hero-media img, .hero-art',
      { scale:1.12 },
      { scale:1, duration:2.4, ease:'power2.out' }
    );

    play('.float-main, .float-small, .hero-preview',
      { y:40, opacity:0, scale:.96 },
      { y:0, opacity:1, scale:1, duration:1.1, delay:.45, stagger:.12, ease:'power3.out' }
    );

    if (window.ScrollTrigger) {
      const rise = (selector, extra = {}) => {
        gsap.utils.toArray(selector).forEach(el => {
          if (!el || seen.has(el) || heroCopy?.contains(el)) return;
          seen.add(el);
          gsap.fromTo(el, { y:48, opacity:0 }, {
            y:0, opacity:1, duration:.95, ease:'power3.out',
            scrollTrigger:{ trigger:el, start:'top 88%', once:true },
            ...extra
          });
        });
      };

      rise('.reveal, .featured-intro, .section-heading, .testimonial-heading, .pledge-copy');
      rise('.property-card, .solution-card, .testimonial-card, .premium-card, .svc-card');
      rise('.team-grid article, .value-grid article, .stats > div, .svc-stats div, .pledge-points > div');
      rise('.svc-explorer, .svc-section-heading, .svc-approach-copy, .svc-approach-list > div');
      rise('.story-copy, .story-quote, .journey-intro, .values-copy, .team-intro');
      rise('.enquiry-grid > div, .office-grid > div, .regional-inner > *:not(img), .contact-form, .contact-info');
      rise('.featured-property, .section-title-row, .property-cta-content, .cta-pillars > div');
      rise('.final-cta-inner, .final-cta > div, .site-footer .footer-column, .footer-brand-block');

      gsap.utils.toArray('.hero-media, .svc-hero-image img, .properties-hero-media img, .contact-hero-media img, .final-cta img, .regional img, .property-cta > img, .pledge > img, .svc-trust-image img').forEach(media => {
        const parent = media.closest('section') || media.parentElement;
        if (!parent) return;
        gsap.to(media, {
          yPercent: 12, ease:'none',
          scrollTrigger:{ trigger:parent, start:'top top', end:'bottom top', scrub:true }
        });
      });

      gsap.utils.toArray('.stats strong, .svc-stats strong, .experience strong').forEach(el => {
        const raw = el.textContent.trim();
        const num = parseFloat(raw.replace(/[^\d.]/g, ''));
        if (!num) return;
        const suffix = raw.replace(/[\d.]/g, '');
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => gsap.to(obj, {
            val: num, duration: 1.4, ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
          })
        });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  };

  if (document.readyState === 'complete') startLuxuryMotion();
  else window.addEventListener('load', startLuxuryMotion);

  const form = document.querySelector('[data-demo-form]');
  const success = document.querySelector('.form-success, .success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (success) success.classList.add('show');
      form.reset();
    });
  }

  let top = document.querySelector('.back-top');
  if (!top) {
    top = document.createElement('button');
    top.className = 'back-top';
    top.type = 'button';
    top.setAttribute('aria-label','Back to top');
    top.textContent = '↑';
    document.body.appendChild(top);
  }
  window.addEventListener('scroll', () => top.classList.toggle('show', scrollY > 700), {passive:true});
  top.addEventListener('click', () => window.siteLenis ? window.siteLenis.scrollTo(0) : scrollTo({top:0,behavior:'smooth'}));

  const tabs = document.querySelectorAll('.svc-tabs button');
  const cards = document.querySelectorAll('.svc-card');
  const looking = document.getElementById('svc-looking');
  const apply = v => {
    tabs.forEach(t => {
      const active = t.dataset.filter === v;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    cards.forEach(c => c.classList.toggle('is-hidden', !(v === 'all' || c.dataset.category === v)));
    if (looking) looking.value = v;
  };
  tabs.forEach(t => t.addEventListener('click', () => apply(t.dataset.filter)));
  looking && looking.addEventListener('change', e => apply(e.target.value));
  document.getElementById('svc-search')?.addEventListener('click', () =>
    document.getElementById('svc-grid')?.scrollIntoView({behavior:'smooth', block:'start'})
  );
})();
