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
