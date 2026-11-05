# 钟唐恒玙 · 玩家档案

一个纯静态的个人主页：不用构建、不用后端、不用框架，双击 `index.html` 就能打开。
**所有内容都集中在 `data.js` 里**，改文字不用碰 HTML / CSS。

线上地址：<https://lsc-91-69.github.io/zhongtanghengyu/>

---

## 文件结构

```
index.html   页面骨架
style.css    样式与配色令牌
data.js      ★ 内容都写在这里 ★
script.js    渲染与交互
avatar.jpg   首屏头像
images/      游戏截图、图集
_preview/    本地截图（不参与发布）
```

## 一、改内容

打开 `data.js`，改引号里的文字即可，保存后刷新浏览器。

| 想改什么 | 改哪里 |
| --- | --- |
| 姓名、英文名 | `profile.name` / `profile.latin` |
| 学校、年级 | `profile.school` / `profile.grade` |
| 首屏那句话 | `profile.tagline` |
| 首屏按钮 | `profile.actions` |
| 导航菜单 | `nav` 数组 |
| 关于我的段落 | `about.paragraphs` |
| 右侧四格信息 | `about.facts` |
| 在玩的游戏 | `games.items` |
| 高光时刻 | `moments.items` |
| 图集 | `gallery.items` |
| 浏览器标签页标题 | `meta.title` |
| 英文版 | 文件底部的 `en` |

### 加一张游戏截图

把图放进 `images/`，然后在 `games.items` 里加一项：

```js
{
  name: "游戏名",
  note: "一句话描述",
  tags: ["标签"],
  img: "images/your-shot.jpg",
  alt: "图片说明（读屏软件会读）",
},
```

### 加一张图集照片

```js
{ src: "images/gallery-10.jpg", alt: "图片说明" },
```

超宽的截图（比如游戏库截图）加 `fit: "contain"`，整张图会完整显示，
空白处用同一张图的模糊版补满：

```js
{ src: "images/gallery-6.jpg", alt: "游戏库", fit: "contain" },
```

### 换头像

把图片放进这个文件夹，然后：

```js
avatar: "avatar.jpg",
```

也可以直接填 emoji，例如 `avatar: "🐊"`。

> 注意：文字里如果要用英文双引号 `"`，请写成 `\"` 或改用中文引号 `“”`，
> 否则会破坏 JS 语法。改完看不到内容时按 F12 看 Console。

## 二、本地预览

直接双击 `index.html`。想要更接近线上环境：

```powershell
python -m http.server 8000
```

然后打开 <http://localhost:8000>。

## 三、线上部署

已经部署在 GitHub Pages，仓库：`Lsc-91-69/zhongtanghengyu`。

改完内容后推送：

```powershell
git add .
git commit -m "更新内容"
git push
```

推送后一两分钟，<https://lsc-91-69.github.io/zhongtanghengyu/> 会自动更新。

> 这台机器的 git 走 OpenSSL 的 TLS 后端（已执行过
> `git config --global http.sslBackend openssl`）。换一台机器 push 报
> `schannel: SEC_E_NO_CREDENTIALS` 时，先执行这条命令再推。

## 四、一些说明

- 配色令牌在 `style.css` 顶部的 `:root`，亮色主题在 `[data-theme="light"]`。
- 右上角可以切亮色 / 暗色，选择会记在浏览器里。
- 右上角 `EN` 切英文，内容写在 `data.js` 的 `en` 里。
- 页面已适配手机，并遵循系统的「减少动态效果」设置。
- 没有外部字体和 CDN，国内打开也快。
