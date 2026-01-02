/* ==========================================================================
   WatiqaInfo — main.js (FINAL)
   Rules:
   - ONE JS file (no libs)
   - Header/Footer injected once
   - Smart language switch (AR/FR)
   - Theme toggle (dark/light) ONLY in header (no duplicate buttons)
   - Back-to-top floating button (kept)
   - UX: mark current page link in nav (aria-current="page")
   - Footer: Option B (centered + inline links + NO logo in footer)
   ========================================================================== */

(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // Constants
  // --------------------------------------------------------------------------
  const THEME_KEY = "watiqainfo_theme"; // "dark" | "light"
  const SCROLL_SHOW_TOP_AT = 360; // px

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function safeGetItem(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeSetItem(key, val) {
    try { localStorage.setItem(key, val); } catch (_) {}
  }

  function getHtmlLang() {
    const lang = document.documentElement.getAttribute("lang");
    return (lang === "fr" || lang === "ar") ? lang : null;
  }

  function detectLangFromPath() {
    const p = window.location.pathname || "";
    if (p.includes("/fr/")) return "fr";
    if (p.includes("/ar/")) return "ar";
    return getHtmlLang() || "ar";
  }

  function t(ar, fr) {
    return detectLangFromPath() === "ar" ? ar : fr;
  }

  function ensureLangDir() {
    const lang = detectLangFromPath();
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }

  function normalizePath(p) {
    if (!p) return "/";
    const clean = p.split("#")[0].split("?")[0];
    if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
    return clean;
  }

  // --------------------------------------------------------------------------
  // Language switch
  // --------------------------------------------------------------------------
  function computeLangSwitchHref() {
    const p = window.location.pathname || "/";
    const lang = detectLangFromPath();
    const other = lang === "ar" ? "fr" : "ar";

    if (p.includes("/ar/")) return p.replace("/ar/", "/fr/");
    if (p.includes("/fr/")) return p.replace("/fr/", "/ar/");

    return other === "ar" ? "/ar/index.html" : "/fr/index.html";
  }

  // --------------------------------------------------------------------------
  // Theme
  // --------------------------------------------------------------------------
  function getPreferredTheme() {
    const saved = safeGetItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || getPreferredTheme();
    const next = current === "dark" ? "light" : "dark";
    safeSetItem(THEME_KEY, next);
    applyTheme(next);
    updateThemeButton();
  }

  function updateThemeButton() {
    const theme = document.documentElement.getAttribute("data-theme") || getPreferredTheme();
    const isDark = theme === "dark";

    const btnInline = $("#theme-toggle-inline");
    if (btnInline) {
      btnInline.setAttribute("aria-pressed", isDark ? "true" : "false");
      btnInline.setAttribute(
        "title",
        isDark ? t("حوّل للنهاري", "Passer en mode clair") : t("حوّل لليلي", "Passer en mode sombre")
      );
    }
  }

  // --------------------------------------------------------------------------
  // Templates
  // --------------------------------------------------------------------------
  function headerTemplate() {
    const lang = detectLangFromPath();
    const other = lang === "ar" ? "fr" : "ar";
    const homeHref = lang === "ar" ? "/ar/index.html" : "/fr/index.html";
    const aboutHref = "/about-us.html";
    const langSwitchHref = computeLangSwitchHref();

    const langLabel = lang === "ar" ? "FR" : "AR";
    const langFlag = lang === "ar" ? "🇫🇷" : "🇲🇦";

    return (
      '\n    <header class="site-header">\n' +
      '      <div class="container site-header__inner">\n' +
      '        <a class="brand" href="' + homeHref + '" aria-label="' + t("الرجوع للرئيسية", "Accueil") + '">\n' +
      '          <span class="brand__badge" aria-hidden="true">W</span>\n' +
      '          <span class="brand__text">\n' +
      "            WatiqaInfo\n" +
      "            <small>" + t("دليل المساطر المغربية", "Guide des procédures marocaines") + "</small>\n" +
      "          </span>\n" +
      "        </a>\n\n" +
      '        <nav class="nav" aria-label="' + t("التنقل", "Navigation") + '">\n' +
      '          <a href="' + aboutHref + '">' + t("من نحن", "À propos") + "</a>\n\n" +
      '          <a class="nav-btn" href="' + langSwitchHref + '" hreflang="' + other + '" rel="alternate" aria-label="' + t("تغيير اللغة", "Changer la langue") + '">\n' +
      '            <span aria-hidden="true">' + langFlag + '</span>\n' +
      '            <span style="margin-inline-start: 8px;">' + langLabel + "</span>\n" +
      "          </a>\n\n" +
      '          <button class="nav-btn" id="theme-toggle-inline" type="button" aria-pressed="false" aria-label="' + t("تغيير الوضع", "Changer le mode") + '">\n' +
      '            <span aria-hidden="true">🌓</span>\n' +
      '            <span style="margin-inline-start: 8px;">' + t("الوضع", "Mode") + "</span>\n" +
      "          </button>\n" +
      "        </nav>\n" +
      "      </div>\n" +
      "    </header>\n"
    );
  }

  function footerTemplate() {
    const lang = detectLangFromPath();
    const year = new Date().getFullYear();

    const aboutHref = "/about-us.html";
    const privacyHref = "/privacy.html";
    const disclaimerHref = "/disclaimer.html";

    const note =
      lang === "ar"
        ? "المحتوى للتوضيح والمساعدة. إذا كان شي تحديث فالإدارة، تأكد من الجهة المختصة."
        : "Contenu à titre d’aide. En cas de changement, vérifiez auprès de l’administration concernée.";

    return (
      '\n    <footer class="site-footer">\n' +
      '      <div class="container site-footer__inner site-footer__inner--centered">\n' +
      '        <p class="footer-note">' + note + "</p>\n" +
      '        <div class="footer-links footer-links--inline" aria-label="' + (lang === "ar" ? "روابط" : "Liens") + '">\n' +
      '          <a href="' + aboutHref + '">' + (lang === "ar" ? "من نحن" : "À propos") + "</a>\n" +
      '          <span class="footer-sep" aria-hidden="true">•</span>\n' +
      '          <a href="' + privacyHref + '">' + (lang === "ar" ? "الخصوصية" : "Confidentialité") + "</a>\n" +
      '          <span class="footer-sep" aria-hidden="true">•</span>\n' +
      '          <a href="' + disclaimerHref + '">' + (lang === "ar" ? "إخلاء المسؤولية" : "Avertissement") + "</a>\n" +
      "        </div>\n" +
      '        <div class="footer-copy">© ' + year + " WatiqaInfo</div>\n" +
      "      </div>\n" +
      "    </footer>\n"
    );
  }

  // --------------------------------------------------------------------------
  // Utilities UI (floating buttons)
  // --------------------------------------------------------------------------
  function utilsTemplate() {
    return (
      '\n    <div id="watiqainfo-utils" aria-label="' + t("أدوات", "Outils") + '">\n' +
      '      <div class="utils">\n' +
      '        <button class="util-btn" id="back-to-top" type="button">\n' +
      '          <span class="util-ico" aria-hidden="true">↑</span>\n' +
      '          <span class="util-label">' + t("لفوق", "Haut") + "</span>\n" +
      "        </button>\n" +
      "      </div>\n" +
      "    </div>\n"
    );
  }

  function ensureUtilities() {
    if ($("#watiqainfo-utils")) return;

    document.body.insertAdjacentHTML("beforeend", utilsTemplate());

    const topBtn = $("#back-to-top");
    if (topBtn) {
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    updateBackToTopVisibility();
  }

  function updateBackToTopVisibility() {
    const wrap = $("#watiqainfo-utils");
    if (!wrap) return;

    const shouldShow = window.scrollY > SCROLL_SHOW_TOP_AT;
    if (shouldShow) wrap.classList.add("show-top");
    else wrap.classList.remove("show-top");
  }

  // --------------------------------------------------------------------------
  // Inject header / footer
  // --------------------------------------------------------------------------
  function injectHeaderFooter() {
    const headerHost = $("#site-header");
    if (headerHost && headerHost.children.length === 0) {
      headerHost.innerHTML = headerTemplate();
    }

    const footerHost = $("#site-footer");
    if (footerHost && footerHost.children.length === 0) {
      footerHost.innerHTML = footerTemplate();
    }
  }

  // --------------------------------------------------------------------------
  // Mark current page in nav
  // --------------------------------------------------------------------------
  function markCurrentNavLink() {
    const nav = $(".site-header .nav");
    if (!nav) return;

    const currentPath = normalizePath(window.location.pathname);
    const links = nav.querySelectorAll("a[href]");

    links.forEach(function (a) {
      a.removeAttribute("aria-current");

      let hrefPath = "";
      try {
        const u = new URL(a.getAttribute("href"), window.location.origin);
        hrefPath = normalizePath(u.pathname);
      } catch (_) {
        return;
      }

      if (hrefPath === currentPath) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  // --------------------------------------------------------------------------
  // Init
  // --------------------------------------------------------------------------
  function init() {
    ensureLangDir();

    // Theme early
    applyTheme(getPreferredTheme());

    // Inject shared layout
    injectHeaderFooter();

    // Bind header theme button
    const themeInline = $("#theme-toggle-inline");
    if (themeInline) {
      themeInline.addEventListener("click", function () {
        toggleTheme();
      });
    }

    updateThemeButton();
    markCurrentNavLink();

    // Utilities (floating back-to-top)
    ensureUtilities();

    // Scroll listener for back-to-top
    window.addEventListener(
      "scroll",
      function () {
        updateBackToTopVisibility();
      },
      { passive: true }
    );
  }

  // Run
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();