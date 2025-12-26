// 路径工具类 - 专注于二阶贝塞尔曲线绘制
import { SvgToolBase } from "./svgToolBase.js";

export class PathTool extends SvgToolBase {
  constructor(svgCanvas, colorProvider) {
    super(svgCanvas, colorProvider);
    this.startPoint = null;
    this.controlPoint = null;
    this.endPoint = null;
    this.drawingStage = 0; // 0: 未开始, 1: 已设置起点, 2: 已设置控制点, 3: 已设置终点
    this.helperLine = null; // 辅助线
    this.helperPoints = []; // 辅助点
  }

  startDrawing(x, y) {
    if (this.drawingStage === 0) {
      // 第一阶段：设置起点
      this.startPoint = { x, y };
      this.drawingStage = 1;

      // 创建路径元素
      this.currentElement = this.createSvgElement("path");
      this.currentElement.setAttribute("d", `M ${x} ${y}`);
      this.applyCommonStyles(this.currentElement);
      this.addToCanvas(this.currentElement);

      // 创建起点辅助点
      this.createHelperPoint(x, y, "start");
    } else if (this.drawingStage === 1) {
      // 第二阶段：设置控制点
      this.controlPoint = { x, y };
      this.drawingStage = 2;

      // 创建控制点辅助点
      this.createHelperPoint(x, y, "control");

      // 创建辅助线
      this.createHelperLine();
    } else if (this.drawingStage === 2) {
      // 第三阶段：设置终点
      this.endPoint = { x, y };
      this.drawingStage = 3;

      // 创建终点辅助点
      this.createHelperPoint(x, y, "end");

      // 更新路径
      this.updatePath();

      // 清除辅助元素
      this.clearHelpers();

      // 完成绘制
      this.finishDrawing();
    }
  }

  updateDrawing(currentX, currentY) {
    if (this.drawingStage === 1) {
      // 更新控制点预览位置
      this.controlPoint = { x: currentX, y: currentY };
      this.updatePath();
    } else if (this.drawingStage === 2) {
      // 更新终点预览位置
      this.endPoint = { x: currentX, y: currentY };
      this.updatePath();
      this.updateHelperLine();
    }
  }

  // 更新路径
  updatePath() {
    if (!this.currentElement || !this.startPoint) return;

    let pathData = `M ${this.startPoint.x} ${this.startPoint.y}`;

    if (this.controlPoint) {
      if (this.endPoint) {
        // 有控制点和终点，绘制完整的二次贝塞尔曲线
        pathData += ` Q ${this.controlPoint.x} ${this.controlPoint.y}, ${this.endPoint.x} ${this.endPoint.y}`;
      } else {
        // 只有控制点，绘制从起点到控制点的直线
        pathData += ` L ${this.controlPoint.x} ${this.controlPoint.y}`;
      }
    }

    this.currentElement.setAttribute("d", pathData);
  }

  // 创建辅助线
  createHelperLine() {
    if (this.helperLine) return;

    this.helperLine = this.createSvgElement("line");
    this.helperLine.setAttribute("stroke", "#f1a3df");
    this.helperLine.setAttribute("stroke-width", 2.7);
    this.helperLine.setAttribute("stroke-dasharray", "5,5");
    this.helperLine.setAttribute("opacity", 0.5);
    this.addToCanvas(this.helperLine);

    this.updateHelperLine();
  }

  // 更新辅助线
  updateHelperLine() {
    if (!this.helperLine || !this.controlPoint || !this.endPoint) return;

    this.helperLine.setAttribute("x1", this.controlPoint.x);
    this.helperLine.setAttribute("y1", this.controlPoint.y);
    this.helperLine.setAttribute("x2", this.endPoint.x);
    this.helperLine.setAttribute("y2", this.endPoint.y);
  }

  // 创建辅助点
  createHelperPoint(x, y, type) {
    const point = this.createSvgElement("circle");
    point.setAttribute("cx", x);
    point.setAttribute("cy", y);
    point.setAttribute("r", 4);

    // 根据类型设置颜色
    if (type === "start") {
      point.setAttribute("fill", "#4CAF50"); // 绿色
    } else if (type === "control") {
      point.setAttribute("fill", "#FF9800"); // 橙色
    } else if (type === "end") {
      point.setAttribute("fill", "#2196F3"); // 蓝色
    }

    this.addToCanvas(point);
    this.helperPoints.push(point);
  }

  // 清除辅助元素
  clearHelpers() {
    if (this.helperLine) {
      this.removeFromCanvas(this.helperLine);
      this.helperLine = null;
    }

    this.helperPoints.forEach((point) => {
      this.removeFromCanvas(point);
    });
    this.helperPoints = [];
  }

  // 结束绘制
  finishDrawing() {
    this.currentElement = null;
    this.startPoint = null;
    this.controlPoint = null;
    this.endPoint = null;
    this.drawingStage = 0;
  }

  // 重置工具特定状态
  resetToolState() {
    this.clearHelpers();
    this.finishDrawing();
  }

  // 取消绘制
  cancelDrawing() {
    if (this.currentElement) {
      this.removeFromCanvas(this.currentElement);
    }
    this.resetToolState();
  }
}
