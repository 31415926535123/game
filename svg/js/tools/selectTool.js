// 选择工具类
import { SvgToolBase } from "./svgToolBase.js";

export class SelectTool extends SvgToolBase {
  constructor(svgCanvas) {
    super(svgCanvas);
    this.selectedElement = null;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.elementStartX = 0;
    this.elementStartY = 0;
  }

  handleClick(x, y) {
    // 查找点击位置的元素
    const elements = this.svgCanvas.querySelectorAll(
      "rect, circle, line, path"
    );
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (this.isElementAtPosition(element, x, y)) {
        this.selectElement(element);
        // 记录拖拽起始位置
        this.isDragging = true;
        this.dragStartX = x;
        this.dragStartY = y;

        // 获取元素当前位置
        const bbox = element.getBBox();
        this.elementStartX = bbox.x;
        this.elementStartY = bbox.y;

        return;
      }
    }
    // 点击空白区域，取消选择
    this.deselectElement();
  }

  startDrag(x, y) {
    if (this.selectedElement) {
      this.isDragging = true;
      this.dragStartX = x;
      this.dragStartY = y;

      const bbox = this.selectedElement.getBBox();
      this.elementStartX = bbox.x;
      this.elementStartY = bbox.y;
    }
  }

  drag(x, y) {
    if (this.isDragging && this.selectedElement) {
      const dx = x - this.dragStartX;
      const dy = y - this.dragStartY;

      // 根据元素类型更新位置
      const element = this.selectedElement;
      const type = element.tagName.toLowerCase();

      if (type === "rect" || type === "ellipse") {
        // 矩形和椭圆使用x, y属性
        const newX = this.elementStartX + dx;
        const newY = this.elementStartY + dy;
        element.setAttribute("x", newX);
        element.setAttribute("y", newY);
      } else if (type === "circle") {
        // 圆形使用cx, cy属性
        const cx = parseFloat(element.getAttribute("cx")) + dx;
        const cy = parseFloat(element.getAttribute("cy")) + dy;
        element.setAttribute("cx", cx);
        element.setAttribute("cy", cy);
      } else if (type === "line") {
        // 直线需要移动两个端点
        const x1 = parseFloat(element.getAttribute("x1")) + dx;
        const y1 = parseFloat(element.getAttribute("y1")) + dy;
        const x2 = parseFloat(element.getAttribute("x2")) + dx;
        const y2 = parseFloat(element.getAttribute("y2")) + dy;
        element.setAttribute("x1", x1);
        element.setAttribute("y1", y1);
        element.setAttribute("x2", x2);
        element.setAttribute("y2", y2);
      } else if (type === "path") {
        // 简单的路径移动（实际应用中需要更复杂的路径解析）
        // 这里只处理M命令开头的路径
        const d = element.getAttribute("d");
        if (d && d.startsWith("M")) {
          const parts = d.split(" ");
          if (parts.length >= 3) {
            const mx = parseFloat(parts[1]) + dx;
            const my = parseFloat(parts[2]) + dy;
            parts[1] = mx;
            parts[2] = my;
            element.setAttribute("d", parts.join(" "));
          }
        }
      }
    }
  }

  endDrag() {
    this.isDragging = false;
  }

  isElementAtPosition(element, x, y) {
    // 简单的碰撞检测
    const bbox = element.getBBox();
    return (
      x >= bbox.x &&
      x <= bbox.x + bbox.width &&
      y >= bbox.y &&
      y <= bbox.y + bbox.height
    );
  }

  selectElement(element) {
    // 取消之前的选择
    this.deselectElement();

    // 标记当前选择的元素
    this.selectedElement = element;

    // 添加选择样式
    element.setAttribute("stroke", "red");
    element.setAttribute("stroke-width", 3);
  }

  deselectElement() {
    if (this.selectedElement) {
      // 恢复原有样式
      this.selectedElement.setAttribute("stroke", "black");
      this.selectedElement.setAttribute("stroke-width", 2);
      this.selectedElement = null;
    }
  }

  // 重置工具特定状态
  resetToolState() {
    this.deselectElement();
    this.isDragging = false;
  }
}
