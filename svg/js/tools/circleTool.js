// 圆形工具类
import { SvgToolBase } from "./svgToolBase.js";

export class CircleTool extends SvgToolBase {
  constructor(svgCanvas, colorProvider) {
    super(svgCanvas, colorProvider);
    this.startX = 0;
    this.startY = 0;
    this.isFirstClick = true; // 标记是否是第一次点击
  }

  handleClick(x, y) {
    if (this.isFirstClick) {
      // 第一次点击，设置圆心
      this.startDrawing(x, y);
      this.isFirstClick = false;
    } else {
      // 第二次点击，设置圆上的点并完成绘制
      this.finishDrawing(x, y);
      this.isFirstClick = true;
    }
  }

  startDrawing(x, y) {
    this.startX = x;
    this.startY = y;
    this.currentElement = this.createSvgElement("circle");
    this.currentElement.setAttribute("cx", x);
    this.currentElement.setAttribute("cy", y);
    this.currentElement.setAttribute("r", 0);
    this.applyCommonStyles(this.currentElement);
    this.addToCanvas(this.currentElement);
  }

  updateDrawing(currentX, currentY) {
    if (!this.currentElement) return;

    const radius = Math.sqrt(
      Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2)
    );
    this.currentElement.setAttribute("r", radius);
  }

  // 结束绘制的方法
  finishDrawing(endX, endY) {
    if (!this.currentElement) return;

    const radius = Math.sqrt(
      Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
    );
    this.currentElement.setAttribute("r", radius);

    this.currentElement = null;
  }

  // 重置工具特定状态
  resetToolState() {
    this.isFirstClick = true;
  }
}
