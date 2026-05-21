/**
 * 리필링크 랜딩 — 인터랙션 (reveal / nav / 손실계산기 / FAQ / 입점신청 폼)
 * 폼 저장은 firebase.js의 window.saveOwnerApplication()을 호출합니다.
 */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function track(name, params) {
    if (typeof window.trackEvent === "function") { window.trackEvent(name, params || {}); }
    else { console.log("[track]", name, params || {}); }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.initAnalytics === "function") { try { window.initAnalytics(); } catch (e) {} }
    if (typeof window.initFirebase === "function") { try { window.initFirebase(); } catch (e) {} }

    /* year */
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    /* reveal on scroll */
    var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }) : null;
    $$(".reveal").forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); });

    /* header shadow */
    var header = $("#siteHeader");
    window.addEventListener("scroll", function () { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });

    /* mobile menu */
    var toggle = $("#navToggle"), mnav = $("#mobileNav");
    if (toggle && mnav) {
      toggle.addEventListener("click", function () {
        var open = mnav.hasAttribute("hidden");
        if (open) { mnav.removeAttribute("hidden"); } else { mnav.setAttribute("hidden", ""); }
        toggle.setAttribute("aria-expanded", String(open));
      });
      $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { mnav.setAttribute("hidden", ""); toggle.setAttribute("aria-expanded", "false"); }); });
    }

    /* mobile fixed cta — hero 지나면 표시 */
    var mcta = $("#mobileCtaBar"), hero = $("#hero");
    if (mcta && hero && io) {
      mcta.style.transition = "transform .25s ease";
      var hObs = new IntersectionObserver(function (es) {
        es.forEach(function (e) { mcta.style.transform = e.isIntersecting ? "translateY(120%)" : "translateY(0)"; });
      }, { threshold: 0 });
      hObs.observe(hero);
    }

    /* 손실 계산기 */
    var dailyEl = $("#dailyLoss"), daysEl = $("#monthlyDays"), resBox = $("#calculatorResults");
    var mEl = $("#monthlyLossResult"), yEl = $("#yearlyLossResult"), exEl = $("#calculatorExample");
    var calcTracked = false;
    function won(n) { return n.toLocaleString("ko-KR") + "원"; }
    function manExpr(n) { var man = Math.round(n / 10000); return man >= 1 ? ("약 " + man.toLocaleString("ko-KR") + "만원") : won(n); }
    function calc() {
      if (!dailyEl || !daysEl) return;
      var d = parseFloat(dailyEl.value), days = parseFloat(daysEl.value);
      if (isNaN(d) || isNaN(days) || d < 0 || days < 1) { if (resBox) resBox.hidden = true; return; }
      if (days > 31) days = 31;
      var monthly = d * days, yearly = monthly * 12;
      if (mEl) mEl.textContent = won(monthly);
      if (yEl) yEl.textContent = won(yearly);
      if (exEl) exEl.textContent = "하루 " + manExpr(d) + "씩 버린다면, 한 달에 " + manExpr(monthly) + "의 매출 기회를 놓치고 있어요.";
      if (resBox) resBox.hidden = false;
      if (!calcTracked) { calcTracked = true; track("loss_calculator_used", { dailyLoss: d, monthlyDays: days, monthlyLoss: monthly, yearlyLoss: yearly }); }
    }
    if (dailyEl) dailyEl.addEventListener("input", calc);
    if (daysEl) daysEl.addEventListener("input", calc);

    /* FAQ tracking */
    $$("#faqList details").forEach(function (d) {
      d.addEventListener("toggle", function () { if (d.open) { var q = $("summary .q", d); track("faq_open", { question: q ? q.textContent.replace(/^Q/, "").trim() : "" }); } });
    });

    /* CTA tracking */
    $$("[data-cta-owner]").forEach(function (b) { b.addEventListener("click", function () { track("cta_click_owner", { section: b.getAttribute("data-section") || "" }); }); });

    /* 신청 완료 모달 */
    function bindOwnerSuccessModal() {
      var modal = $("#ownerSuccessModal");
      if (!modal) return { open: function () {}, close: function () {} };
      function close() {
        modal.setAttribute("hidden", "");
        document.body.style.overflow = "";
      }
      function open() {
        modal.removeAttribute("hidden");
        document.body.style.overflow = "hidden";
        var ok = $("[data-modal-close].btn", modal);
        if (ok && ok.focus) ok.focus();
      }
      $$("[data-modal-close]", modal).forEach(function (el) { el.addEventListener("click", close); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !modal.hasAttribute("hidden")) close();
      });
      return { open: open, close: close };
    }
    var successModal = bindOwnerSuccessModal();

    /* 입점 신청 폼 */
    var form = $("#ownerApplyForm");
    if (form) {
      var fields = [
        { el: "storeName", key: "storeName", msg: "가게명을 입력해주세요." },
        { el: "businessType", key: "businessType", msg: "업종을 선택해주세요." },
        { el: "location", key: "location", msg: "위치/상권을 입력해주세요." },
        { el: "managerName", key: "managerName", msg: "담당자 이름을 입력해주세요." },
        { el: "phone", key: "phone", type: "phone", msg: "연락처를 정확히 입력해주세요." },
        { el: "ownerConsent", type: "consent", msg: "개인정보 수집에 동의해주세요." }
      ];
      function setErr(name, msg) { var el = $('[data-err="' + name + '"]', form); if (el) el.textContent = msg || ""; }
      function digits(v) { return (v || "").replace(/\D/g, ""); }

      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        $$(".field-err", form).forEach(function (e) { e.textContent = ""; });
        var data = {}, ok = true, firstBad = null;
        fields.forEach(function (f) {
          var el = $("#" + f.el, form);
          var val = el ? (el.type === "checkbox" ? el.checked : el.value.trim()) : "";
          if (f.type === "consent" && !val) { setErr(f.el, f.msg); ok = false; firstBad = firstBad || el; }
          else if (f.type === "phone") { if (digits(val).length < 9) { setErr(f.el, f.msg); ok = false; firstBad = firstBad || el; } }
          else if (!val) { setErr(f.el, f.msg); ok = false; firstBad = firstBad || el; }
          if (f.key) data[f.key] = val;
        });
        var msgBox = $("#ownerFormMessage");
        if (!ok) { if (firstBad && firstBad.focus) firstBad.focus(); if (msgBox) { msgBox.className = "form-msg"; msgBox.textContent = ""; } return; }

        data.source = "landing";
        var btn = $('button[type="submit"]', form), label = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "제출 중..."; }
        if (msgBox) { msgBox.className = "form-msg"; msgBox.textContent = ""; }

        Promise.resolve(
          typeof window.saveOwnerApplication === "function"
            ? window.saveOwnerApplication(data)
            : new Promise(function (r) { setTimeout(r, 500); })
        ).then(function () {
          track("owner_lead_submit", { businessType: data.businessType, location: data.location });
          if (msgBox) { msgBox.className = "form-msg"; msgBox.textContent = ""; }
          successModal.open();
          form.reset();
        }).catch(function (err) {
          console.error(err);
          if (msgBox) { msgBox.className = "form-msg err"; msgBox.textContent = "일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요."; }
        }).then(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
      });
    }
  });
})();
