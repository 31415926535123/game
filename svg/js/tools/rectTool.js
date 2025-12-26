// 矩形工具类
import { SvgToolBase } from "./svgToolBase.js";

export class RectTool extends SvgToolBase {
  constructor(svgCanvas, colorProvider) {
    super(svgCanvas, colorProvider);
    this.startX = 0;
    this.startY = 0;
    this.isFirstClick = true; // 标记是否是第一次点击
  }

  handleClick(x, y) {
    if (this.isFirstClick) {
      // 第一次点击，设置起点
      this.startDrawing(x, y);
      this.isFirstClick = false;
    } else {
      // 第二次点击，设置终点并完成绘制
      this.finishDrawing(x, y);
      this.isFirstClick = true;
    }
  }

  startDrawing(x, y) {
    this.startX = x;
    this.startY = y;
    this.currentElement = this.createSvgElement("rect");
    this.currentElement.setAttribute("x", x);
    this.currentElement.setAttribute("y", y);
    this.currentElement.setAttribute("width", 0);
    this.currentElement.setAttribute("height", 0);
    this.applyCommonStyles(this.currentElement);
    this.addToCanvas(this.currentElement);
  }

  updateDrawing(currentX, currentY) {
    if (!this.currentElement) return;

    const width = Math.abs(currentX - this.startX);
    const height = Math.abs(currentY - this.startY);
    const x = Math.min(currentX, this.startX);
    const y = Math.min(currentY, this.startY);

    this.currentElement.setAttribute("x", x);
    this.currentElement.setAttribute("y", y);
    this.currentElement.setAttribute("width", width);
    this.currentElement.setAttribute("height", height);
  }

  // 结束绘制的方法
  finishDrawing(endX, endY) {
    if (!this.currentElement) return;

    const width = Math.abs(endX - this.startX);
    const height = Math.abs(endY - this.startY);
    const x = Math.min(endX, this.startX);
    const y = Math.min(endY, this.startY);

    this.currentElement.setAttribute("x", x);
    this.currentElement.setAttribute("y", y);
    this.currentElement.setAttribute("width", width);
    this.currentElement.setAttribute("height", height);

    this.currentElement = null;
  }

  // 重置工具特定状态
  resetToolState() {
    this.isFirstClick = true;
  }
}
