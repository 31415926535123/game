// 椭圆工具类
import { SvgToolBase } from "./svgToolBase.js";

export class EllipseTool extends SvgToolBase {
  constructor(svgCanvas, colorProvider) {
    super(svgCanvas, colorProvider);
    this.startX = 0;
    this.startY = 0;
    this.isFirstClick = true; // 标记是否是第一次点击
  }

  handleClick(x, y) {
    if (this.isFirstClick) {
      // 第一次点击，设置椭圆中心
      this.startDrawing(x, y);
      this.isFirstClick = false;
    } else {
      // 第二次点击，设置椭圆边缘点并完成绘制
      this.finishDrawing(x, y);
      this.isFirstClick = true;
    }
  }

  startDrawing(x, y) {
    // 创建新的椭圆元素
    this.currentElement = this.createSvgElement("ellipse");

    // 设置初始属性
    this.startX = x;
    this.startY = y;
    this.currentElement.setAttribute("cx", x);
    this.currentElement.setAttribute("cy", y);
    this.currentElement.setAttribute("rx", 0);
    this.currentElement.setAttribute("ry", 0);
    this.applyCommonStyles(this.currentElement);
    this.addToCanvas(this.currentElement);
  }

  updateDrawing(currentX, currentY) {
    if (!this.currentElement) return;

    // 计算x轴和y轴半径
    const rx = Math.abs(currentX - this.startX);
    const ry = Math.abs(currentY - this.startY);

    // 更新椭圆属性
    this.currentElement.setAttribute("cx", this.startX);
    this.currentElement.setAttribute("cy", this.startY);
    this.currentElement.setAttribute("rx", rx);
    this.currentElement.setAttribute("ry", ry);
  }

  // 结束绘制的方法
  finishDrawing(endX, endY) {
    if (!this.currentElement) return;

    // 计算x轴和y轴半径
    const rx = Math.abs(endX - this.startX);
    const ry = Math.abs(endY - this.startY);

    // 更新椭圆属性
    this.currentElement.setAttribute("cx", this.startX);
    this.currentElement.setAttribute("cy", this.startY);
    this.currentElement.setAttribute("rx", rx);
    this.currentElement.setAttribute("ry", ry);

    this.currentElement = null;
  }

  // 重置工具特定状态
  resetToolState() {
    this.isFirstClick = true;
  }
}
