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
    compare: 4, swap: 5, init: 2, sorted: 6, done: 8,
  },
  selection: {
    init: 2, scan: 4, 'new-min': 5, swap: 9, sorted: 9, done: 11,
  },
  insertion: {
    init: 2, pick: 3, shift: 6, insert: 9, done: 11,
  },
  quick: {
    init: 1, pivot: 10, 'compare-pivot': 13, swap: 15, 'pivot-place': 18, done: 19,
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
