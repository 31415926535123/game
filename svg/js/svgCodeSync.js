// SVG代码同步模块 - 处理SVG画布与代码编辑区的双向同步

// 代码区与SVG画布同步功能
export function initCodeSync(svgCanvas, svgCode, loadBtn) {
  // SVG画布内容同步到代码编辑区
  function syncSvgToCode() {
    svgCode.value = svgCanvas.innerHTML;
  }

  // 从代码编辑区加载内容到SVG画布
  function loadFromCode() {
    try {
      svgCanvas.innerHTML = svgCode.value;
    } catch (error) {
      console.error("Failed to load SVG from code:", error);
    }
  }

  // 初始化代码编辑区
  syncSvgToCode();

  // 加载按钮事件监听
  loadBtn.addEventListener("click", loadFromCode);

  // 返回同步函数供外部调用
  return {
    syncSvgToCode,
  };
}
