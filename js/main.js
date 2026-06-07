/* =========================================================
   ASESORÍA FINANCIERA M&S — interacciones
   ========================================================= */
(function () {
  'use strict';

  // ⚠️  CAMBIA AQUÍ el número de WhatsApp (formato internacional sin +, ni espacios)
  var WHATSAPP = '573163524208';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* -------- Preloader -------- */
  window.addEventListener('load', function () {
    var pre = $('#preloader');
    if (!pre) return;
    setTimeout(function () { pre.classList.add('is-done'); }, reduceMotion ? 0 : 1500);
  });

  document.addEventListener('DOMContentLoaded', function () {

    /* -------- Año footer -------- */
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

    /* -------- Preloader: contador de porcentaje -------- */
    var prePct = $('#prePct');
    if (prePct) {
      if (reduceMotion) {
        prePct.textContent = '100';
      } else {
        var pStart = null, pDur = 1300;
        requestAnimationFrame(function pStep(ts) {
          if (!pStart) pStart = ts;
          var p = Math.min((ts - pStart) / pDur, 1);
          prePct.textContent = Math.round(p * 100);
          if (p < 1) requestAnimationFrame(pStep);
        });
      }
    }

    /* -------- Sincronizar enlaces de WhatsApp -------- */
    $$('a[href^="https://wa.me/"]').forEach(function (a) {
      a.href = 'https://wa.me/' + WHATSAPP;
    });

    /* -------- Header scroll + barra de progreso -------- */
    var header = $('#header');
    var progress = $('#scrollProgress');
    var fab = $('.fab');
    function onScroll() {
      var sc = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle('is-scrolled', sc > 30);
      if (fab) fab.classList.toggle('is-visible', sc > 500);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (sc / h) * 100 : 0) + '%';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* -------- Menú móvil -------- */
    var toggle = $('#navToggle');
    var mobileNav = $('#mobileNav');
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function setMenu(open) {
      if (!toggle || !mobileNav) return;
      toggle.classList.toggle('is-open', open);
      mobileNav.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    if (toggle) toggle.addEventListener('click', function () { setMenu(!mobileNav.classList.contains('is-open')); });
    backdrop.addEventListener('click', function () { setMenu(false); });
    $$('#mobileNav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

    /* -------- Reveal on scroll -------- */
    var revealEls = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
      $$('.gcard').forEach(function (g) { g.classList.add('is-in'); });
    } else {
      var ro = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-in');
          $$('.gcard', el).forEach(function (g) { g.classList.add('is-in'); });
          obs.unobserve(el);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { ro.observe(el); });
    }

    /* -------- Contadores -------- */
    function animateCount(el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      var dur = 1600, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }
    var counters = $$('[data-count]');
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var co = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.4, rootMargin: '0px 0px -40px 0px' });
      counters.forEach(function (el) { co.observe(el); });
    }

    /* -------- FAQ acordeón (cierra los demás) -------- */
    var accs = $$('.acc');
    accs.forEach(function (acc) {
      acc.addEventListener('toggle', function () {
        if (acc.open) {
          accs.forEach(function (other) { if (other !== acc) other.open = false; });
        }
      });
    });

    /* -------- Calculadora -------- */
    var calcProp = $('#calcProp');
    var calcPropValue = $('#calcPropValue');
    var calcResult = $('#calcResult');
    var calcBar = $('#calcBar');
    var pills = $$('.calc__pill');
    var ltv = 50;

    function formatCOP(n) {
      return '$ ' + Math.round(n).toLocaleString('es-CO');
    }
    function updateCalc() {
      if (!calcProp) return;
      var prop = parseFloat(calcProp.value);
      calcPropValue.textContent = formatCOP(prop);
      var amount = prop * (ltv / 100);
      calcResult.textContent = formatCOP(amount);
      calcBar.style.width = ltv + '%';
      // relleno visual del track del slider
      var pct = ((prop - calcProp.min) / (calcProp.max - calcProp.min)) * 100;
      calcProp.style.background =
        'linear-gradient(90deg, var(--gold) 0%, var(--gold) ' + pct + '%, var(--ivory) ' + pct + '%)';
    }
    if (calcProp) {
      calcProp.addEventListener('input', updateCalc);
      pills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          pills.forEach(function (p) { p.classList.remove('is-active'); });
          pill.classList.add('is-active');
          ltv = parseInt(pill.getAttribute('data-ltv'), 10);
          updateCalc();
        });
      });
      updateCalc();
    }

    /* -------- CTAs que preseleccionan interés -------- */
    $$('[data-interest]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var interest = btn.getAttribute('data-interest');
        var radio = interest === 'inversion' ? $('#iInversion') : $('#iCredito');
        if (radio) radio.checked = true;
      });
    });

    /* -------- Formulario → WhatsApp -------- */
    var form = $('#leadForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = $('#fName'), phone = $('#fPhone');
        var ok = true;
        [name, phone].forEach(function (f) {
          if (!f.value.trim()) { f.classList.add('invalid'); ok = false; }
          else f.classList.remove('invalid');
        });
        if (!ok) { name.value.trim() ? phone.focus() : name.focus(); return; }

        var interest = (form.querySelector('input[name="interest"]:checked') || {}).value || 'Asesoría';
        var msg = $('#fMsg').value.trim();
        var text =
          '¡Hola M&S! Quiero información.%0A%0A' +
          '*Nombre:* ' + encodeURIComponent(name.value.trim()) + '%0A' +
          '*Teléfono:* ' + encodeURIComponent(phone.value.trim()) + '%0A' +
          '*Interés:* ' + encodeURIComponent(interest) +
          (msg ? '%0A*Mensaje:* ' + encodeURIComponent(msg) : '');
        window.open('https://wa.me/' + WHATSAPP + '?text=' + text, '_blank');
      });
    }
  });
})();
