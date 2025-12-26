/**
 * 快捷键处理器
 * 负责处理键盘快捷键事件并触发相应的工具按钮点击
 */

import { shortcutsConfig } from "../config/toolsConfig.js";

/**
 * 初始化快捷键绑定
 * @param {Object} toolMappings - 工具映射对象，将按钮ID映射到工具名称
 */
export function initShortcuts() {
  document.addEventListener("keydown", (e) => {
    // 忽略在输入框中的按键
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    // 查找按下的键是否对应某个工具
    for (const [toolId, key] of Object.entries(shortcutsConfig)) {
      if (e.key === key) {
        // 阻止默认行为
        e.preventDefault();

        // 获取对应的工具按钮并触发点击
        const button = document.getElementById(toolId);
        if (button) {
          button.click();
        }
        break;
      }
    }
  });
}

/**
 * 获取工具的快捷键
 * @param {string} toolId - 工具ID
 * @returns {string} - 对应的快捷键，如果没有则返回空字符串
 */
export function getToolShortcut(toolId) {
  return shortcutsConfig[toolId] || "";
}
