// 统一颜色管理器 - 处理所有颜色相关功能
// 遵循Linus的设计哲学：消除特殊情况，统一数据结构，简洁为王

// 颜色状态 - 核心数据结构
const colorState = {
  drawing: "#F1A3DF", // 绘图颜色
  background: "#999999", // 背景颜色
};

// 获取颜色 - 简洁，有默认值，避免边界情况
export function getColor(type = "drawing") {
  return colorState[type];
}

// 设置颜色 - 类型安全，状态持久化，事件通知
export function setColor(type, color) {
  if (!colorState.hasOwnProperty(type)) {
    throw new Error(`Invalid color type: ${type}`);
  }

  colorState[type] = color;
  localStorage.setItem(`color_${type}`, color);

  document.dispatchEvent(
    new CustomEvent("colorChanged", {
      detail: { type, color },
    })
  );
}

// 初始化颜色管理器 - 核心入口点
export function initColorManager() {
  // 从localStorage加载保存的颜色
  for (const type of Object.keys(colorState)) {
    const savedColor = localStorage.getItem(`color_${type}`);
    if (savedColor) {
      colorState[type] = savedColor;
    }
  }

  return { getColor, setColor };
}
