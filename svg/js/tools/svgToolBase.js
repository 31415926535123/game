// SVG工具基类 - 提取所有工具类的共同属性和方法
export class SvgToolBase {
  constructor(svgCanvas, colorProvider) {
    this.svgCanvas = svgCanvas;
    this.colorProvider = colorProvider || (() => "#000000");
    this.currentElement = null;
  }

  // 创建SVG元素的通用方法
  createSvgElement(tagName) {
    return document.createElementNS("http://www.w3.org/2000/svg", tagName);
  }

  // 应用通用样式的通用方法
  applyCommonStyles(element) {
    if (!element) return;

    element.setAttribute("stroke", this.colorProvider());
    element.setAttribute("stroke-width", 2);
    element.setAttribute("fill", "none");
  }

  // 将元素添加到画布的通用方法
  addToCanvas(element) {
    if (element && this.svgCanvas) {
      this.svgCanvas.appendChild(element);
    }
  }

  // 从画布移除元素的通用方法
  removeFromCanvas(element) {
    if (element && this.svgCanvas && element.parentNode === this.svgCanvas) {
      this.svgCanvas.removeChild(element);
    }
  }

  // 取消当前绘制的通用方法
  cancelDrawing() {
    if (this.currentElement) {
      this.removeFromCanvas(this.currentElement);
      this.currentElement = null;
    }

    // 重置工具特定的状态
    this.resetToolState();
  }

  // 子类需要实现的方法
  handleClick(x, y) {
    throw new Error("子类必须实现 handleClick 方法");
  }

  startDrawing(x, y) {
    throw new Error("子类必须实现 startDrawing 方法");
  }

  updateDrawing(currentX, currentY) {
    throw new Error("子类必须实现 updateDrawing 方法");
  }

  finishDrawing(endX, endY) {
    throw new Error("子类必须实现 finishDrawing 方法");
  }

  // 子类可以重写此方法来重置特定状态
  resetToolState() {
    // 默认实现为空，子类可以重写
  }
}
