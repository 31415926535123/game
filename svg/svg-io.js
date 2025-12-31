// SVG导入导出功能

/**
 * 导出SVG画布内容为文件
 * @param {SVGSVGElement} svgElement - SVG元素
 * @param {string} filename - 导出的文件名
 */
export function exportSVG(svgElement, filename = "drawing.svg") {
  // 确保是有效的SVG元素
  if (!(svgElement instanceof SVGSVGElement)) {
    throw new Error("Invalid SVG element");
  }

  // 克隆SVG元素以便添加必要的属性
  const svgClone = svgElement.cloneNode(true);

  // 设置默认的SVG命名空间和版本
  if (!svgClone.getAttribute("xmlns")) {
    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  if (!svgClone.getAttribute("version")) {
    svgClone.setAttribute("version", "1.1");
  }

  // 获取SVG的完整XML内容
  const svgData = new XMLSerializer().serializeToString(svgClone);

  // 创建Blob和下载链接
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  // 创建临时下载链接并触发下载
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 释放URL对象
  URL.revokeObjectURL(url);
}

/**
 * 导入SVG文件到画布
 * @param {SVGSVGElement} svgElement - 目标SVG画布元素
 * @param {function} callback - 导入完成后的回调函数
 */
export function importSVG(svgElement, callback) {
  // 确保是有效的SVG元素
  if (!(svgElement instanceof SVGSVGElement)) {
    throw new Error("Invalid SVG element");
  }

  // 创建文件选择输入
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/svg+xml";
  input.style.display = "none";

  // 处理文件选择
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // 读取文件内容
    reader.onload = (event) => {
      try {
        // 创建临时DOM元素来解析SVG
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = event.target.result;

        // 获取解析后的SVG元素
        const importedSVG = tempDiv.querySelector("svg");
        if (!importedSVG) {
          throw new Error("Invalid SVG file");
        }

        // 清空目标SVG画布并导入新内容
        svgElement.innerHTML = "";

        // 复制所有子元素到目标SVG
        while (importedSVG.firstChild) {
          svgElement.appendChild(importedSVG.firstChild);
        }

        // 触发回调
        if (callback) callback(null, svgElement);
      } catch (error) {
        if (callback) callback(error);
      } finally {
        // 清理
        document.body.removeChild(input);
      }
    };

    reader.readAsText(file);
  });

  // 添加到DOM并触发点击
  document.body.appendChild(input);
  input.click();
}
