/* ===================================================================
   마음약방 랜딩 — script.js
   nav / reveal / count-up / aroma particles / diagnostic / buy card
   =================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 폼 엔드포인트 = index.html의 <form action> 하나가 단일 설정 지점 (JS가 거기서 읽음) ---- */

  /* ---- analytics helper (Plausible; 미설정 시 no-op) ---- */
  function track(event, props) {
    try { if (window.plausible) window.plausible(event, props ? { props: props } : undefined); } catch (e) {}
  }

  /* ---- CTA 클릭 추적 ---- */
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () { track('CTA', { loc: el.getAttribute('data-cta') }); });
  });

  /* ---- nav shrink on scroll ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // buy card appears after hero
    var card = document.getElementById('buycard');
    if (card && !card.dataset.closed) {
      if (window.scrollY > 700) card.classList.add('show');
      else card.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var hamb = document.getElementById('hamb');
  var menu = document.getElementById('mobileMenu');
  if (hamb && menu) {
    function setMenu(open) {
      var wasOpen = nav.classList.contains('menu-open');
      nav.classList.toggle('menu-open', open);
      hamb.setAttribute('aria-expanded', String(open));
      hamb.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      hamb.textContent = open ? '✕' : '≡';
      menu.setAttribute('aria-hidden', String(!open));
      if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
      else if (wasOpen) { hamb.focus(); }   // 닫으면 햄버거로 포커스 복귀
    }
    hamb.addEventListener('click', function () {
      setMenu(!nav.classList.contains('menu-open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* ---- buy card close ---- */
  var bx = document.getElementById('buycardX');
  if (bx) bx.addEventListener('click', function () {
    var card = document.getElementById('buycard');
    card.classList.remove('show');
    card.dataset.closed = '1';
  });

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
          if (e.target.classList.contains('stats')) runStats();
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
    runStats();
  }

  /* ---- count-up stats ---- */
  var statsDone = false;
  function runStats() {
    if (statsDone) return; statsDone = true;
    document.querySelectorAll('.num').forEach(function (el) {
      var to = parseInt(el.dataset.to, 10) || 0;
      var suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = to + suffix; return; }
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---- diagnostic ---- */
  var diag = document.getElementById('diag') && document.querySelector('.diag');
  if (diag) {
    diag.querySelectorAll('.q').forEach(function (q) {
      q.querySelectorAll('.opt').forEach(function (o) {
        o.addEventListener('click', function () {
          q.querySelectorAll('.opt').forEach(function (x) { x.classList.remove('sel'); });
          o.classList.add('sel');
          hint();
        });
      });
    });

    function picked() {
      var out = {};
      diag.querySelectorAll('.q').forEach(function (q) {
        var s = q.querySelector('.opt.sel');
        out[q.dataset.q] = s ? s.dataset.w : null;
      });
      return out;
    }
    function complete() { var p = picked(); return p['1'] && p['2'] && p['3']; }
    function hint() {
      document.getElementById('diagHint').textContent =
        complete() ? '준비 완료 — 결과를 확인하세요' : '세 질문에 모두 답해주세요';
    }

    document.getElementById('diagBtn').addEventListener('click', function () {
      if (!complete()) { hint(); return; }
      var p = picked();
      var blend = p['2'];                                   // Q2 = 주 배정축
      var mismatch = (p['3'] !== '?' && p['3'] !== blend);  // 향 선호 불일치 신호
      var blends = {
        a: {
          name: 'CALM BASIL — 정돈된 집중',
          desc: '베르가못·바질 결. 중요한 순간 전 한 박자 정돈하는 스위치.'
        },
        b: {
          name: 'CLEAR MINT — 또렷한 모드',
          desc: '자몽·페퍼민트 결. 생각을 또렷하게 정리하는 스위치.'
        },
        c: {
          name: 'ENERGY CITRUS — 산뜻한 리프레시',
          desc: '시트러스 결. 분위기를 가볍게 바꾸는 스위치.'
        }
      };
      var selected = blends[blend];

      var card = document.getElementById('rcard');
      card.className = 'rcard ' + blend;
      var name = document.getElementById('rname');
      var desc = document.getElementById('rdesc');
      name.textContent = selected.name;
      desc.textContent = selected.desc;
      document.getElementById('rmismatch').textContent =
        mismatch ? '취향은 다른 결이지만, 지금 필요한 상태엔 이 쪽을 추천해요.' : '';

      var res = document.getElementById('diagResult');
      res.classList.add('show');
      res.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });

      // 검증 훅: 진단 결과를 사전주문 폼에 실어 전송(PII는 폼으로) + 집계는 Plausible로
      var diagStr = 'q1=' + p['1'] + ' q2=' + p['2'] + ' q3=' + p['3'] + ' blend=' + blend + ' mismatch=' + mismatch;
      var pfBlend = document.getElementById('pf-blend');
      var pfDiag = document.getElementById('pf-diag');
      if (pfBlend) pfBlend.value = blend;   // 진단 결과로 관심 향 자동 선택
      if (pfDiag) pfDiag.value = diagStr;
      track('진단완료', { blend: blend, mismatch: String(mismatch), preference: p['3'] });
    });
  }

  /* ---- preorder form submit ---- */
  var form = document.getElementById('preorderForm');
  if (form) {
    var msg = document.getElementById('pfMsg');
    var btn = document.getElementById('pfSubmit');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;                          // in-flight 가드 (Enter 연타 이중 제출 차단)
      var endpoint = form.getAttribute('action') || '';  // 단일 설정 지점
      var email = document.getElementById('pf-email');
      if (!email.value || !email.checkValidity()) {
        msg.className = 'pf-msg err'; msg.textContent = '올바른 이메일을 입력해주세요.'; email.focus(); return;
      }
      if (endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        // 엔드포인트 미설정: 거짓 성공 대신 개발 안내
        msg.className = 'pf-msg err';
        msg.textContent = '폼 엔드포인트 미설정 — index.html의 form action을 Formspree 폼 ID로 교체하세요.';
        return;
      }
      btn.disabled = true; var label = btn.textContent; btn.textContent = '전송 중…';
      msg.className = 'pf-msg'; msg.textContent = '';
      fetch(endpoint, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (r.ok) {
          var chosenBlend = document.getElementById('pf-blend').value || 'none';  // reset 전에 읽기
          form.reset();
          msg.className = 'pf-msg ok'; msg.textContent = '신청 완료. 출시되면 이메일로 알려드릴게요.';
          track('사전주문', { blend: chosenBlend });
        } else {
          return r.json().catch(function () { return null; }).then(function (d) {
            throw new Error((d && d.errors && d.errors[0] && d.errors[0].message) || '전송 실패');
          });
        }
      }).catch(function () {
        msg.className = 'pf-msg err';
        msg.textContent = '전송에 실패했어요. 잠시 후 다시 시도하거나 korrio093@gmail.com로 연락 주세요.';
      }).then(function () {
        btn.disabled = false; btn.textContent = label;
      });
    });
  }
})();
