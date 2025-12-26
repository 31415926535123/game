import { SelectTool } from "./tools/selectTool.js";
import { RectTool } from "./tools/rectTool.js";
import { CircleTool } from "./tools/circleTool.js";
import { LineTool } from "./tools/lineTool.js";
import { PathTool } from "./tools/pathTool.js";
import { PolylineTool } from "./tools/polylineTool.js";
import { EllipseTool } from "./tools/ellipseTool.js";
import { PolygonTool } from "./tools/polygonTool.js";
import { initCodeToggle } from "./codeToggle.js";
import { initCodeSync } from "./svgCodeSync.js";
import { initColorManager, getColor } from "./colorManager.js";
import { initColorManagerUI } from "./ui/colorManagerUI.js";
import { initThemeManager } from "./themeManager.js";
import { initToolButtons } from "./toolButtonsGenerator.js";
import { initShortcuts } from "./ui/shortcutHandler.js";
import { updateShortcutHints } from "./ui/shortcutHints.js";
import { downloadSVG } from "./svgDownloader.js";
import { initCanvasSettings } from "./canvasSettings.js";

const svgCanvas = document.getElementById("svgCanvas");
const svgCanvasContainer = document.getElementById("svgCanvasContainer");
const svgCode = document.getElementById("svgCode");

const loadBtn = document.getElementById("loadBtn");
const toggleCodeBtn = document.getElementById("toggleCodeBtn");
const bgColorPicker = document.getElementById("bgColorPicker");

// 初始化代码区展开/收起功能
initCodeToggle(toggleCodeBtn, svgCode);

// 初始化工具实例
const tools = {
  select: new SelectTool(svgCanvas),
  rect: new RectTool(svgCanvas, () => getColor("drawing")),
  circle: new CircleTool(svgCanvas, () => getColor("drawing")),
  line: new LineTool(svgCanvas, () => getColor("drawing")),
  path: new PathTool(svgCanvas, () => getColor("drawing")),
  polyline: new PolylineTool(svgCanvas, () => getColor("drawing")),
  ellipse: new EllipseTool(svgCanvas, () => getColor("drawing")),
  polygon: new PolygonTool(svgCanvas, () => getColor("drawing")),
};

// 当前状态
let currentTool = "select";
let isDrawing = false;

// 初始化代码区同步和加载功能
const { syncSvgToCode } = initCodeSync(svgCanvas, svgCode, loadBtn);

// 工具选择事件 - 批量添加（简化版本）
const toolMappings = {
  selectTool: "select",
  rectTool: "rect",
  circleTool: "circle",
  lineTool: "line",
  pathTool: "path",
  polylineTool: "polyline",
  ellipseTool: "ellipse",
  polygonTool: "polygon",
};

// 初始化工具按钮事件监听器（事件委托模式）
function initToolEventListeners() {
  const toolsContainer = document.getElementById("toolsContainer");

  if (toolsContainer) {
    toolsContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (button && toolMappings[button.id]) {
        const toolName = toolMappings[button.id];

        // 更新当前工具
        currentTool = toolName;

        // 更新按钮高亮状态
        updateToolButtonHighlight(toolName);
      }
    });
  }
}

// 更新工具按钮高亮状态
function updateToolButtonHighlight(selectedToolName) {
  const toolsContainer = document.getElementById("toolsContainer");
  if (!toolsContainer) return;

  // 移除所有按钮的高亮样式
  const allButtons = toolsContainer.querySelectorAll("button");
  allButtons.forEach((btn) => {
    btn.classList.remove("bg-blue-500", "text-white");
    btn.classList.add("border-gray-300", "hover:bg-gray-200");

    // 根据主题调整样式
    const isDarkTheme = document.body.classList.contains("bg-gray-900");
    if (isDarkTheme) {
      btn.classList.remove("border-gray-300", "hover:bg-gray-200");
      btn.classList.add("border-gray-600", "hover:bg-gray-700");
    }
  });

  // 为选中的按钮添加高亮样式
  const selectedButton = toolsContainer.querySelector(
    `#${Object.keys(toolMappings).find(
      (key) => toolMappings[key] === selectedToolName
    )}`
  );
  if (selectedButton) {
    selectedButton.classList.remove(
      "border-gray-300",
      "hover:bg-gray-200",
      "border-gray-600",
      "hover:bg-gray-700"
    );
    selectedButton.classList.add("bg-blue-500", "text-white");
  }
}

// 获取鼠标在SVG画布上的坐标（考虑viewBox变换）
function getMousePosition(e) {
  const rect = svgCanvas.getBoundingClientRect();

  // 获取物理坐标
  const physicalX = e.clientX - rect.x;
  const physicalY = e.clientY - rect.y;

  // 获取SVG画布的尺寸和viewBox设置
  const svgWidth = svgCanvas.width.baseVal.value;
  const svgHeight = svgCanvas.height.baseVal.value;
  const viewBox = svgCanvas.viewBox.baseVal;

  // 如果viewBox有效，进行坐标变换
  if (viewBox.width > 0 && viewBox.height > 0) {
    // 计算缩放比例
    const scaleX = viewBox.width / svgWidth;
    const scaleY = viewBox.height / svgHeight;
    console.log(
      "physicalX:",
      physicalX,
      "physicalY:",
      physicalY,
      "scaleX:",
      scaleX,
      "scaleY:",
      scaleY
    );
    // 将物理坐标映射到viewBox坐标系
    return {
      x: viewBox.x + physicalX * scaleX,
      y: viewBox.y + physicalY * scaleY,
    };
  }

  // 如果没有viewBox或viewBox无效，返回物理坐标
  return {
    x: physicalX,
    y: physicalY,
  };
}

// 处理选择工具点击
function handleSelectClick(x, y) {
  tools.select.handleClick(x, y);
}

// 处理多点和路径工具点击
function handleMultiPointToolClick(toolName, x, y) {
  if (!isDrawing) {
    tools[toolName].startDrawing(x, y);
    isDrawing = true;
  } else {
    if (toolName === "path") {
      tools.path.startDrawing(x, y);
      if (tools.path.drawingStage === 0) {
        isDrawing = false;
      }
    } else {
      tools[toolName].addPoint(x, y);
    }
  }
}

// 处理简单工具点击
function handleSimpleToolClick(toolName, x, y) {
  tools[toolName].handleClick(x, y);
  isDrawing = !tools[toolName].isFirstClick;
}

// SVG画布鼠标事件
svgCanvas.addEventListener("click", (e) => {
  const { x, y } = getMousePosition(e);

  switch (currentTool) {
    case "select":
      handleSelectClick(x, y);
      break;

    case "polyline":
    case "polygon":
    case "path":
      handleMultiPointToolClick(currentTool, x, y);
      break;

    default:
      handleSimpleToolClick(currentTool, x, y);
      break;
  }
});

// 添加mousedown事件处理选择工具的拖拽
svgCanvas.addEventListener("mousedown", (e) => {
  const { x, y } = getMousePosition(e);

  if (currentTool === "select") {
    tools.select.startDrag(x, y);
  }
});

svgCanvas.addEventListener("mousemove", (e) => {
  const { x: currentX, y: currentY } = getMousePosition(e);

  if (currentTool === "select") {
    tools.select.drag(currentX, currentY);
  } else if (isDrawing) {
    switch (currentTool) {
      case "path":
        tools.path.updateDrawing(currentX, currentY);
        break;
      case "polyline":
      case "polygon":
        // 多点工具在mousemove时不更新
        break;
      default:
        tools[currentTool].updateDrawing(currentX, currentY);
        break;
    }
  }

  syncSvgToCode();
});

svgCanvas.addEventListener("mouseup", () => {
  if (currentTool === "select") {
    tools.select.endDrag();
  }
});

svgCanvas.addEventListener("mouseleave", () => {
  if (currentTool === "select") {
    tools.select.endDrag();
  }

  if (isDrawing) {
    isDrawing = false;

    switch (currentTool) {
      case "path":
        if (tools.path.drawingStage !== 0) {
          tools.path.cancelDrawing();
        } else {
          tools[currentTool].finishDrawing();
        }
        break;
      case "polyline":
      case "polygon":
        tools[currentTool].finishDrawing();
        break;
      default:
        tools[currentTool].cancelDrawing();
        break;
    }
  }
});

// 添加双击事件结束折线、多边形和路径绘制
svgCanvas.addEventListener("dblclick", () => {
  if (!isDrawing) return;

  switch (currentTool) {
    case "path":
      if (tools.path.drawingStage !== 0) {
        tools.path.cancelDrawing();
      } else {
        tools[currentTool].finishDrawing();
      }
      isDrawing = false;
      break;
    case "polyline":
    case "polygon":
      tools[currentTool].finishDrawing();
      isDrawing = false;
      break;
  }
});

// 添加键盘事件处理
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || !isDrawing) return;

  switch (currentTool) {
    case "path":
      if (tools.path.drawingStage !== 0) {
        tools.path.cancelDrawing();
      } else {
        tools[currentTool].finishDrawing();
      }
      isDrawing = false;
      break;
    case "polyline":
    case "polygon":
      tools[currentTool].finishDrawing();
      isDrawing = false;
      break;
    default:
      tools[currentTool].cancelDrawing();
      isDrawing = false;
      break;
  }
});

// 创建下载按钮
function createDownloadButton() {
  downloadBtn.addEventListener("click", downloadSVG);
}

// 初始化颜色管理器
const colorManager = initColorManager();

// 在DOM加载完成后执行初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  // 初始化主题管理器
  initThemeManager();

  // 初始化颜色管理器UI
  initColorManagerUI();

  // 初始化工具按钮
  initToolButtons("toolsContainer");

  // 初始化工具按钮事件监听器
  initToolEventListeners();

  // 设置选择按钮的初始高亮状态
  updateToolButtonHighlight(currentTool);

  // 初始化快捷键
  initShortcuts(toolMappings);

  // 更新快捷键提示
  updateShortcutHints();

  // 创建下载按钮
  createDownloadButton();

  // 初始化画布设置管理器
  initCanvasSettings(svgCanvas, svgCanvasContainer);
}
