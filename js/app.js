const App = {
  currentAlgo: null,
  currentMode: 'visualize', // 'visualize' | 'step' | 'code'
  steps: [],

  init() {
    Renderer.init();
    Controls.init();
    CodeDisplay.init();
    StepDisplay.init();

    initSidebar((algo) => this.selectAlgorithm(algo));

    // Mode toggle buttons
    document.querySelectorAll('.mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (Controls.isPlaying) return;
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

    codePanel.classList.add('hidden');
    stepPanel.classList.add('hidden');

    if (mode === 'step') {
      stepPanel.classList.remove('hidden');
    } else if (mode === 'code') {
      codePanel.classList.remove('hidden');
    }

    // Re-render current step after layout change
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
