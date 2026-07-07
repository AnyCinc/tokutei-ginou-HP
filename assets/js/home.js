/* ============================================================
   株式会社ヒトキワ｜トップページ専用 home.js
   - 人物/職種カードの横無限ループ（マウスで一時停止／reduced-motionで停止）
   - ファーストビュー人物写真の時間差表示
   - カードの時間差表示（stagger）
   - 数字のカウントアップ（data-count がある場合のみ。架空数値は作らない）
   Vanilla JS のみ。common.js と併用。
============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 横無限ループ（マーキー） ----------
       .marquee-track の中身を複製して途切れずループ。
       CSS側で width:max-content / animation を設定済み。
       JSが無効でも横並びで表示される。 */
    document.querySelectorAll(".marquee").forEach(function (marquee) {
      var track = marquee.querySelector(".marquee-track");
      if (!track) return;
      // 既に複製済みでなければ複製（合計幅の50%で-50%へ流すループのため2倍化）
      if (!track.dataset.cloned) {
        var html = track.innerHTML;
        track.innerHTML = html + html;
        track.dataset.cloned = "1";
      }
      if (reduceMotion) {
        track.style.animation = "none";
      }
    });

    /* ---------- ファーストビュー人物写真の時間差表示 ---------- */
    var heroPhotos = document.querySelectorAll(".hero-mosaic [data-hero]");
    if (heroPhotos.length) {
      if (reduceMotion) {
        heroPhotos.forEach(function (el) { el.classList.add("is-visible"); });
      } else {
        heroPhotos.forEach(function (el) {
          el.style.opacity = "0";
          el.style.transform = "translateY(16px) scale(.98)";
          el.style.transition = "opacity .6s cubic-bezier(.22,.61,.36,1), transform .6s cubic-bezier(.22,.61,.36,1)";
        });
        requestAnimationFrame(function () {
          heroPhotos.forEach(function (el) {
            var delay = parseInt(el.getAttribute("data-hero"), 10) || 0;
            setTimeout(function () {
              el.style.opacity = "1";
              el.style.transform = "none";
            }, 120 + delay * 150);
          });
        });
      }
    }

    /* ---------- カードの時間差表示（grid配下の[data-stagger]） ---------- */
    if (!reduceMotion && "IntersectionObserver" in window) {
      var groups = document.querySelectorAll("[data-stagger]");
      var sIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var kids = en.target.children;
          for (var i = 0; i < kids.length; i++) {
            (function (el, idx) {
              el.style.transitionDelay = (idx * 0.09) + "s";
            })(kids[i], i);
            kids[i].classList.add("is-visible");
          }
          sIO.unobserve(en.target);
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
      groups.forEach(function (g) { sIO.observe(g); });
    } else {
      document.querySelectorAll("[data-stagger] > *").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }

    /* ---------- 数字カウントアップ（data-count 属性がある場合のみ） ---------- */
    var counters = document.querySelectorAll("[data-count]");
    if (counters.length) {
      var run = function (el) {
        var target = parseFloat(el.getAttribute("data-count"));
        if (isNaN(target)) return;
        if (reduceMotion) { el.textContent = el.getAttribute("data-count"); return; }
        var dur = 1100, start = null;
        var suffix = el.getAttribute("data-suffix") || "";
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var val = Math.floor(target * (0.5 - Math.cos(p * Math.PI) / 2));
          el.textContent = val.toLocaleString("ja-JP") + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString("ja-JP") + suffix;
        };
        requestAnimationFrame(step);
      };
      if ("IntersectionObserver" in window) {
        var cIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { run(en.target); cIO.unobserve(en.target); }
          });
        }, { threshold: 0.5 });
        counters.forEach(function (c) { cIO.observe(c); });
      } else {
        counters.forEach(run);
      }
    }

  });
})();
