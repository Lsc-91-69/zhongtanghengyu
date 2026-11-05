/* ============================================================
 *  渲染与交互
 *  内容都在 data.js 里，这个文件一般不用改
 * ============================================================ */

(function () {
  "use strict";

  var baseData = window.siteData;
  if (!baseData) {
    console.error("[site] 没有找到 data.js 里的 siteData");
    return;
  }

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var esc = function (value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  };

  var fmt = function (tpl, vars) {
    return String(tpl == null ? "" : tpl).replace(/\{(\w+)\}/g, function (m, key) {
      return vars && vars[key] != null ? vars[key] : "";
    });
  };

  var isImage = function (src) {
    return (
      /^(https?:\/\/|\.{0,2}\/|data:image)/i.test(src) ||
      /\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i.test(src)
    );
  };

  /* ---------- 本地存储（隐私模式下会抛错） ---------- */

  var storage = (function () {
    try {
      var k = "__site_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return window.localStorage;
    } catch (e) {
      var memory = {};
      return {
        getItem: function (key) {
          return key in memory ? memory[key] : null;
        },
        setItem: function (key, val) {
          memory[key] = String(val);
        },
        removeItem: function (key) {
          delete memory[key];
        },
      };
    }
  })();

  /* ---------- 中英文 ---------- */

  var LANG_KEY = "site-lang";
  var THEME_KEY = "site-theme";
  var SUPPORTED = ["zh", "en"];

  var DEFAULT_UI = {
    navLabel: "主导航",
    skip: "跳到主要内容",
    themeToggle: "切换亮色 / 暗色",
    langToggle: "Switch to English",
    langButton: "EN",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    avatarAlt: "{name}的头像",
    backTop: "回到顶部",
    carousel: "图集",
    prev: "上一张",
    next: "下一张",
    slide: "第 {n} 张：{alt}",
    gradeLabel: "GRADE",
  };

  var lang = storage.getItem(LANG_KEY);
  if (SUPPORTED.indexOf(lang) === -1) lang = "zh";

  var data = baseData;
  var ui = {};

  function mergeDeep(base, extra) {
    if (Array.isArray(base)) {
      if (!Array.isArray(extra)) return base;
      return base.map(function (item, i) {
        return mergeDeep(item, extra[i]);
      });
    }
    if (base && typeof base === "object") {
      if (!extra || typeof extra !== "object") return base;
      var out = {};
      Object.keys(base).forEach(function (key) {
        out[key] = key in extra ? mergeDeep(base[key], extra[key]) : base[key];
      });
      Object.keys(extra).forEach(function (key) {
        if (!(key in base)) out[key] = extra[key];
      });
      return out;
    }
    return extra === undefined ? base : extra;
  }

  function resolveLang() {
    data = lang === "zh" || !baseData.en ? baseData : mergeDeep(baseData, baseData.en);
    ui = Object.assign({}, DEFAULT_UI, baseData.ui || {}, data.ui || {});
  }

  resolveLang();

  /* ---------- 元素 ---------- */

  var root = document.documentElement;
  var header = $("#siteHeader");
  var navLinks = $("#navLinks");
  var brand = $("#brand");
  var menuToggle = $("#menuToggle");
  var themeToggle = $("#themeToggle");
  var langToggle = $("#langToggle");
  var backTop = $("#backTop");
  var carouselEl = $("#carousel");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 渲染：meta ---------- */

  function applyMeta() {
    root.lang = (data.meta && data.meta.lang) || (lang === "en" ? "en" : "zh-CN");
    document.title = (data.meta && data.meta.title) || "个人主页";

    var desc = (data.meta && data.meta.description) || "";
    var descEl = $('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", desc);

    var ogTitle = $('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", document.title);

    var ogDesc = $('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", desc);
  }

  /* ---------- 渲染：顶栏 ---------- */

  function renderNav() {
    var profile = data.profile || {};

    if (brand) brand.textContent = profile.name || "";

    if (navLinks) {
      navLinks.innerHTML = (data.nav || [])
        .map(function (item) {
          return '<li><a href="' + esc(item.href) + '">' + esc(item.label) + "</a></li>";
        })
        .join("");
    }
  }

  /* ---------- 渲染：首屏 ---------- */

  function renderHero() {
    var p = data.profile || {};

    var eyebrow = $("#heroEyebrow");
    if (eyebrow) eyebrow.textContent = p.eyebrow || "";

    var nameEl = $("#heroName");
    if (nameEl) nameEl.textContent = p.name || "";

    var metaEl = $("#heroMeta");
    if (metaEl) {
      var parts = [p.latin, p.school, p.grade].filter(Boolean);
      metaEl.innerHTML = parts
        .map(esc)
        .join('<span class="sep" aria-hidden="true">·</span>');
    }

    var taglineEl = $("#heroTagline");
    if (taglineEl) {
      var tagline = p.tagline || "";
      taglineEl.textContent = tagline;
      taglineEl.hidden = !tagline;
    }

    var statusEl = $("#statusText");
    if (statusEl) statusEl.textContent = p.status || "";

    var gradeEl = $("#gradeText");
    if (gradeEl) {
      var num = String(p.grade || "").match(/\d+/);
      gradeEl.innerHTML = num
        ? esc(ui.gradeLabel) + " <b>" + esc(num[0]) + "</b>"
        : esc(p.grade || "");
      gradeEl.hidden = !p.grade;
    }

    var media = $("#avatarMedia");
    if (media) {
      var avatar = p.avatar || "";
      if (isImage(avatar)) {
        media.innerHTML =
          '<img src="' + esc(avatar) + '" alt="' + esc(fmt(ui.avatarAlt, { name: p.name })) + '" />';
        var img = media.querySelector("img");
        if (img) {
          img.addEventListener(
            "error",
            function () {
              media.innerHTML = '<span class="avatar-emoji">🐊</span>';
            },
            { once: true }
          );
        }
      } else {
        media.innerHTML = '<span class="avatar-emoji">' + esc(avatar) + "</span>";
      }
    }

    var actionsEl = $("#heroActions");
    if (actionsEl) {
      actionsEl.innerHTML = (p.actions || [])
        .map(function (btn) {
          var cls = btn.style === "ghost" ? "btn btn-ghost" : "btn btn-primary";
          return '<a class="' + cls + '" href="' + esc(btn.href) + '">' + esc(btn.label) + "</a>";
        })
        .join("");
    }
  }

  /* ---------- 渲染：通用区块标题 ---------- */

  function fillSectionHead(id, block) {
    var section = document.getElementById(id);
    if (!section) return;

    if (!block) {
      section.hidden = true;
      return;
    }
    section.hidden = false;

    var eyebrow = $("[data-eyebrow]", section);
    if (eyebrow) {
      eyebrow.textContent = block.eyebrow || "";
      eyebrow.hidden = !block.eyebrow;
    }

    var title = $("[data-title]", section);
    if (title) {
      title.textContent = block.title || "";
      title.hidden = !block.title;
    }

    var sub = $("[data-subtitle]", section);
    if (sub) {
      sub.textContent = block.subtitle || "";
      sub.hidden = !block.subtitle;
    }
  }

  /* ---------- 渲染：关于我 ---------- */

  function renderAbout() {
    var about = data.about || {};
    fillSectionHead("about", data.about);

    var textEl = $("#aboutText");
    if (textEl) {
      textEl.innerHTML = (about.paragraphs || [])
        .map(function (p) {
          return "<p>" + esc(p) + "</p>";
        })
        .join("");
    }

    var factsEl = $("#aboutFacts");
    if (factsEl) {
      factsEl.innerHTML = (about.facts || [])
        .map(function (f) {
          return (
            '<div class="fact"><dt>' +
            esc(f.k) +
            "</dt><dd>" +
            esc(f.v) +
            "</dd></div>"
          );
        })
        .join("");
    }
  }

  /* ---------- 渲染：游戏档案 ---------- */

  function renderGames() {
    var games = data.games || {};
    fillSectionHead("games", data.games);

    var grid = $("#gamesGrid");
    if (!grid) return;

    grid.innerHTML = (games.items || [])
      .map(function (g) {
        var wide = g.size === "wide" ? " wide" : "";
        var tags = (g.tags || [])
          .map(function (t) {
            return "<span>" + esc(t) + "</span>";
          })
          .join("");

        return (
          '<article class="game-card' +
          wide +
          '" data-reveal>' +
          '<div class="game-media"><img src="' +
          esc(g.img) +
          '" alt="' +
          esc(g.alt || "") +
          '" loading="lazy" decoding="async" /></div>' +
          '<div class="game-body">' +
          '<h3 class="game-name">' +
          esc(g.name) +
          "</h3>" +
          '<p class="game-note">' +
          esc(g.note) +
          "</p>" +
          (tags ? '<div class="game-tags">' + tags + "</div>" : "") +
          "</div></article>"
        );
      })
      .join("");
  }

  /* ---------- 渲染：高光时刻 ---------- */

  function renderMoments() {
    var moments = data.moments || {};
    fillSectionHead("moments", data.moments);

    var list = $("#momentsList");
    if (!list) return;

    list.innerHTML = (moments.items || [])
      .map(function (m) {
        return (
          '<article class="moment" data-reveal>' +
          '<p class="moment-year">' +
          esc(m.year) +
          "</p>" +
          '<div class="moment-body"><h3 class="moment-title">' +
          esc(m.title) +
          "</h3>" +
          '<p class="moment-desc">' +
          esc(m.desc) +
          "</p></div>" +
          '<figure class="moment-figure"><img src="' +
          esc(m.img) +
          '" alt="' +
          esc(m.alt || "") +
          '" loading="lazy" decoding="async" /></figure>' +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------- 渲染：图集轮播 ---------- */

  var carousel = (function () {
    var track = $("#carouselTrack");
    var dotsBox = $("#carouselDots");
    var countEl = $("#carouselCount");
    var stage = $("#carouselStage");
    var prevBtn = $("#carouselPrev");
    var nextBtn = $("#carouselNext");

    var items = [];
    var index = 0;

    function update() {
      if (!track) return;

      track.style.transform = "translateX(-" + index * 100 + "%)";

      $$(".slide", track).forEach(function (s, i) {
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
      });

      if (dotsBox) {
        $$(".dot-btn", dotsBox).forEach(function (d, i) {
          var active = i === index;
          d.classList.toggle("active", active);
          d.setAttribute("aria-current", active ? "true" : "false");
        });
      }

      if (countEl) countEl.textContent = index + 1 + " / " + items.length;
    }

    function goTo(next) {
      if (!items.length) return;
      index = (next + items.length) % items.length;
      update();
    }

    function build(list) {
      items = list || [];
      if (!track) return;

      track.innerHTML = items
        .map(function (g, i) {
          var contain = g.fit === "contain";
          var bg = contain
            ? '<div class="slide-bg" style="background-image:url(\'' +
              esc(g.src) +
              "')\" aria-hidden=\"true\"></div>"
            : "";
          return (
            '<figure class="slide' +
            (contain ? " slide--contain" : "") +
            '" data-index="' +
            i +
            '" aria-hidden="true">' +
            bg +
            '<img src="' +
            esc(g.src) +
            '" alt="' +
            esc(g.alt || "") +
            '" loading="lazy" decoding="async" draggable="false" /></figure>'
          );
        })
        .join("");

      if (dotsBox) {
        dotsBox.innerHTML = items
          .map(function (g, i) {
            return (
              '<button class="dot-btn" type="button" data-index="' +
              i +
              '" aria-label="' +
              esc(fmt(ui.slide, { n: i + 1, alt: g.alt || "" })) +
              '"></button>'
            );
          })
          .join("");
      }

      index = Math.min(index, Math.max(0, items.length - 1));
      update();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    if (dotsBox) {
      dotsBox.addEventListener("click", function (e) {
        var dot = e.target.closest(".dot-btn");
        if (dot) goTo(Number(dot.dataset.index));
      });
    }

    if (carouselEl) {
      carouselEl.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goTo(index - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goTo(index + 1);
        }
      });
    }

    var dragging = false;
    var startX = 0;
    var offset = 0;

    if (stage) {
      stage.addEventListener("pointerdown", function (e) {
        if (!items.length) return;
        if (e.target.closest(".carousel-btn")) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        offset = 0;
        track.style.transition = "none";
        try {
          if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
        } catch (_) {
          /* 某些环境不支持指针捕获 */
        }
      });

      stage.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        offset = e.clientX - startX;
        var limit = stage.clientWidth * 0.9;
        var clamped = Math.max(-limit, Math.min(limit, offset));
        track.style.transform =
          "translateX(calc(-" + index * 100 + "% + " + clamped * 0.55 + "px))";
      });

      function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        track.style.transition = "";
        if (e && typeof e.clientX === "number") offset = e.clientX - startX;
        var threshold = Math.min(60, stage.clientWidth * 0.12);
        if (offset <= -threshold) goTo(index + 1);
        else if (offset >= threshold) goTo(index - 1);
        else update();
      }

      stage.addEventListener("pointerup", endDrag);
      stage.addEventListener("pointercancel", endDrag);
    }

    return { build: build };
  })();

  function renderGallery() {
    var gallery = data.gallery || {};
    fillSectionHead("gallery", data.gallery);
    carousel.build(gallery.items || []);
  }

  /* ---------- 渲染：页脚 ---------- */

  function renderFooter() {
    var nameEl = $("#footerName");
    if (nameEl) {
      nameEl.textContent =
        "© " + new Date().getFullYear() + " " + ((data.profile && data.profile.name) || "");
    }

    var noteEl = $("#footerText");
    if (noteEl) noteEl.textContent = (data.footer && data.footer.text) || "";
  }

  /* ---------- 渲染：无障碍标签 ---------- */

  function applyLabels() {
    var skip = $(".skip-link");
    if (skip) skip.textContent = ui.skip;

    var navEl = $(".nav-links");
    if (navEl) navEl.setAttribute("aria-label", ui.navLabel);

    if (langToggle) {
      langToggle.textContent = ui.langButton;
      langToggle.setAttribute("aria-label", ui.langToggle);
      langToggle.title = ui.langToggle;
    }

    if (themeToggle) themeToggle.setAttribute("aria-label", ui.themeToggle);
    if (backTop) backTop.setAttribute("aria-label", ui.backTop);
    if (carouselEl) carouselEl.setAttribute("aria-label", ui.carousel);

    var prevBtn = $("#carouselPrev");
    var nextBtn = $("#carouselNext");
    if (prevBtn) prevBtn.setAttribute("aria-label", ui.prev);
    if (nextBtn) nextBtn.setAttribute("aria-label", ui.next);

    if (menuToggle) {
      var open = navLinks && navLinks.classList.contains("open");
      menuToggle.setAttribute("aria-label", open ? ui.closeMenu : ui.openMenu);
    }
  }

  /* ---------- 滚动渐显 ---------- */

  var revealObserver = null;

  function observeReveal() {
    var targets = $$("[data-reveal]").filter(function (el) {
      return !el.classList.contains("in");
    });

    if (!targets.length) return;

    if (revealObserver) revealObserver.disconnect();

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }

    revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- 主题 ---------- */

  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  var themeMeta = $('meta[name="theme-color"]');

  function setTheme(theme, persist) {
    root.dataset.theme = theme;
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0a0c09" : "#f4f2ea");
    if (persist) storage.setItem(THEME_KEY, theme);
  }

  function initialTheme() {
    var saved = storage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    var pref = data.theme && data.theme.default;
    if (pref === "light" || pref === "dark") return pref;
    return prefersDark.matches ? "dark" : "light";
  }

  /* ---------- 导航交互 ---------- */

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (backTop) backTop.classList.toggle("show", y > 420);
  }

  function closeMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", ui.openMenu);
  }

  function initNav() {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if ("IntersectionObserver" in window) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting || !navLinks) return;
            var id = "#" + entry.target.id;
            $$("a", navLinks).forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );

      $$("main section[id]").forEach(function (s) {
        spy.observe(s);
      });
    }

    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        menuToggle.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? ui.closeMenu : ui.openMenu);
      });
    }

    if (navLinks) {
      navLinks.addEventListener("click", function (e) {
        if (e.target.closest("a")) closeMenu();
      });
    }

    document.addEventListener("click", function (e) {
      if (!navLinks || !navLinks.classList.contains("open")) return;
      if (header && !header.contains(e.target)) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  /* ---------- 一次完整渲染 ---------- */

  function renderSite() {
    applyMeta();
    renderNav();
    renderHero();
    renderAbout();
    renderGames();
    renderMoments();
    renderGallery();
    renderFooter();
    applyLabels();
    observeReveal();
  }

  /* ---------- 语言切换 ---------- */

  var langSwitching = false;

  function setLang(next) {
    if (SUPPORTED.indexOf(next) === -1) return;
    lang = next;
    storage.setItem(LANG_KEY, next);
    resolveLang();
    renderSite();
    closeMenu();
  }

  if (langToggle) {
    langToggle.addEventListener("click", function (e) {
      e.preventDefault();
      if (langSwitching) return;
      langSwitching = true;
      var current = root.lang.toLowerCase().indexOf("en") === 0 ? "en" : "zh";
      setLang(current === "zh" ? "en" : "zh");
      window.setTimeout(function () {
        langSwitching = false;
      }, 0);
    });
  }

  /* ---------- 启动 ---------- */

  setTheme(initialTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
  }

  function onSchemeChange(e) {
    if (!storage.getItem(THEME_KEY)) setTheme(e.matches ? "dark" : "light", false);
  }
  if (typeof prefersDark.addEventListener === "function") {
    prefersDark.addEventListener("change", onSchemeChange);
  } else if (typeof prefersDark.addListener === "function") {
    prefersDark.addListener(onSchemeChange);
  }

  renderSite();
  initNav();

  /* 图片加载完再兜底一次：视口内的渐显元素立刻显示 */
  window.addEventListener("load", function () {
    $$("[data-reveal]").forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add("in");
    });
  });
})();
