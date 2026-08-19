/* ==========================================================================
   АгентИИ — script.js
   --------------------------------------------------------------------------
   ФОРМА: подключена к Formspree (AJAX, без перезагрузки страницы).
   Письма приходят на почту, привязанную к форме в кабинете Formspree.

   Если понадобится сменить форму — замените FORM_ENDPOINT ниже.
   В index.html у формы также прописаны action и method: если JavaScript
   не загрузится, браузер отправит заявку обычным POST — она не потеряется.
   ========================================================================== */

var FORM_ENDPOINT = 'https://formspree.io/f/maewajgg';

(function () {
  'use strict';

  /* ---------- Header: фон при скролле ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Бургер-меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeNav();
  });

  /* ---------- Подсветка активного пункта меню ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Плавное появление блоков ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll(
    '.section-head, .card, .step, .pipe-step, .contrast-item, .honest, .faq details, .note-line, .pipeline-note, .cta-form-wrap, .cta-copy'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var groupDelay = new WeakMap();
    Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var parent = el.parentElement;
        var idx = groupDelay.get(parent) || 0;
        groupDelay.set(parent, idx + 1);
        el.style.transitionDelay = Math.min(idx * 70, 280) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(revealTargets, function (el) { io.observe(el); });
  }

  /* ---------- Текущий год в подвале ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Форма ---------- */
  var form = document.getElementById('lead-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = document.getElementById('submit-btn');
  var wrap = form.parentElement;

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  function markInvalid(el, invalid) {
    var box = el.type === 'checkbox' ? el.closest('.checkbox') : el.closest('.field');
    if (box) box.classList.toggle('invalid', invalid);
  }

  // Снимаем подсветку ошибки, как только пользователь начал исправлять
  form.addEventListener('input', function (e) {
    if (e.target.matches('input, select, textarea')) markInvalid(e.target, false);
  });
  form.addEventListener('change', function (e) {
    if (e.target.matches('input, select, textarea')) markInvalid(e.target, false);
  });

  function validate() {
    var fields = form.querySelectorAll('[required]');
    var firstBad = null;
    Array.prototype.forEach.call(fields, function (el) {
      var bad = el.type === 'checkbox' ? !el.checked : !el.value.trim();
      markInvalid(el, bad);
      if (bad && !firstBad) firstBad = el;
    });
    if (firstBad) {
      setStatus('Заполните отмеченные поля.', 'err');
      firstBad.focus();
      return false;
    }
    return true;
  }

  function showSuccess() {
    wrap.innerHTML =
      '<div class="form-done">' +
        '<div class="check">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 7"/></svg>' +
        '</div>' +
        '<h3>Заявка отправлена</h3>' +
        '<p>Ответим в течение одного рабочего дня. Если нужно быстрее — напишите в Telegram <a href="https://t.me/MYGladikh" target="_blank" rel="noopener">@MYGladikh</a>.</p>' +
      '</div>';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.querySelector('[name="_gotcha"]').value) return; // ловушка для ботов
    if (!validate()) return;

    var data = new FormData(form); // _subject уже лежит в скрытом поле формы

    // Formspree подставит адрес в Reply-To, если контакт оказался почтой.
    // Если человек оставил Telegram — поле не отправляем, иначе Formspree
    // отклонит заявку из-за невалидного адреса.
    var contact = (form.querySelector('[name="contact"]').value || '').trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) data.append('_replyto', contact);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';
    setStatus('', '');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; })
          .then(function (body) { return { ok: res.ok, body: body }; });
      })
      .then(function (r) {
        if (r.ok) { showSuccess(); return; }
        // Formspree возвращает массив errors с пояснением по каждому полю
        var msg = '';
        if (r.body && Array.isArray(r.body.errors) && r.body.errors.length) {
          msg = r.body.errors.map(function (e) { return e.message; }).join('. ');
        }
        throw new Error(msg);
      })
      .catch(function (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
        setStatus(
          (err && err.message ? err.message + ' ' : 'Не удалось отправить. ') +
          'Напишите нам напрямую: @MYGladikh или gladdd@list.ru',
          'err'
        );
      });
  });
})();
