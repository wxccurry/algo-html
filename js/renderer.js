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
    if (!this.canvas) return;
    this._monoFont = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim() || 'monospace';
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this._resizeHandler = () => this.resize();
    window.addEventListener('resize', this._resizeHandler);
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
    if (arr.length === 0) return;
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
        ctx.font = `${Math.min(11, barWidth * 0.7)}px ${this._monoFont}`;
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
      ctx.font = `500 ${cardW * 0.4}px ${this._monoFont}`;
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
