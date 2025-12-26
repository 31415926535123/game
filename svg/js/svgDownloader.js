/**
 * SVG下载功能
 * 获取SVG代码并下载为SVG文件
 */
export function downloadSVG() {
  // 获取SVG代码文本区域
  const svgCode = document.getElementById("svgCode");

  if (!svgCode) {
    console.error("找不到SVG代码文本区域");
    return;
  }

  // 获取SVG代码内容
  const svgContent = svgCode.value;

  // 如果没有内容，提示用户
  if (!svgContent.trim()) {
    alert("没有可下载的SVG内容");
    return;
  }

  // 创建完整的SVG文档
  const fullSvg = `<svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 400 400" 
  >${svgContent}</svg>`;

  // 创建Blob对象
  const blob = new Blob([fullSvg], { type: "image/svg+xml" });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "drawing.svg";

  // 触发下载
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
