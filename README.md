# AlgoViz — 算法可视化学习平台

一个纯 HTML/CSS/JS 的算法学习工具，通过可视化动画、分步讲解、代码并排三种模式帮助理解经典算法。

## 快速开始

直接在浏览器中打开 `index.html` 即可使用，零依赖，无需构建。

## 功能

- **5 种算法** — 冒泡排序、选择排序、插入排序、快速排序、二分查找
- **3 种交互模式**
  - **可视化动画** — Canvas 动画自动播放，直观看到数据移动
  - **分步讲解** — 手动控制每一步，右侧面板显示代码行高亮和数据状态
  - **代码 + 可视化并排** — 左边看源码，右边看动画同步演示
- **播放控制** — 播放/暂停、上一步/下一步、速度调节（0.5x ~ 3x）、数据规模（5 ~ 50）
- **键盘快捷键** — 空格（播放/暂停）、← →（步进）、R（重置）
- **深色编辑室美学** — DM Serif Display + DM Sans + JetBrains Mono 字体

## 技术栈

纯 HTML/CSS/JS，零依赖：
- Canvas API 绘制可视化动画
- CSS Grid + Flexbox 布局
- requestAnimationFrame 驱动动画循环
- Google Fonts CDN 加载字体

## 文件结构

```
index.html          — 入口页面
css/
  base.css          — CSS 变量、重置、字体
  layout.css        — 侧边栏 + 主内容网格
  sidebar.css       — 导航样式
  controls.css      — 控制栏按钮与滑块
  visualizer.css    — Canvas 容器与呼吸动画
  code-panel.css    — 代码块样式与语法高亮
  step-panel.css    — 分步讲解面板
js/
  algorithms.js     — 5 种算法实现，返回步骤快照
  sidebar.js        — 侧边栏导航
  renderer.js       — Canvas 绘制引擎
  controls.js       — 播放控制状态机
  code-display.js   — 代码模板注入与行高亮
  step-display.js   — 步骤数据状态展示
  app.js            — 主控制器，模式切换与模块集成
```

## 浏览器支持

Chrome / Edge / Firefox 最新两版
