/**
 * 工具按钮生成器
 * 负责批量生成所有工具按钮和SVG图标
 */

import { toolsConfig } from "./config/toolsConfig.js";

/**
 * 创建单个工具按钮
 * @param {Object} toolConfig - 工具配置对象
 * @returns {HTMLElement} - 创建的按钮元素
 */
function createToolButton(toolConfig) {
  // 创建按钮元素
  const button = document.createElement("button");
  button.id = toolConfig.id;

  // 检查当前主题并应用相应样式
  const isDarkTheme = document.body.classList.contains("bg-gray-900");
  button.className = isDarkTheme
    ? "w-12 h-12 flex items-center justify-center border border-gray-600 rounded transition-all hover:bg-gray-700 relative"
    : "w-12 h-12 flex items-center justify-center border border-gray-300 rounded transition-all hover:bg-gray-200 relative";

  button.title = toolConfig.title;

  // 创建SVG图标
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "w-5 h-5");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  // 设置SVG内容
  svg.innerHTML = toolConfig.icon;

  // 将SVG添加到按钮
  button.appendChild(svg);

  return button;
}

/**
 * 生成所有工具按钮并添加到指定容器
 * @param {HTMLElement} container - 工具按钮容器元素
 */
function generateToolButtons(container) {
  // 清空容器
  container.innerHTML = "";

  // 为每个工具创建按钮并添加到容器
  toolsConfig.forEach((toolConfig) => {
    const button = createToolButton(toolConfig);
    container.appendChild(button);
  });
}

/**
 * 初始化工具按钮
 * @param {string} containerId - 工具按钮容器的ID
 */
export function initToolButtons(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    generateToolButtons(container);
  } else {
    console.error(`Tool button container with ID "${containerId}" not found.`);
  }
}

/**
 * 获取工具配置数据
 * @returns {Array} - 工具配置数组
 */
export function getToolsConfig() {
  return toolsConfig;
}
