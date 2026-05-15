const ALGORITHMS = [
  { id: 'bubble', name: 'Bubble Sort', nameCN: '冒泡排序', icon: '🫧', difficulty: 'beginner' },
  { id: 'selection', name: 'Selection Sort', nameCN: '选择排序', icon: '🔍', difficulty: 'beginner' },
  { id: 'insertion', name: 'Insertion Sort', nameCN: '插入排序', icon: '📌', difficulty: 'beginner' },
  { id: 'quick', name: 'Quick Sort', nameCN: '快速排序', icon: '⚡', difficulty: 'advanced' },
  { id: 'binary-search', name: 'Binary Search', nameCN: '二分查找', icon: '🎯', difficulty: 'beginner' },
];

function initSidebar(onSelect) {
  const list = document.getElementById('algo-list');
  if (!list) return;
  const items = ALGORITHMS.map((algo) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.dataset.algoId = algo.id;
    const iconSpan = document.createElement('span');
    iconSpan.className = 'algo-icon';
    iconSpan.textContent = algo.icon;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = algo.nameCN;

    const diffSpan = document.createElement('span');
    diffSpan.className = 'algo-difficulty';
    diffSpan.textContent = algo.difficulty === 'advanced' ? '进阶' : '入门';

    a.appendChild(iconSpan);
    a.appendChild(nameSpan);
    a.appendChild(diffSpan);
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
}
