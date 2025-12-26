// 直线工具类
import { SvgToolBase } from "./svgToolBase.js";

export class LineTool extends SvgToolBase {
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
    this.currentElement = this.createSvgElement("line");
    this.currentElement.setAttribute("x1", x);
    this.currentElement.setAttribute("y1", y);
    this.currentElement.setAttribute("x2", x);
    this.currentElement.setAttribute("y2", y);
    this.applyCommonStyles(this.currentElement);
    this.addToCanvas(this.currentElement);
  }

  updateDrawing(currentX, currentY) {
    if (!this.currentElement) return;

    this.currentElement.setAttribute("x2", currentX);
    this.currentElement.setAttribute("y2", currentY);
  }

  // 结束绘制的方法
  finishDrawing(endX, endY) {
    if (!this.currentElement) return;

    this.currentElement.setAttribute("x2", endX);
    this.currentElement.setAttribute("y2", endY);

    this.currentElement = null;
  }

  // 重置工具特定状态
  resetToolState() {
    this.isFirstClick = true;
  }
}
