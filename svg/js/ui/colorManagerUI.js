// 颜色管理器UI组件 - 负责所有颜色相关的DOM操作
// 遵循Linus的设计哲学：UI与逻辑分离，职责单一

import { getColor, setColor } from "../colorManager.js";

// 初始化颜色选择器UI - 简化实现，仅保留核心功能
export function initColorPalette() {
  const customColorInput = document.getElementById("customColor");
  if (!customColorInput) return;

  // 初始化颜色输入框的值
  customColorInput.value = getColor("drawing");
  setColor("drawing", customColorInput.value);
  // 监听颜色变化 - 只需要input事件
  customColorInput.addEventListener("input", (e) => {
    setColor("drawing", e.target.value);
  });
}

// 初始化背景板 - 简洁高效，功能集中
export function initBackgroundBoard() {
  const svgCanvas = document.getElementById("svgCanvas");
  const svgCanvasContainer = document.getElementById("svgCanvasContainer");
  const bgColorPicker = document.getElementById("bgColorPicker");

  if (!svgCanvas || !svgCanvasContainer || !bgColorPicker) {
    return; // 防御性编程，避免空指针错误
  }

  // 设置背景色 - 统一处理背景色变更
  function setBackgroundColor(color) {
    svgCanvasContainer.style.backgroundColor = color;
    bgColorPicker.value = color;
    setColor("background", color);
  }

  // 初始化并监听背景颜色变化
  setBackgroundColor(getColor("background"));
  bgColorPicker.addEventListener("input", (e) =>
    setBackgroundColor(e.target.value)
  );
}

// 初始化颜色管理器UI - 统一入口
export function initColorManagerUI() {
  initColorPalette();
  initBackgroundBoard();
}
