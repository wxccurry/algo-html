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
    steps.push({ type: 'scan-start', array: clone(arr), current: i, sortedRange: [0, i], description: `从索引 ${i} 开始扫描未排序区间` });
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
            description: `${arr[i]} < ${pivot}，交换索引 ${i} 和 ${j}`,
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
