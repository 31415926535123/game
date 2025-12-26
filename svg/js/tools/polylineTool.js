// 折线工具类
import { SvgToolBase } from "./svgToolBase.js";

export class PolylineTool extends SvgToolBase {
  constructor(svgCanvas, colorProvider) {
    super(svgCanvas, colorProvider);
    this.points = [];
  }

  startDrawing(x, y) {
    // 创建新的折线元素
    this.currentElement = this.createSvgElement("polyline");
    this.points = [[x, y]];

    // 设置初始属性
    this.updatePoints();
    this.applyCommonStyles(this.currentElement);
    this.addToCanvas(this.currentElement);
  }

  updateDrawing(currentX, currentY) {
    // 更新最后一个点的位置，实现动态绘制效果
    if (this.points.length > 0) {
      this.points[this.points.length - 1] = [currentX, currentY];
      this.updatePoints();
    }
  }

  // 更新点集的方法
  updatePoints() {
    this.currentElement.setAttribute(
      "points",
      this.points.map((p) => `${p[0]},${p[1]}`).join(" ")
    );
  }

  // 添加新顶点的方法
  addPoint(x, y) {
    this.points.push([x, y]);
    this.updatePoints();
  }

  // 结束绘制的方法
  finishDrawing() {
    this.currentElement = null;
    this.points = [];
  }

  // 重置工具特定状态
  resetToolState() {
    this.points = [];
  }
}
