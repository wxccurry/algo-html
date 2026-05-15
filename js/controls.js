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
