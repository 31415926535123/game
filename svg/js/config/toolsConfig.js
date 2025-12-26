/**
 * 统一工具配置文件 - JSON 适配器
 * 使用内联 JSON 数据，避免网络请求和异步问题
 */

// 内联配置数据，避免网络请求和异步问题
const configData = {
  tools: [
    {
      id: "selectTool",
      title: "选择工具",
      shortcut: "s",
      icon: '<path d="M12 20l-8-8 8-8 8 8-8 8z" />\n           <path d="M8 12h8" />\n           <path d="M12 8v8" />',
    },
    {
      id: "rectTool",
      title: "矩形工具",
      shortcut: "r",
      icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />',
    },
    {
      id: "circleTool",
      title: "圆形工具",
      shortcut: "c",
      icon: '<circle cx="12" cy="12" r="10" />',
    },
    {
      id: "ellipseTool",
      title: "椭圆工具",
      shortcut: "e",
      icon: '<ellipse cx="12" cy="12" rx="8" ry="5" />',
    },
    {
      id: "lineTool",
      title: "直线工具",
      shortcut: "l",
      icon: '<line x1="1" y1="1" x2="23" y2="23" />',
    },
    {
      id: "polylineTool",
      title: "折线工具",
      shortcut: "p",
      icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />',
    },
    {
      id: "polygonTool",
      title: "多边形工具",
      shortcut: "g",
      icon: '<polygon points="12 2 2 7 12 12 22 7 12 2" />\n           <polygon points="2 17 12 22 22 17" />\n           <polygon points="2 12 12 17 22 12" />',
    },
    {
      id: "pathTool",
      title: "路径工具",
      shortcut: "t",
      icon: '<path d="M15 5H3v14h12" />\n           <path d="M15 5l6 6-6 6" />\n           <path d="M21 11v2" />',
    },
  ],
  shortcuts: {
    selectTool: "s",
    rectTool: "r",
    circleTool: "c",
    ellipseTool: "e",
    lineTool: "l",
    polylineTool: "p",
    polygonTool: "g",
    pathTool: "t",
  },
};

// 保持相同的 API 接口
export const toolsConfig = configData.tools;
export const shortcutsConfig = configData.shortcuts;

/**
 * 根据工具ID获取工具配置
 * @param {string} toolId - 工具ID
 * @returns {Object|null} - 工具配置对象
 */
export function getToolConfig(toolId) {
  return toolsConfig.find((tool) => tool.id === toolId) || null;
}

/**
 * 获取所有工具配置
 * 保持向后兼容性，为现有代码提供相同的接口
 */
export function getToolsConfig() {
  return toolsConfig;
}
