/* ============================================================
 *  网站内容配置
 *  改这个文件就能改整站内容，不用碰 HTML / CSS
 *  详细说明见 README.md
 * ============================================================ */

const siteData = {
  /* ---------- 1. 站点信息（浏览器标签页 / 分享预览） ---------- */
  meta: {
    title: "钟唐恒玙 · 玩家档案",
    description:
      "钟唐恒玙（Kevin），重庆枫叶国际学校 10 年级学生。爱玩游戏，把打过的关卡和存下来的截图都留在这里。",
    lang: "zh-CN",
  },

  /* ---------- 2. 主题 ---------- */
  theme: {
    default: "dark", // "auto" 跟随系统 / "light" 亮色 / "dark" 暗色
  },

  /* ---------- 3. 首屏 ---------- */
  profile: {
    name: "钟唐恒玙",
    latin: "Kevin", // 英文名，显示在名字下方那一行
    school: "重庆枫叶国际学校",
    grade: "10 年级",
    eyebrow: "玩家档案",
    avatar: "avatar.jpg", // 也可以直接填 emoji，例如 "🐊"
    status: "在线",
    tagline: "课表之外，时间基本都花在艾尔登法环和怪物猎人的地图里。",
    actions: [
      { label: "在玩什么", href: "#games", style: "primary" },
      { label: "关于我", href: "#about", style: "ghost" },
    ],
  },

  /* ---------- 4. 导航 ---------- */
  nav: [
    { label: "关于", href: "#about" },
    { label: "游戏", href: "#games" },
    { label: "高光", href: "#moments" },
    { label: "图集", href: "#gallery" },
  ],

  /* ---------- 5. 关于我 ---------- */
  about: {
    eyebrow: "ABOUT",
    title: "关于我",
    paragraphs: [
      "我在重庆枫叶国际学校读 10 年级。学校的课用英文上，下课换成中文，一天切好几轮，已经习惯了。",
      "游戏是我花时间最多的事。喜欢能自己研究打法的类型：配装、跑图、试路线，慢慢磨到顺手为止。",
      "除了打，我也爱把好看的画面存下来。下面这些图，基本都是自己打的或者收的。",
    ],
    facts: [
      { k: "学校", v: "重庆枫叶国际学校" },
      { k: "年级", v: "10 年级" },
      { k: "城市", v: "重庆" },
      { k: "在玩", v: "怪物猎人 · 艾尔登法环" },
    ],
  },

  /* ---------- 6. 游戏档案 ---------- */
  games: {
    eyebrow: "PLAYING",
    title: "在玩什么",
    subtitle: "截图都是自己打的。",
    items: [
      {
        name: "怪物猎人：世界 冰原",
        note: "配装、素材、一场一场地狩猎。动作游戏里最耐玩的一档，一局半小时起步。",
        tags: ["动作", "共斗"],
        img: "images/gallery-2.jpg",
        alt: "怪物猎人：世界 冰原 的任务结算画面",
        size: "wide",
      },
      {
        name: "艾尔登法环",
        note: "开放世界加魂系难度。跑图、掉魂、再来一遍，赢下来的那一刻很值。",
        tags: ["魂系", "开放世界"],
        img: "images/gallery-3.jpg",
        alt: "艾尔登法环的战斗画面",
      },
      {
        name: "崩坏3",
        note: "动作手游里做得最像主机的一档。原画集和过场动画都很耐看。",
        tags: ["动作", "手游"],
        img: "images/gallery-4.jpg",
        alt: "崩坏3 原画集封面",
      },
    ],
  },

  /* ---------- 7. 高光时刻 ---------- */
  moments: {
    eyebrow: "HIGHLIGHTS",
    title: "高光时刻",
    subtitle: "存下来的两张夺冠照。",
    items: [
      {
        year: "2018",
        title: "iG 夺冠",
        desc: "英雄联盟全球总决赛，LPL 的第一座冠军奖杯。",
        img: "images/gallery-8.jpg",
        alt: "2018 英雄联盟全球总决赛 iG 夺冠",
      },
      {
        year: "2021",
        title: "EDG 夺冠",
        desc: "又是全球总决赛，EDG 打满五局拿下。",
        img: "images/gallery-9.jpg",
        alt: "2021 英雄联盟全球总决赛 EDG 夺冠",
      },
    ],
  },

  /* ---------- 8. 图集（轮播） ---------- */
  gallery: {
    eyebrow: "GALLERY",
    title: "图集",
    subtitle: "游戏库、原画集，还有几张好看的画面。",
    items: [
      {
        src: "images/gallery-6.jpg",
        alt: "游戏库收藏一览（一）",
        fit: "contain",
      },
      {
        src: "images/gallery-7.jpg",
        alt: "游戏库收藏一览（二）",
        fit: "contain",
      },
      {
        src: "images/gallery-5.jpg",
        alt: "金色翅膀的动画画面",
      },
      {
        src: "images/gallery-1.jpg",
        alt: "黑白风格的游戏标志",
      },
    ],
  },

  /* ---------- 9. 页脚 ---------- */
  footer: {
    text: "用 HTML 和 CSS 手写，没有框架。",
  },

  /* ---------- 10. 界面文字 ---------- */
  ui: {
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
  },

  /* ---------- 11. 英文版（点右上角 EN 切换） ----------
   * 只写需要翻译的字段，没写的自动沿用中文版。
   */
  en: {
    meta: {
      title: "Kevin · Player Profile",
      description:
        "Kevin, Grade 10 at Maple Leaf International School, Chongqing. Gamer, and a collector of good-looking screenshots.",
      lang: "en",
    },
    profile: {
      name: "Kevin",
      latin: "Zhong Tanghengyu",
      school: "Maple Leaf International School, Chongqing",
      grade: "Grade 10",
      eyebrow: "PLAYER PROFILE",
      status: "Online",
      tagline:
        "Outside class, most of my time goes into the maps of Elden Ring and Monster Hunter.",
      actions: [{ label: "What I play" }, { label: "About me" }],
    },
    nav: [
      { label: "About" },
      { label: "Games" },
      { label: "Highlights" },
      { label: "Gallery" },
    ],
    about: {
      eyebrow: "ABOUT",
      title: "About me",
      paragraphs: [
        "I am in Grade 10 at Maple Leaf International School in Chongqing. Classes run in English, breaks run in Chinese, and I switch back and forth several times a day.",
        "Games take most of my time. I like the kind where you work out the approach yourself: builds, routes, loadouts, slowly grinding until it feels right.",
        "Besides playing, I keep the good-looking frames. Most of the pictures below I took or saved myself.",
      ],
      facts: [
        { k: "School", v: "Maple Leaf International, Chongqing" },
        { k: "Grade", v: "Grade 10" },
        { k: "City", v: "Chongqing" },
        { k: "Playing", v: "Monster Hunter · Elden Ring" },
      ],
    },
    games: {
      eyebrow: "PLAYING",
      title: "What I play",
      subtitle: "Every screenshot here is mine.",
      items: [
        {
          name: "Monster Hunter: World Iceborne",
          note: "Builds, materials, hunt after hunt. One of the most replayable action games there is, and a single run starts at half an hour.",
          tags: ["Action", "Co-op"],
          alt: "Monster Hunter: World Iceborne quest results screen",
        },
        {
          name: "Elden Ring",
          note: "Open world plus Souls difficulty. Run, lose runes, run again. The moment it clicks is worth it.",
          tags: ["Soulslike", "Open world"],
          alt: "Elden Ring combat screenshot",
        },
        {
          name: "Honkai Impact 3rd",
          note: "The closest a mobile action game gets to a console one. The art book and cutscenes hold up.",
          tags: ["Action", "Mobile"],
          alt: "Honkai Impact 3rd art book cover",
        },
      ],
    },
    moments: {
      eyebrow: "HIGHLIGHTS",
      title: "Highlights",
      subtitle: "Two championship photos I kept.",
      items: [
        {
          title: "iG wins Worlds",
          desc: "League of Legends World Championship. LPL's first trophy.",
          alt: "2018 League of Legends World Championship, Invictus Gaming",
        },
        {
          title: "EDG wins Worlds",
          desc: "Worlds again. EDG went the full five games.",
          alt: "2021 League of Legends World Championship, EDG",
        },
      ],
    },
    gallery: {
      eyebrow: "GALLERY",
      title: "Gallery",
      subtitle: "Game library, art book, and a few good-looking frames.",
      items: [
        { alt: "Game library collection (1)" },
        { alt: "Game library collection (2)" },
        { alt: "Golden wings animation still" },
        { alt: "Black and white game logo" },
      ],
    },
    footer: {
      text: "Hand-written HTML and CSS, no framework.",
    },
    ui: {
      navLabel: "Main navigation",
      skip: "Skip to main content",
      themeToggle: "Toggle light / dark",
      langToggle: "切换到中文",
      langButton: "中",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      avatarAlt: "{name}'s avatar",
      backTop: "Back to top",
      carousel: "Gallery",
      prev: "Previous image",
      next: "Next image",
      slide: "Slide {n}: {alt}",
      gradeLabel: "GRADE",
    },
  },
};

// 挂到 window 上，供 script.js 使用
window.siteData = siteData;
