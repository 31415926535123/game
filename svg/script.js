import { initDrawing } from "./drawing.js";
import { initVirtualJoystick } from "./virtual-joystick.js";
import { exportSVG, importSVG } from "./svg-io.js";

const MODE_TEXT = {
  line: "line",
  rect: "rectangle",
  circle: "circle",
  ellipse: "ellipse",
  polyline: "polyline",
  quadraticBezier: "quadratic bezier curve",
};

// 虚拟摇杆方向到键的映射
const DIRECTION_TO_KEY_MAP = {
  up: "l", // 上 -> 线条
  down: "r", // 下 -> 矩形
  left: "c", // 左 -> 圆形
  right: "e", // 右 -> 椭圆
};

// 第二个虚拟摇杆（右下角）的方向到键的映射 - 用于贝塞尔曲线
const BEZIER_JOYSTICK_MAP = {
  up: "q", // 上 -> 贝塞尔曲线模式
  down: "1", // 下 -> 选择点1
  left: "2", // 左 -> 选择点2
  right: "3", // 右 -> 选择点3
};

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const status = document.getElementById("status");
  const { setMode } = initDrawing(canvas);

  // 为第一个摇杆添加键位标签：上(l)、下(r)、左(c)、右(e)
  initVirtualJoystick(DIRECTION_TO_KEY_MAP, {
    keyLabels: ["l", "r", "c", "e"],
  });

  // 添加第二个虚拟摇杆用于贝塞尔曲线控制，并添加键位标签：上(q)、下(1)、左(2)、右(3)
  initVirtualJoystick(BEZIER_JOYSTICK_MAP, {
    id: "bezier-joystick",
    position: "bottom-right",
    keyLabels: ["q", "1", "2", "3"],
  });

  canvas.addEventListener("drawingstart", (e) => {
    const { mode, startX, startY } = e.detail;
    status.textContent = `Drawing ${MODE_TEXT[mode]} from (${Math.round(
      startX
    )}, ${Math.round(startY)})`;
  });

  canvas.addEventListener("drawing", (e) => {
    const { mode, startX, startY, endX, endY } = e.detail;
    status.textContent = `Drawing ${MODE_TEXT[mode]} from (${Math.round(
      startX
    )}, ${Math.round(startY)}) to (${Math.round(endX)}, ${Math.round(endY)})`;
  });

  canvas.addEventListener("drawingend", (e) => {
    const { mode } = e.detail;
    status.textContent = `Mode: ${
      MODE_TEXT[mode]
    }. Press 'r' for rect, 'l' for line, 'c' for circle, 'e' for ellipse, 'p' for polyline, 'q' for quadratic bezier. ${
      mode === "polyline" ? "Click to add points, Ctrl+C to finish." : ""
    }${
      mode === "quadraticBezier"
        ? " Click to create/move points (automatically cycles 1→2→3→1), or press 1, 2, 3 to select manually. Ctrl+C to cancel."
        : ""
    }`;
  });

  canvas.addEventListener("modechange", (e) => {
    const { mode } = e.detail;
    status.textContent = `Mode: ${
      MODE_TEXT[mode]
    }. Press 'r' for rect, 'l' for line, 'c' for circle, 'e' for ellipse, 'p' for polyline, 'q' for quadratic bezier. ${
      mode === "polyline" ? "Click to add points, Ctrl+C to finish." : ""
    }${
      mode === "quadraticBezier"
        ? " Click to create/move points (automatically cycles 1→2→3→1), or press 1, 2, 3 to select manually. Ctrl+C to cancel."
        : ""
    }`;
  });

  // 添加快捷键支持
  document.addEventListener("keydown", (e) => {
    if (e.altKey) {
      switch (e.key.toLowerCase()) {
        case "e":
          exportSVG(canvas);
          break;
        case "i":
          importSVG(canvas, (error) => {
            if (error) {
              status.textContent = `Error importing SVG: ${error.message}`;
            } else {
              status.textContent = "SVG imported successfully";
            }
          });
          break;
      }
    }
  });

  // 添加底部摇杆用于导入导出功能
  const ioJoystickMap = {
    up: { key: "c", ctrlKey: true }, // 上 -> Ctrl+C (结束绘制)
    down: "", // 保留位置
    left: { key: "i", altKey: true }, // 左 -> Alt+I (导入)
    right: { key: "e", altKey: true }, // 右 -> Alt+E (导出)
  };

  initVirtualJoystick(ioJoystickMap, {
    id: "io-joystick",
    position: "bottom-center",
    keyLabels: ["c", "", "i", "e"],
  });
});
