/* ============================================================
   株式会社ヒトキワ｜共通 common.js
   - ハンバーガーメニュー開閉
   - スクロール時のヘッダー変化（影・高さ）
   - FAQ（details）アコーディオン
   - スムーススクロール（アンカー）
   - フェードアップ表示（IntersectionObserver）
   - 画像読み込み失敗時の仮枠フォールバック
   Vanilla JS のみ。エラーが起きても本文表示は維持。
============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- モバイルナビ ---------- */
    var toggle  = document.getElementById("navToggle");
    var nav     = document.getElementById("globalNav");
    var overlay = document.getElementById("navOverlay");
    var body    = document.body;

    function openNav(){
      if(!nav) return;
      nav.classList.add("is-open");
      if(overlay) overlay.classList.add("is-open");
      if(toggle){toggle.setAttribute("aria-expanded","true");toggle.setAttribute("aria-label","メニューを閉じる");}
      body.style.overflow="hidden";
    }
    function closeNav(){
      if(!nav) return;
      nav.classList.remove("is-open");
      if(overlay) overlay.classList.remove("is-open");
      if(toggle){toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","メニューを開く");}
      body.style.overflow="";
    }
    if(toggle && nav){
      toggle.addEventListener("click",function(){
        nav.classList.contains("is-open") ? closeNav() : openNav();
      });
    }
    if(overlay) overlay.addEventListener("click",closeNav);
    if(nav){nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",closeNav);});}
    document.addEventListener("keydown",function(e){if(e.key==="Escape")closeNav();});
    var mq=window.matchMedia("(min-width:1201px)");
    var onMq=function(e){if(e.matches)closeNav();};
    if(mq.addEventListener)mq.addEventListener("change",onMq);
    else if(mq.addListener)mq.addListener(onMq);

    /* ---------- ヘッダーのスクロール変化 ---------- */
    var header=document.querySelector(".site-header");
    if(header){
      var last=null;
      var onScroll=function(){
        var s=window.pageYOffset>10;
        if(s!==last){header.classList.toggle("is-scrolled",s);last=s;}
      };
      window.addEventListener("scroll",onScroll,{passive:true});
      onScroll();
    }

    /* ---------- FAQ：同時に1つだけ開く ---------- */
    var faqItems=document.querySelectorAll(".faq .faq-item");
    faqItems.forEach(function(item){
      item.addEventListener("toggle",function(){
        if(item.open){faqItems.forEach(function(o){if(o!==item)o.open=false;});}
      });
    });

    /* ---------- スムーススクロール（固定ヘッダー分オフセット） ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function(link){
      var id=link.getAttribute("href");
      if(!id||id==="#"||id.length<2) return;
      link.addEventListener("click",function(e){
        var target=document.querySelector(id);
        if(!target) return;
        e.preventDefault();
        var hh=header?header.offsetHeight:0;
        var y=target.getBoundingClientRect().top+window.pageYOffset-hh-8;
        window.scrollTo({top:y,behavior:reduceMotion?"auto":"smooth"});
      });
    });

    /* ---------- 動画：クリックでYouTubeを読み込む（軽量化） ---------- */
    document.querySelectorAll(".js-video").forEach(function(v){
      var load=function(){
        if(v.dataset.loaded) return;
        v.dataset.loaded="1";
        var f=document.createElement("iframe");
        f.src=v.getAttribute("data-embed");
        f.title=v.getAttribute("data-title")||"動画";
        f.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        f.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
        f.setAttribute("allowfullscreen","");
        v.innerHTML="";
        v.appendChild(f);
        v.style.cursor="default";
      };
      v.addEventListener("click",load);
      v.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); load(); }});
    });

    /* ---------- 画像フォールバック（読み込み失敗で仮枠表示） ---------- */
    document.querySelectorAll(".ph-frame > img").forEach(function(img){
      var fail=function(){img.classList.add("img-broken");};
      if(img.complete && img.naturalWidth===0) fail();
      img.addEventListener("error",fail);
    });

    /* ---------- フェードアップ（共通） ---------- */
    var animated=document.querySelectorAll("[data-animate]");
    if(reduceMotion || !("IntersectionObserver" in window)){
      animated.forEach(function(el){el.classList.add("is-visible");});
    }else{
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){en.target.classList.add("is-visible");io.unobserve(en.target);}
        });
      },{threshold:.12,rootMargin:"0px 0px -8% 0px"});
      animated.forEach(function(el){io.observe(el);});
    }

  });
})();
