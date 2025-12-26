/**
 * 简洁主题管理器
 * 遵循Linus风格：简单、实用、无边界情况
 */

// 主题状态 - 单一数据源
let currentTheme = "light";

// 应用主题 - 无条件分支，直接应用
const applyTheme = (theme) => {
  currentTheme = theme;
  document.body.className =
    theme === "dark"
      ? "flex h-screen flex-1 gap-5 text-gray-300 bg-gray-900"
      : "flex h-screen flex-1 gap-5 text-gray-900";

  // 更新所有需要主题感知的元素
  updateThemeAwareElements(theme);
};

// 更新主题感知元素 - 批量处理，避免特殊情况
const updateThemeAwareElements = (theme) => {
  const isDark = theme === "dark";

  // 工具按钮
  document.querySelectorAll("#toolsContainer button").forEach((btn) => {
    btn.className = isDark
      ? "w-12 h-12 flex items-center justify-center border border-gray-600 rounded transition-all hover:bg-gray-700"
      : "w-12 h-12 flex items-center justify-center border border-gray-300 rounded transition-all hover:bg-gray-200";
  });

  // 颜色选择器容器
  const colorContainer = document.querySelector(".p-3.rounded-lg");
  if (colorContainer) {
    colorContainer.className = isDark
      ? "p-3 rounded-lg shadow-md bg-gray-800"
      : "p-3 rounded-lg shadow-md";
  }

  // 代码区
  const svgCode = document.getElementById("svgCode");
  if (svgCode) {
    svgCode.className = isDark
      ? "w-full h-full min-h-[400px] px-3 py-2 border border-blue-300 bg-gray-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs resize-none overflow-auto hidden"
      : "w-full h-full min-h-[400px] px-3 py-2 border border-blue-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs resize-none overflow-auto hidden";
  }

  // 代码区按钮
  const toggleCodeBtn = document.getElementById("toggleCodeBtn");
  if (toggleCodeBtn) {
    toggleCodeBtn.className = isDark
      ? "w-12 h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-md"
      : "w-12 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md";
  }
};

// 切换主题 - 最简单的逻辑
const toggleTheme = () => {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
};

// 初始化主题管理器
const initThemeManager = () => {
  // 创建主题切换按钮
  const themeToggle = document.createElement("button");
  themeToggle.id = "themeToggle";
  themeToggle.className =
    "w-10 h-10 flex items-center justify-center border border-gray-300 rounded transition-all hover:bg-gray-200 mb-2";
  themeToggle.title = "切换主题";

  // 创建图标
  const themeIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  themeIcon.id = "themeIcon";
  themeIcon.setAttribute("class", "w-4 h-4");
  themeIcon.setAttribute("viewBox", "0 0 24 24");
  themeIcon.setAttribute("fill", "none");
  themeIcon.setAttribute("stroke", "currentColor");
  themeIcon.setAttribute("stroke-width", "2");
  themeIcon.setAttribute("stroke-linecap", "round");
  themeIcon.setAttribute("stroke-linejoin", "round");

  // 设置初始图标
  themeIcon.innerHTML =
    '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

  themeToggle.appendChild(themeIcon);

  // 添加点击事件
  themeToggle.addEventListener("click", () => {
    toggleTheme();
    // 更新图标
    themeIcon.innerHTML =
      currentTheme === "dark"
        ? '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

    // 更新按钮样式
    themeToggle.className =
      currentTheme === "dark"
        ? "w-10 h-10 flex items-center justify-center border border-gray-600 rounded transition-all hover:bg-gray-700 mb-2"
        : "w-10 h-10 flex items-center justify-center border border-gray-300 rounded transition-all hover:bg-gray-200 mb-2";
  });

  // 将按钮添加到工具栏
  const toolsContainer = document.getElementById("toolsContainer");
  if (toolsContainer && toolsContainer.parentNode) {
    toolsContainer.parentNode.insertBefore(themeToggle, toolsContainer);
  }

  // 应用初始主题
  applyTheme(currentTheme);
};

// 导出函数供其他模块使用
export { initThemeManager, toggleTheme, applyTheme };
