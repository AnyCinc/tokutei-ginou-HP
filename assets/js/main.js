/* ============================================================
   株式会社ヒトキワ｜総合トップページ main.js
   - ハンバーガーメニュー開閉
   - スクロール時のヘッダー影
   - アンカークリックでメニューを閉じる
   - FAQ（details/summary）：同時に1つだけ開く（任意）
   Vanilla JS のみ。外部依存なし。
============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- モバイルナビ開閉 ---------- */
    var toggle  = document.getElementById("navToggle");
    var nav     = document.getElementById("globalNav");
    var overlay = document.getElementById("navOverlay");
    var body    = document.body;

    function openNav() {
      if (!nav) return;
      nav.classList.add("is-open");
      if (overlay) overlay.classList.add("is-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "メニューを閉じる");
      }
      body.style.overflow = "hidden";
    }

    function closeNav() {
      if (!nav) return;
      nav.classList.remove("is-open");
      if (overlay) overlay.classList.remove("is-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "メニューを開く");
      }
      body.style.overflow = "";
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) {
          closeNav();
        } else {
          openNav();
        }
      });
    }

    if (overlay) overlay.addEventListener("click", closeNav);

    // ナビ内リンクをクリックしたら閉じる
    if (nav) {
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeNav);
      });
    }

    // Escキーで閉じる
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    // 画面幅が広がったら開いた状態を解除
    var mq = window.matchMedia("(min-width: 921px)");
    var onMq = function (e) { if (e.matches) closeNav(); };
    if (mq.addEventListener) {
      mq.addEventListener("change", onMq);
    } else if (mq.addListener) {
      mq.addListener(onMq); // 旧Safari
    }

    /* ---------- スクロール時のヘッダー影 ---------- */
    var header = document.querySelector(".site-header");
    if (header) {
      var lastState = false;
      var onScroll = function () {
        var scrolled = window.pageYOffset > 8;
        if (scrolled !== lastState) {
          header.classList.toggle("is-scrolled", scrolled);
          lastState = scrolled;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* ---------- FAQ：同時に1つだけ開く（任意動作） ---------- */
    var faqItems = document.querySelectorAll(".faq .faq-item");
    faqItems.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          faqItems.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });

    /* ---------- 業種カード：キーボード操作対応 ----------
       カード内の .stretched リンクで全面クリック可能。
       カードに Enter フォーカスが来た場合の補助。 */
    document.querySelectorAll(".field-card").forEach(function (card) {
      var link = card.querySelector("a.stretched");
      if (!link) return;
      card.addEventListener("keydown", function (e) {
        if ((e.key === "Enter") && document.activeElement === card) {
          link.click();
        }
      });
    });

  });
})();
