# Algorithm Learning Web — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure HTML/CSS/JS algorithm learning platform with Dark Editorial aesthetic, 3 interaction modes, and 5 MVP algorithms.

**Architecture:** Single index.html loads 7 CSS files and 7 JS files. Sidebar + main content layout. App holds current algorithm/mode state. Algorithms are pure data operations returning step snapshots. Renderer draws steps to Canvas via requestAnimationFrame.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES6+), Canvas API, Google Fonts CDN

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Entry point, semantic structure |
| `css/base.css` | CSS variables, reset, font imports, shared utilities |
| `css/layout.css` | Sidebar + main content grid |
| `css/sidebar.css` | Navigation list, selected state, hover effects |
| `css/controls.css` | Buttons, sliders, control bar |
| `css/visualizer.css` | Canvas container, breathing glow, description text |
| `css/code-panel.css` | Code block styling, syntax highlighting, line highlight |
| `css/step-panel.css` | Step description panel, data state snapshot |
| `js/algorithms.js` | 5 algorithm implementations returning step arrays |
| `js/sidebar.js` | Navigation click handling, active state |
| `js/renderer.js` | Canvas bar chart drawing, animation loop |
| `js/controls.js` | Play/pause/step/speed/size/reset logic |
| `js/code-display.js` | Code template injection, current-line highlighting |
| `js/step-display.js` | Step text + data state rendering |
| `js/app.js` | Entry point, state management, mode switching, wiring |

---

### Task 1: Project Scaffold & Base Styles

**Files:**
- Create: `index.html`
- Create: `css/base.css`
- Create: `css/layout.css`

- [ ] **Step 1: Create index.html with full semantic structure**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Algorithm Visualizer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/sidebar.css">
  <link rel="stylesheet" href="css/controls.css">
  <link rel="stylesheet" href="css/visualizer.css">
  <link rel="stylesheet" href="css/code-panel.css">
  <link rel="stylesheet" href="css/step-panel.css">
</head>
<body>
  <aside id="sidebar">
    <div class="sidebar-header">
      <h1 class="logo">Algo<span class="accent">Viz</span></h1>
    </div>
    <nav id="algo-nav">
      <ul id="algo-list"></ul>
    </nav>
    <div class="sidebar-footer">
      <button id="settings-btn" class="settings-trigger">Settings</button>
    </div>
  </aside>
  <main id="main-content">
    <div id="top-bar">
      <h2 id="algo-title"></h2>
      <div id="mode-toggle" class="mode-toggle">
        <button data-mode="visualize" class="mode-btn active">Visualize</button>
        <button data-mode="step" class="mode-btn">Step Through</button>
        <button data-mode="code" class="mode-btn">Code + Visual</button>
      </div>
    </div>
    <div id="content-area">
      <div id="visualizer-container">
        <canvas id="visualizer-canvas"></canvas>
        <p id="step-description"></p>
      </div>
      <div id="code-panel" class="hidden">
        <pre><code id="code-block"></code></pre>
      </div>
      <div id="step-panel" class="hidden">
        <div id="step-info"></div>
        <div id="data-snapshot"></div>
      </div>
    </div>
    <div id="control-bar">
      <button id="btn-reset" class="ctrl-btn" title="Reset">Reset</button>
      <button id="btn-step-back" class="ctrl-btn" title="Step Back">Prev</button>
      <button id="btn-play" class="ctrl-btn primary" title="Play/Pause">Play</button>
      <button id="btn-step-forward" class="ctrl-btn" title="Step Forward">Next</button>
      <div class="speed-control">
        <label for="speed-slider">Speed</label>
        <input type="range" id="speed-slider" min="0.5" max="3" step="0.5" value="1">
        <span id="speed-label">1x</span>
      </div>
      <div class="size-control">
        <label for="size-slider">Size</label>
        <input type="range" id="size-slider" min="5" max="50" value="20">
        <span id="size-label">20</span>
      </div>
    </div>
  </main>
  <script src="js/algorithms.js"></script>
  <script src="js/sidebar.js"></script>
  <script src="js/renderer.js"></script>
  <script src="js/controls.js"></script>
  <script src="js/code-display.js"></script>
  <script src="js/step-display.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create css/base.css — variables, reset, fonts**

```css
:root {
  --bg-primary: #0A0A0F;
  --bg-card: #12121C;
  --bg-hover: #1A1A2E;
  --accent: #FF6B35;
  --success: #2DD4BF;
  --text-primary: #EBE9F5;
  --text-secondary: #6B6880;
  --border: #222235;

  --font-display: "DM Serif Display", Georgia, serif;
  --font-body: "DM Sans", -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  --sidebar-width: 240px;
  --control-height: 64px;
  --topbar-height: 56px;
  --radius: 6px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;
  overflow: hidden;
}

h1, h2, h3 { font-family: var(--font-display); }

code, pre {
  font-family: var(--font-mono);
  font-size: 13px;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
}

ul { list-style: none; }

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
}
```

- [ ] **Step 3: Create css/layout.css — sidebar + main grid**

```css
body {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 1fr;
}

#sidebar {
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px 0;
}

#main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

#top-bar {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
}

#content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

#visualizer-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
}

#code-panel,
#step-panel {
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  overflow-y: auto;
}

#code-panel { width: 50%; }
#step-panel { width: 30%; }

.hidden { display: none !important; }

#control-bar {
  height: var(--control-height);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 32px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}
```

- [ ] **Step 4: Verify scaffold in browser**

Open `index.html` in Chrome/Edge. Should see dark layout with sidebar on left, content area with top bar and control bar. Canvas is empty. Sidebar algorithm list is empty. No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html css/base.css css/layout.css
git commit -m "feat: add project scaffold with base styles and layout grid"
```

---

### Task 2: Sidebar Navigation

**Files:**
- Create: `css/sidebar.css`
- Create: `js/sidebar.js`

- [ ] **Step 1: Create css/sidebar.css**

```css
.sidebar-header {
  padding: 0 24px 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
}

.logo {
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.5px;
}

.logo .accent {
  color: var(--accent);
  font-style: italic;
}

#algo-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

#algo-list li { }

#algo-list li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-left: 2px solid transparent;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

#algo-list li a:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

#algo-list li a.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: rgba(255, 107, 53, 0.06);
}

#algo-list li a .algo-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

#algo-list li a .algo-difficulty {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: auto;
  opacity: 0.5;
}

.sidebar-footer {
  padding: 16px 24px 0;
  border-top: 1px solid var(--border);
  margin-top: 8px;
}

.settings-trigger {
  color: var(--text-secondary);
  font-size: 13px;
  padding: 6px 12px;
  border-radius: var(--radius);
  transition: color 0.2s, background 0.2s;
}

.settings-trigger:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}
```

- [ ] **Step 2: Create js/sidebar.js**

```javascript
const ALGORITHMS = [
  { id: 'bubble', name: 'Bubble Sort', nameCN: '冒泡排序', icon: '🫧', difficulty: 'beginner' },
  { id: 'selection', name: 'Selection Sort', nameCN: '选择排序', icon: '🔍', difficulty: 'beginner' },
  { id: 'insertion', name: 'Insertion Sort', nameCN: '插入排序', icon: '📌', difficulty: 'beginner' },
  { id: 'quick', name: 'Quick Sort', nameCN: '快速排序', icon: '⚡', difficulty: 'advanced' },
  { id: 'binary-search', name: 'Binary Search', nameCN: '二分查找', icon: '🎯', difficulty: 'beginner' },
];

function initSidebar(onSelect) {
  const list = document.getElementById('algo-list');
  const items = ALGORITHMS.map((algo) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.dataset.algoId = algo.id;
    a.innerHTML = `
      <span class="algo-icon">${algo.icon}</span>
      <span>${algo.nameCN}</span>
      <span class="algo-difficulty">${algo.difficulty === 'advanced' ? '进阶' : '入门'}</span>
    `;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('#algo-list a').forEach(el => el.classList.remove('active'));
      a.classList.add('active');
      onSelect(algo);
    });
    li.appendChild(a);
    return li;
  });
  items.forEach(li => list.appendChild(li));
  return ALGORITHMS;
}
```

- [ ] **Step 3: Verify sidebar renders in browser**

Open `index.html`. Sidebar should show 5 algorithm entries with icons and difficulty badges. Clicking an entry highlights it in orange with left border accent. No errors.

- [ ] **Step 4: Commit**

```bash
git add css/sidebar.css js/sidebar.js
git commit -m "feat: add sidebar navigation with algorithm list"
```

---

### Task 3: Algorithm Implementations

**Files:**
- Create: `js/algorithms.js`

- [ ] **Step 1: Create js/algorithms.js with all 5 algorithms**

```javascript
// Each algorithm returns an array of step objects.
// A step is an array snapshot + metadata for rendering.

function clone(arr) {
  return arr.slice();
}

// --- Bubble Sort ---
function bubbleSortSteps(inputArr) {
  const arr = clone(inputArr);
  const steps = [];
  const n = arr.length;
  steps.push({ type: 'init', array: clone(arr), description: `开始冒泡排序，共 ${n} 个元素` });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({
        type: 'compare',
        array: clone(arr),
        indices: [j, j + 1],
        sortedRange: [n - i, n],
        description: `比较索引 ${j} (值 ${arr[j]}) 和索引 ${j + 1} (值 ${arr[j + 1]})`,
      });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          type: 'swap',
          array: clone(arr),
          indices: [j, j + 1],
          sortedRange: [n - i, n],
          description: `交换 — ${arr[j + 1]} 和 ${arr[j]}`,
        });
      }
    }
    steps.push({
      type: 'sorted',
      array: clone(arr),
      indices: [n - 1 - i],
      sortedRange: [n - 1 - i, n],
      description: `索引 ${n - 1 - i} 已归位 (值 ${arr[n - 1 - i]})`,
    });
  }
  steps.push({ type: 'done', array: clone(arr), description: '排序完成！' });
  return steps;
}

// --- Selection Sort ---
function selectionSortSteps(inputArr) {
  const arr = clone(inputArr);
  const steps = [];
  const n = arr.length;
  steps.push({ type: 'init', array: clone(arr), description: `开始选择排序，共 ${n} 个元素` });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({ type: 'scan-start', array: clone(arr), current: i, description: `从索引 ${i} 开始扫描未排序区间` });
    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'scan',
        array: clone(arr),
        current: i,
        scanning: j,
        minIdx,
        sortedRange: [0, i],
        description: `扫描索引 ${j} (值 ${arr[j]})，当前最小值在索引 ${minIdx} (值 ${arr[minIdx]})`,
      });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          type: 'new-min',
          array: clone(arr),
          current: i,
          scanning: j,
          minIdx,
          sortedRange: [0, i],
          description: `找到更小值 ${arr[minIdx]} 在索引 ${minIdx}`,
        });
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        type: 'swap',
        array: clone(arr),
        indices: [i, minIdx],
        current: i,
        sortedRange: [0, i + 1],
        description: `交换索引 ${i} (值 ${arr[i]}) 和索引 ${minIdx} (值 ${arr[minIdx]})`,
      });
    }
    steps.push({ type: 'sorted', array: clone(arr), sortedRange: [0, i + 1], description: `索引 ${i} 已归位` });
  }
  steps.push({ type: 'done', array: clone(arr), description: '排序完成！' });
  return steps;
}

// --- Insertion Sort ---
function insertionSortSteps(inputArr) {
  const arr = clone(inputArr);
  const steps = [];
  const n = arr.length;
  steps.push({ type: 'init', array: clone(arr), description: `开始插入排序，共 ${n} 个元素` });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push({
      type: 'pick',
      array: clone(arr),
      keyIdx: i,
      sortedRange: [0, i],
      description: `取出索引 ${i} 的元素 ${key}，准备插入已排序区间 [0, ${i - 1}]`,
    });
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push({
        type: 'shift',
        array: clone(arr),
        keyIdx: j + 1,
        shiftingFrom: j,
        sortedRange: [0, i + 1],
        description: `${arr[j]} > ${key}，将索引 ${j} 的元素右移到索引 ${j + 1}`,
      });
      j--;
    }
    arr[j + 1] = key;
    steps.push({
      type: 'insert',
      array: clone(arr),
      keyIdx: j + 1,
      sortedRange: [0, i + 1],
      description: `将 ${key} 插入到索引 ${j + 1}`,
    });
  }
  steps.push({ type: 'done', array: clone(arr), description: '排序完成！' });
  return steps;
}

// --- Quick Sort ---
function quickSortSteps(inputArr) {
  const arr = clone(inputArr);
  const steps = [];
  let depth = 0;

  steps.push({ type: 'init', array: clone(arr), description: `开始快速排序，共 ${arr.length} 个元素` });

  function partition(low, high) {
    const pivot = arr[high];
    steps.push({
      type: 'pivot',
      array: clone(arr),
      pivotIdx: high,
      range: [low, high],
      depth,
      description: `选择基准值 ${pivot} (索引 ${high})，对区间 [${low}, ${high}] 分区`,
    });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare-pivot',
        array: clone(arr),
        pivotIdx: high,
        scanning: j,
        range: [low, high],
        depth,
        description: `比较索引 ${j} (值 ${arr[j]}) 与基准 ${pivot}`,
      });
      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            type: 'swap',
            array: clone(arr),
            indices: [i, j],
            pivotIdx: high,
            range: [low, high],
            depth,
            description: `${arr[j]} < ${pivot}，交换索引 ${i} 和 ${j}`,
          });
        }
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      type: 'pivot-place',
      array: clone(arr),
      pivotIdx: i + 1,
      range: [low, high],
      depth,
      description: `基准 ${pivot} 归位到索引 ${i + 1}`,
    });
    return i + 1;
  }

  function quickSort(low, high) {
    if (low < high) {
      depth++;
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
      depth--;
    }
  }

  quickSort(0, arr.length - 1);
  steps.push({ type: 'done', array: clone(arr), description: '排序完成！' });
  return steps;
}

// --- Binary Search ---
function binarySearchSteps(inputArr, target) {
  const sorted = clone(inputArr).sort((a, b) => a - b);
  const steps = [];
  steps.push({
    type: 'init',
    array: clone(sorted),
    description: `在有序数组中二分查找目标值 ${target}`,
  });

  let left = 0;
  let right = sorted.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({
      type: 'mid',
      array: clone(sorted),
      left, right, mid,
      description: `搜索区间 [${left}, ${right}]，中间索引 ${mid} (值 ${sorted[mid]})`,
    });
    if (sorted[mid] === target) {
      steps.push({
        type: 'found',
        array: clone(sorted),
        left, right, mid,
        description: `在索引 ${mid} 找到目标值 ${target}！`,
      });
      return steps;
    } else if (sorted[mid] < target) {
      left = mid + 1;
      steps.push({
        type: 'go-right',
        array: clone(sorted),
        left, right, mid,
        description: `${sorted[mid]} < ${target}，搜索右半区间 [${left}, ${right}]`,
      });
    } else {
      right = mid - 1;
      steps.push({
        type: 'go-left',
        array: clone(sorted),
        left, right, mid,
        description: `${sorted[mid]} > ${target}，搜索左半区间 [${left}, ${right}]`,
      });
    }
  }
  steps.push({ type: 'not-found', array: clone(sorted), description: `目标值 ${target} 不在数组中` });
  return steps;
}
```

- [ ] **Step 2: Verify algorithms in console**

Open `index.html` in browser, open DevTools console:

```javascript
// Test: generate random array and run an algorithm
const testArr = [5, 3, 8, 1, 2, 7, 4, 6];
const steps = bubbleSortSteps(testArr);
console.log(`Bubble sort produced ${steps.length} steps`);
console.log('Final array:', steps[steps.length - 1].array);
```

Expected: 30+ steps logged, final array is `[1,2,3,4,5,6,7,8]`.

- [ ] **Step 3: Commit**

```bash
git add js/algorithms.js
git commit -m "feat: add 5 algorithm implementations with step-by-step snapshots"
```

---

### Task 4: Canvas Renderer

**Files:**
- Create: `js/renderer.js`
- Create: `css/visualizer.css`

- [ ] **Step 1: Create css/visualizer.css**

```css
#visualizer-canvas {
  max-width: 100%;
  max-height: 100%;
  border-radius: var(--radius);
}

#step-description {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 16px;
  min-height: 24px;
  text-align: center;
  transition: color 0.3s;
}

@keyframes breathe {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.15); }
  50% { box-shadow: 0 0 0 6px rgba(255, 107, 53, 0); }
}

#visualizer-container.playing #visualizer-canvas {
  animation: breathe 2s ease-in-out infinite;
}
```

- [ ] **Step 2: Create js/renderer.js — bar chart rendering**

```javascript
const BAR_COLORS = {
  default: '#EBE9F5',
  comparing: '#FF6B35',
  swapping: '#FF6B35',
  sorted: '#2DD4BF',
  pivot: '#FF6B35',
  scanning: 'rgba(255, 107, 53, 0.35)',
  key: '#F59E0B',
  range: 'rgba(255, 107, 53, 0.08)',
};

const Renderer = {
  canvas: null,
  ctx: null,
  barGap: 4,

  init() {
    this.canvas = document.getElementById('visualizer-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    const container = document.getElementById('visualizer-container');
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth - 48;
    const h = container.clientHeight - 80;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  draw(step, algorithmId) {
    const { ctx, canvas } = this;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);

    if (algorithmId === 'binary-search') {
      this._drawBinarySearch(step, w, h);
    } else {
      this._drawBars(step, w, h, algorithmId);
    }
  },

  _drawBars(step, w, h, algoId) {
    const { ctx } = this;
    const arr = step.array;
    const n = arr.length;
    const maxVal = Math.max(...arr, 1);
    const barWidth = Math.max(6, (w - (n - 1) * this.barGap) / n);
    const totalWidth = barWidth * n + this.barGap * (n - 1);
    const startX = (w - totalWidth) / 2;
    const baseY = h - 40;

    arr.forEach((val, i) => {
      const barH = (val / maxVal) * (baseY - 40);
      const x = startX + i * (barWidth + this.barGap);
      const y = baseY - barH;

      let color = BAR_COLORS.default;

      // Sorted range
      if (step.sortedRange && i >= step.sortedRange[0] && i < step.sortedRange[1]) {
        color = BAR_COLORS.sorted;
      }

      // Pivot
      if (step.pivotIdx === i) {
        color = BAR_COLORS.pivot;
      }

      // Comparing/swapping indices
      if (step.indices && step.indices.includes(i)) {
        color = BAR_COLORS.comparing;
      }

      // Scanning
      if (step.scanning === i) {
        color = BAR_COLORS.scanning;
      }

      // Key element (insertion sort)
      if (step.keyIdx === i) {
        color = BAR_COLORS.key;
      }

      // Range highlight
      if (step.range && i >= step.range[0] && i <= step.range[1]) {
        ctx.fillStyle = BAR_COLORS.range;
        const rangeW = barWidth + this.barGap;
        ctx.fillRect(x - this.barGap / 2, 0, rangeW, baseY);
      }

      // Depth indicator for quick sort
      if (step.depth !== undefined && step.range && (i >= step.range[0] && i <= step.range[1])) {
        ctx.strokeStyle = `rgba(255, 107, 53, ${0.1 + step.depth * 0.1})`;
        ctx.lineWidth = 1 + step.depth;
        ctx.strokeRect(x - this.barGap / 2, 0, barWidth + this.barGap, baseY);
      }

      ctx.fillStyle = color;
      this._roundRect(x, y, barWidth, barH, 2);
      ctx.fill();

      // Value label
      if (barWidth > 16) {
        ctx.fillStyle = 'rgba(235, 233, 245, 0.5)';
        ctx.font = `${Math.min(11, barWidth * 0.7)}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-mono')}`;
        ctx.textAlign = 'center';
        ctx.fillText(val, x + barWidth / 2, y - 6);
      }
    });
  },

  _drawBinarySearch(step, w, h) {
    const { ctx } = this;
    const arr = step.array;
    const n = arr.length;
    const cardW = Math.min(48, (w - (n - 1) * 8) / n);
    const totalW = cardW * n + 8 * (n - 1);
    const startX = (w - totalW) / 2;
    const y = h / 2 - cardW / 2;

    arr.forEach((val, i) => {
      const x = startX + i * (cardW + 8);
      let bg = 'rgba(30, 30, 54, 0.8)';
      let border = '#222235';

      if (i === step.mid) { bg = 'rgba(255, 107, 53, 0.25)'; border = '#FF6B35'; }
      if (i === step.left) border = '#2DD4BF';
      if (i === step.right) border = '#2DD4BF';
      if (step.type === 'found' && i === step.mid) { bg = 'rgba(45, 212, 191, 0.2)'; border = '#2DD4BF'; }

      ctx.fillStyle = bg;
      this._roundRect(x, y, cardW, cardW, 4);
      ctx.fill();

      ctx.strokeStyle = border;
      ctx.lineWidth = 1.5;
      this._roundRect(x, y, cardW, cardW, 4);
      ctx.stroke();

      ctx.fillStyle = '#EBE9F5';
      ctx.font = `500 ${cardW * 0.4}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-mono')}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(val, x + cardW / 2, y + cardW / 2);
    });

    // Range indicator
    if (step.left !== undefined && step.right !== undefined) {
      const leftX = startX + step.left * (cardW + 8);
      const rightX = startX + step.right * (cardW + 8) + cardW;
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(leftX - 4, y - 8, rightX - leftX + 8, cardW + 16);
      ctx.setLineDash([]);
    }
  },

  _roundRect(x, y, w, h, r) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },
};
```

- [ ] **Step 3: Verify renderer draws bars**

Open browser console after page loads:

```javascript
Renderer.init();
Renderer.draw({ type: 'init', array: [5,3,8,1,2,7,4,6] }, 'bubble');
```

Expected: Canvas shows 8 bars of proportional height, no highlight colors.

- [ ] **Step 4: Commit**

```bash
git add js/renderer.js css/visualizer.css
git commit -m "feat: add Canvas renderer with bar chart and binary search card views"
```

---

### Task 5: Controls

**Files:**
- Create: `css/controls.css`
- Create: `js/controls.js`

- [ ] **Step 1: Create css/controls.css**

```css
#control-bar { gap: 16px; }

.ctrl-btn {
  padding: 8px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border);
  transition: all 0.2s;
}

.ctrl-btn:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
  border-color: var(--text-secondary);
}

.ctrl-btn.primary {
  color: var(--bg-primary);
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 600;
}

.ctrl-btn.primary:hover {
  filter: brightness(1.1);
  transform: scale(1.03);
}

.ctrl-btn:disabled {
  opacity: 0.3;
  pointer-events: none;
}

.speed-control,
.size-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.speed-control label,
.size-control label {
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.speed-control input,
.size-control input {
  width: 80px;
}

.speed-control span,
.size-control span {
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font-mono);
  min-width: 30px;
}

.mode-toggle {
  display: flex;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
}

.mode-btn {
  padding: 6px 16px;
  font-size: 13px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.mode-btn:hover {
  color: var(--text-primary);
}

.mode-btn.active {
  color: var(--accent);
  background: rgba(255, 107, 53, 0.1);
}
```

- [ ] **Step 2: Create js/controls.js**

```javascript
const Controls = {
  state: 'stopped', // 'playing' | 'paused' | 'stopped'
  speed: 1,
  dataSize: 20,
  currentStep: 0,
  steps: [],
  animFrame: null,
  lastFrameTime: 0,
  onStepChange: null,
  onReset: null,
  algorithmId: null,

  init() {
    this.btnPlay = document.getElementById('btn-play');
    this.btnReset = document.getElementById('btn-reset');
    this.btnStepBack = document.getElementById('btn-step-back');
    this.btnStepForward = document.getElementById('btn-step-forward');
    this.speedSlider = document.getElementById('speed-slider');
    this.speedLabel = document.getElementById('speed-label');
    this.sizeSlider = document.getElementById('size-slider');
    this.sizeLabel = document.getElementById('size-label');

    this.btnPlay.addEventListener('click', () => this.togglePlay());
    this.btnReset.addEventListener('click', () => this.reset());
    this.btnStepBack.addEventListener('click', () => this.stepBack());
    this.btnStepForward.addEventListener('click', () => this.stepForward());
    this.speedSlider.addEventListener('input', (e) => {
      this.speed = parseFloat(e.target.value);
      this.speedLabel.textContent = this.speed + 'x';
    });
    this.sizeSlider.addEventListener('input', (e) => {
      this.dataSize = parseInt(e.target.value);
      this.sizeLabel.textContent = this.dataSize;
    });
    this.sizeSlider.addEventListener('change', () => {
      if (this.onReset) this.onReset(this.dataSize);
    });
  },

  loadSteps(steps, algoId) {
    this.stop();
    this.steps = steps;
    this.currentStep = 0;
    this.algorithmId = algoId;
    this._updateButtons();
    if (this.onStepChange) this.onStepChange(steps[0], 0);
  },

  togglePlay() {
    if (this.state === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  },

  play() {
    if (this.currentStep >= this.steps.length - 1) {
      this.currentStep = 0;
    }
    this.state = 'playing';
    this.btnPlay.textContent = 'Pause';
    this.btnPlay.classList.add('primary');
    this.lastFrameTime = performance.now();
    this._animate(performance.now());
    document.getElementById('visualizer-container').classList.add('playing');
  },

  pause() {
    this.state = 'paused';
    this.btnPlay.textContent = 'Play';
    this.btnPlay.classList.add('primary');
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    document.getElementById('visualizer-container').classList.remove('playing');
  },

  stop() {
    this.state = 'stopped';
    this.btnPlay.textContent = 'Play';
    this.btnPlay.classList.add('primary');
    this.currentStep = 0;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    document.getElementById('visualizer-container').classList.remove('playing');
  },

  reset() {
    this.stop();
    if (this.onReset) this.onReset(this.dataSize);
  },

  stepForward() {
    this.pause();
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      if (this.onStepChange) this.onStepChange(this.steps[this.currentStep], this.currentStep);
    }
    this._updateButtons();
  },

  stepBack() {
    this.pause();
    if (this.currentStep > 0) {
      this.currentStep--;
      if (this.onStepChange) this.onStepChange(this.steps[this.currentStep], this.currentStep);
    }
    this._updateButtons();
  },

  _animate(timestamp) {
    if (this.state !== 'playing') return;
    const interval = 1000 / (this.speed * 4); // 4 steps/sec at 1x
    if (timestamp - this.lastFrameTime >= interval) {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        if (this.onStepChange) this.onStepChange(this.steps[this.currentStep], this.currentStep);
        this.lastFrameTime = timestamp;
      } else {
        this.pause();
        return;
      }
    }
    this.animFrame = requestAnimationFrame((t) => this._animate(t));
  },

  _updateButtons() {
    this.btnStepBack.disabled = this.currentStep <= 0;
    this.btnStepForward.disabled = this.currentStep >= this.steps.length - 1;
  },

  disableDuringAnimation(enabled) {
    // Called by app to disable algo switching during animation
  },
};
```

- [ ] **Step 3: Verify controls interactivity**

Open browser console, test:

```javascript
Controls.init();
Controls.loadSteps(bubbleSortSteps([5,3,8,1,2,7,4,6]), 'bubble');
// Click Play — should cycle through steps
// Click Pause — should stop
// Drag speed slider — should update label
```

- [ ] **Step 4: Commit**

```bash
git add css/controls.css js/controls.js
git commit -m "feat: add playback controls with speed and data size sliders"
```

---

### Task 6: Code Display

**Files:**
- Create: `css/code-panel.css`
- Create: `js/code-display.js`

- [ ] **Step 1: Create js/code-display.js — code templates**

```javascript
const CODE_TEMPLATES = {
  bubble: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,

  selection: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,

  insertion: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,

  quick: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,

  'binary-search': `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
};

const LINE_MAP = {
  bubble: {
    compare: 3, swap: 4, init: 2, sorted: 6, done: 8,
  },
  selection: {
    init: 2, scan: 4, 'new-min': 5, swap: 7, sorted: 9, done: 10,
  },
  insertion: {
    init: 2, pick: 3, shift: 7, insert: 9, done: 11,
  },
  quick: {
    init: 1, pivot: 11, 'compare-pivot': 13, swap: 15, 'pivot-place': 17, done: 19,
  },
  'binary-search': {
    init: 1, mid: 4, found: 5, 'go-right': 6, 'go-left': 7, 'not-found': 9,
  },
};

const CodeDisplay = {
  codeBlock: null,

  init() {
    this.codeBlock = document.getElementById('code-block');
  },

  show(algoId) {
    const code = CODE_TEMPLATES[algoId];
    if (!code) return;
    this.codeBlock.innerHTML = this._highlight(code);
  },

  highlightLine(algoId, stepType) {
    const map = LINE_MAP[algoId];
    if (!map || map[stepType] === undefined) return;
    const lineIdx = map[stepType];
    const lines = this.codeBlock.querySelectorAll('.code-line');
    lines.forEach((l) => l.classList.remove('highlighted'));
    if (lines[lineIdx]) {
      lines[lineIdx].classList.add('highlighted');
    }
  },

  _highlight(code) {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const lines = escaped.split('\n');
    return lines.map((line, i) => {
      let html = line
        .replace(/\b(function|const|let|for|while|if|else|return|break)\b/g, '<span class="kw">$1</span>')
        .replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="fn">$1</span>(')
        .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
      return `<span class="code-line" data-line="${i}">${html}</span>`;
    }).join('\n');
  },
};
```

- [ ] **Step 2: Create css/code-panel.css**

```css
#code-panel {
  padding: 24px;
}

#code-block {
  display: block;
  line-height: 1.8;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 13px;
  counter-reset: line;
  white-space: pre-wrap;
  word-break: break-all;
}

#code-block .code-line {
  display: block;
  padding: 0 12px;
  border-left: 2px solid transparent;
  transition: background 0.15s, border-color 0.15s;
  border-radius: 0 3px 3px 0;
}

#code-block .code-line.highlighted {
  background: rgba(255, 107, 53, 0.1);
  border-left-color: var(--accent);
}

.code-line .kw { color: #FF6B35; }
.code-line .fn { color: #2DD4BF; }
.code-line .num { color: #F59E0B; }
```

- [ ] **Step 3: Verify code display**

Browser console:

```javascript
CodeDisplay.init();
CodeDisplay.show('bubble');
// Code panel should show bubble sort JS with orange keywords
CodeDisplay.highlightLine('bubble', 'compare');
// Line 3 should highlight with orange left border
```

- [ ] **Step 4: Commit**

```bash
git add css/code-panel.css js/code-display.js
git commit -m "feat: add code display with syntax highlighting and line mapping"
```

---

### Task 7: Step Display Panel

**Files:**
- Create: `css/step-panel.css`
- Create: `js/step-display.js`

- [ ] **Step 1: Create js/step-display.js**

```javascript
const StepDisplay = {
  stepInfo: null,
  dataSnapshot: null,

  init() {
    this.stepInfo = document.getElementById('step-info');
    this.dataSnapshot = document.getElementById('data-snapshot');
  },

  show(step) {
    this.stepInfo.innerHTML = `
      <div class="step-type">${this._typeLabel(step.type)}</div>
      <p class="step-desc">${step.description}</p>
    `;

    let dataHtml = '<div class="snapshot-array">';
    step.array.forEach((val, i) => {
      let cls = 'snapshot-item';
      if (step.indices && step.indices.includes(i)) cls += ' highlight';
      if (step.sortedRange && i >= step.sortedRange[0] && i < step.sortedRange[1]) cls += ' sorted';
      if (step.pivotIdx === i) cls += ' pivot';
      if (step.keyIdx === i) cls += ' key';
      dataHtml += `<span class="${cls}">${val}</span>`;
    });
    dataHtml += '</div>';
    this.dataSnapshot.innerHTML = dataHtml;
  },

  _typeLabel(type) {
    const map = {
      init: '初始', compare: '比较', swap: '交换', sorted: '归位',
      scan: '扫描', 'scan-start': '开始扫描', 'new-min': '新最小值',
      pick: '取出', shift: '右移', insert: '插入',
      pivot: '选基准', 'compare-pivot': '比较基准', 'pivot-place': '基准归位',
      mid: '中间值', found: '找到', 'go-right': '向右', 'go-left': '向左',
      'not-found': '未找到', done: '完成',
    };
    return map[type] || type;
  },
};
```

- [ ] **Step 2: Create css/step-panel.css**

```css
#step-panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-type {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent);
  margin-bottom: 8px;
}

.step-desc {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.7;
}

.snapshot-array {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.snapshot-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background: rgba(30, 30, 54, 0.8);
  border: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.snapshot-item.highlight {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(255, 107, 53, 0.15);
}

.snapshot-item.sorted {
  border-color: var(--success);
  color: var(--success);
  background: rgba(45, 212, 191, 0.1);
}

.snapshot-item.pivot {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.3);
}

.snapshot-item.key {
  border-color: #F59E0B;
  color: #F59E0B;
}
```

- [ ] **Step 3: Verify step display**

Browser console:

```javascript
StepDisplay.init();
const steps = bubbleSortSteps([5,3,8,1]);
StepDisplay.show(steps[3]);
// Step panel shows current step type, description, and data array with highlights
```

- [ ] **Step 4: Commit**

```bash
git add css/step-panel.css js/step-display.js
git commit -m "feat: add step display panel with data snapshot and type labels"
```

---

### Task 8: App Integration & Mode Switching

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: Create js/app.js — main application wiring**

```javascript
const App = {
  currentAlgo: null,
  currentMode: 'visualize', // 'visualize' | 'step' | 'code'
  steps: [],
  isAnimating: false,

  init() {
    Renderer.init();
    Controls.init();
    CodeDisplay.init();
    StepDisplay.init();

    initSidebar((algo) => this.selectAlgorithm(algo));

    // Mode toggle buttons
    document.querySelectorAll('.mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.isAnimating) return;
        this.setMode(btn.dataset.mode);
      });
    });

    // Wire controls events
    Controls.onStepChange = (step, idx) => this.onStep(step, idx);
    Controls.onReset = (size) => this.generateData(size);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        Controls.togglePlay();
      } else if (e.key === 'ArrowRight') {
        Controls.stepForward();
      } else if (e.key === 'ArrowLeft') {
        Controls.stepBack();
      } else if (e.key === 'r' || e.key === 'R') {
        Controls.reset();
      }
    });

    // Select first algorithm by default
    const firstLink = document.querySelector('#algo-list a');
    if (firstLink) firstLink.click();
  },

  selectAlgorithm(algo) {
    document.getElementById('algo-title').textContent = algo.nameCN;
    document.title = `${algo.nameCN} — AlgoViz`;
    this.currentAlgo = algo;
    this.generateData(Controls.dataSize);
  },

  generateData(size) {
    if (!this.currentAlgo) return;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    let steps;

    switch (this.currentAlgo.id) {
      case 'bubble': steps = bubbleSortSteps(arr); break;
      case 'selection': steps = selectionSortSteps(arr); break;
      case 'insertion': steps = insertionSortSteps(arr); break;
      case 'quick': steps = quickSortSteps(arr); break;
      case 'binary-search': {
        const target = arr[Math.floor(Math.random() * arr.length)];
        steps = binarySearchSteps(arr, target);
        break;
      }
      default: return;
    }

    this.steps = steps;
    Controls.loadSteps(steps, this.currentAlgo.id);
    CodeDisplay.show(this.currentAlgo.id);
    this.onStep(steps[0], 0);
  },

  setMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    const codePanel = document.getElementById('code-panel');
    const stepPanel = document.getElementById('step-panel');
    const vizContainer = document.getElementById('visualizer-container');

    codePanel.classList.add('hidden');
    stepPanel.classList.add('hidden');

    if (mode === 'visualize') {
      // Only canvas, full width
    } else if (mode === 'step') {
      stepPanel.classList.remove('hidden');
    } else if (mode === 'code') {
      codePanel.classList.remove('hidden');
    }

    // Re-render current step
    setTimeout(() => {
      Renderer.resize();
      const step = this.steps[Controls.currentStep];
      if (step) this.onStep(step, Controls.currentStep);
    }, 50);
  },

  onStep(step, idx) {
    Renderer.draw(step, this.currentAlgo ? this.currentAlgo.id : 'bubble');
    document.getElementById('step-description').textContent = step.description;

    if (this.currentMode === 'code' || this.currentMode === 'step') {
      CodeDisplay.highlightLine(this.currentAlgo.id, step.type);
    }

    if (this.currentMode === 'step') {
      StepDisplay.show(step);
    }

    Controls.currentStep = idx;
    Controls._updateButtons();
  },
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
```

- [ ] **Step 2: Wire algorithm switching disable during animation**

Add to `js/app.js` inside `onStep()`:

```javascript
// After Controls.currentStep = idx:
if (this.steps.length > 0 && idx >= this.steps.length - 1) {
  this.isAnimating = false;
}
```

Add to `Controls.togglePlay()` and `Controls.play()`:

```javascript
// At the start of play():
App.isAnimating = true;

// In pause() and stop():
App.isAnimating = false;
```

Update sidebar click handler in `js/sidebar.js` inside the event listener:

```javascript
a.addEventListener('click', (e) => {
  e.preventDefault();
  if (App.isAnimating) return;
  // ... rest
});
```

- [ ] **Step 3: Verify full integration**

Open `index.html` in browser:
1. Sidebar shows 5 algorithms, first one auto-selected
2. Canvas renders bar chart
3. Click Play → animation runs, breathing glow appears
4. Switch to "Step Through" mode → step panel appears on right
5. Click Next → advances one step, step panel updates
6. Switch to "Code + Visual" → code panel appears on right
7. Press Space → play/pause, Arrow keys → step
8. Click another algorithm in sidebar → switches, new data generated
9. Adjust data size slider → resets with new data

- [ ] **Step 4: Commit**

```bash
git add js/app.js
git commit -m "feat: wire app integration with mode switching and keyboard shortcuts"
```

---

### Task 9: Visual Polish & Transitions

**Files:**
- Modify: `css/base.css`
- Modify: `css/layout.css`
- Modify: `css/sidebar.css`

- [ ] **Step 1: Add page load stagger animation to css/base.css**

```css
/* Append to base.css */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

#sidebar { animation: fadeInUp 0.5s ease-out both; }
#main-content { animation: fadeInUp 0.5s 0.1s ease-out both; }
```

- [ ] **Step 2: Add content area transition to css/layout.css**

```css
/* Append to layout.css */
#content-area > * {
  transition: opacity 0.3s ease;
}

#content-area > .hidden {
  opacity: 0;
  pointer-events: none;
}

#content-area > :not(.hidden) {
  opacity: 1;
}
```

- [ ] **Step 3: Add sidebar hover indicator to css/sidebar.css**

```css
/* Append to sidebar.css */
#algo-list li a::before {
  content: '→';
  position: absolute;
  left: 8px;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s;
  color: var(--accent);
}

#algo-list li a {
  position: relative;
}

#algo-list li a:hover::before {
  opacity: 1;
  transform: translateX(0);
}
```

- [ ] **Step 4: Verify polish**

Open browser, reload page:
1. Sidebar and main content fade in on load with stagger
2. Hover over sidebar items — orange arrow slides in from left
3. Mode switching has smooth opacity transition

- [ ] **Step 5: Commit**

```bash
git add css/base.css css/layout.css css/sidebar.css
git commit -m "feat: add visual polish — load stagger, hover arrows, mode transitions"
```

---

## Summary

| Task | Files Created | Purpose |
|------|--------------|---------|
| 1 | `index.html`, `base.css`, `layout.css` | Scaffold + grid |
| 2 | `sidebar.css`, `sidebar.js` | Algorithm navigation |
| 3 | `algorithms.js` | 5 algorithms, pure data |
| 4 | `renderer.js`, `visualizer.css` | Canvas drawing engine |
| 5 | `controls.css`, `controls.js` | Playback controls |
| 6 | `code-panel.css`, `code-display.js` | Code + syntax highlight |
| 7 | `step-panel.css`, `step-display.js` | Step-by-step panel |
| 8 | `app.js` | Integration + modes |
| 9 | (modify 3 CSS files) | Polish + animations |

**9 tasks, 15 files total.** Each task produces working, testable output.
