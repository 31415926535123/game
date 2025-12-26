/**
 * 快捷键提示更新器
 * 负责在工具按钮上显示快捷键提示
 */

import { shortcutsConfig } from "../config/toolsConfig.js";

/**
 * 更新所有工具按钮的快捷键提示
 */
export function updateShortcutHints() {
  for (const [toolId, key] of Object.entries(shortcutsConfig)) {
    const button = document.getElementById(toolId);
    if (button) {
      // 更新title属性
      const title = button.getAttribute("title") || "";
      const cleanTitle = title.replace(/ \([A-Z]\)$/, ""); // 移除可能已存在的快捷键提示
      button.setAttribute("title", `${cleanTitle} (${key.toUpperCase()})`);
    }
  }
}
