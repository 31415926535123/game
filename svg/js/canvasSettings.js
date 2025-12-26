// 画布设置管理器
class CanvasSettingsManager {
  constructor(svgCanvas, svgCanvasContainer) {
    this.svgCanvas = svgCanvas;
    this.svgCanvasContainer = svgCanvasContainer;
    this.settings = {
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      viewBox: "0 0 400 400",
    };

    this.init();
  }

  init() {
    // 获取DOM元素
    this.canvasX = document.getElementById("canvasX");
    this.canvasY = document.getElementById("canvasY");
    this.canvasWidth = document.getElementById("canvasWidth");
    this.canvasHeight = document.getElementById("canvasHeight");
    this.canvasViewBox = document.getElementById("canvasViewBox");
    this.applyButton = document.getElementById("applyCanvasSettings");

    // 从SVG画布加载当前设置
    this.loadCurrentSettings();

    // 绑定事件监听器
    this.bindEvents();
  }

  loadCurrentSettings() {
    // 从SVG画布读取当前属性
    this.settings.x = parseInt(this.svgCanvas.getAttribute("x")) || 0;
    this.settings.y = parseInt(this.svgCanvas.getAttribute("y")) || 0;
    this.settings.width = parseInt(this.svgCanvas.getAttribute("width")) || 400;
    this.settings.height =
      parseInt(this.svgCanvas.getAttribute("height")) || 400;
    this.settings.viewBox =
      this.svgCanvas.getAttribute("viewBox") || "0 0 400 400";

    // 更新输入框的值
    this.updateInputs();

    // 初始化时同步背景板位置
    this.syncBackgroundPosition(this.settings);
  }

  updateInputs() {
    this.canvasX.value = this.settings.x;
    this.canvasY.value = this.settings.y;
    this.canvasWidth.value = this.settings.width;
    this.canvasHeight.value = this.settings.height;
    this.canvasViewBox.value = this.settings.viewBox;
  }

  bindEvents() {
    // 应用按钮点击事件
    this.applyButton.addEventListener("click", () => {
      this.applySettings();
    });

    // 输入框回车键事件
    const inputs = [
      this.canvasX,
      this.canvasY,
      this.canvasWidth,
      this.canvasHeight,
      this.canvasViewBox,
    ];
    inputs.forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.applySettings();
        }
      });
    });

    // 输入框变化时实时预览（可选）
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.previewSettings();
      });
    });
  }

  previewSettings() {
    // 实时预览设置（不实际应用）
    const preview = {
      x: parseInt(this.canvasX.value) || 0,
      y: parseInt(this.canvasY.value) || 0,
      width: parseInt(this.canvasWidth.value) || 400,
      height: parseInt(this.canvasHeight.value) || 400,
      viewBox: this.canvasViewBox.value || "0 0 400 400",
    };

    // 验证ViewBox格式
    if (!this.validateViewBox(preview.viewBox)) {
      this.canvasViewBox.classList.add("border-red-500");
      return;
    } else {
      this.canvasViewBox.classList.remove("border-red-500");
    }

    // 可以在这里添加实时预览逻辑
  }

  validateViewBox(viewBox) {
    // 简单的ViewBox格式验证
    const parts = viewBox.split(" ").filter((part) => part !== "");
    return (
      parts.length === 4 && parts.every((part) => !isNaN(parseFloat(part)))
    );
  }

  applySettings() {
    // 获取输入值
    const newSettings = {
      x: parseInt(this.canvasX.value) || 0,
      y: parseInt(this.canvasY.value) || 0,
      width: parseInt(this.canvasWidth.value) || 400,
      height: parseInt(this.canvasHeight.value) || 400,
      viewBox: this.canvasViewBox.value || "0 0 400 400",
    };

    // 验证设置
    if (!this.validateSettings(newSettings)) {
      this.showError("设置无效，请检查输入值");
      return;
    }

    // 应用设置到SVG画布
    this.updateCanvas(newSettings);

    // 更新内部状态
    this.settings = newSettings;

    this.showSuccess("设置已应用");
  }

  validateSettings(settings) {
    // 基本验证
    if (settings.width <= 0 || settings.height <= 0) {
      return false;
    }

    // ViewBox验证
    if (!this.validateViewBox(settings.viewBox)) {
      return false;
    }

    return true;
  }

  updateCanvas(settings) {
    // 更新SVG画布属性
    this.svgCanvas.setAttribute("x", settings.x);
    this.svgCanvas.setAttribute("y", settings.y);
    this.svgCanvas.setAttribute("width", settings.width);
    this.svgCanvas.setAttribute("height", settings.height);
    this.svgCanvas.setAttribute("viewBox", settings.viewBox);

    // 同步背景板位置到画布位置
    this.syncBackgroundPosition(settings);

    // 触发自定义事件，通知其他组件画布已更新
    const event = new CustomEvent("canvasSettingsChanged", {
      detail: settings,
    });
    this.svgCanvas.dispatchEvent(event);
  }

  // 同步背景板位置到画布位置
  syncBackgroundPosition(settings) {
    if (this.svgCanvasContainer) {
      // 设置背景板的位置与画布一致
      this.svgCanvasContainer.style.left = `${settings.x}px`;
      this.svgCanvasContainer.style.top = `${settings.y}px`;

      // 设置背景板的尺寸与画布一致
      this.svgCanvasContainer.style.width = `${settings.width}px`;
      this.svgCanvasContainer.style.height = `${settings.height}px`;
    }
  }

  showError(message) {
    // 简单的错误提示
    this.applyButton.textContent = "错误";
    this.applyButton.classList.remove("bg-blue-500", "hover:bg-blue-600");
    this.applyButton.classList.add("bg-red-500", "hover:bg-red-600");

    setTimeout(() => {
      this.applyButton.textContent = "应用设置";
      this.applyButton.classList.remove("bg-red-500", "hover:bg-red-600");
      this.applyButton.classList.add("bg-blue-500", "hover:bg-blue-600");
    }, 2000);
  }

  showSuccess(message) {
    // 简单的成功提示
    this.applyButton.textContent = "✓ 已应用";
    this.applyButton.classList.remove("bg-blue-500", "hover:bg-blue-600");
    this.applyButton.classList.add("bg-green-500", "hover:bg-green-600");

    setTimeout(() => {
      this.applyButton.textContent = "应用设置";
      this.applyButton.classList.remove("bg-green-500", "hover:bg-green-600");
      this.applyButton.classList.add("bg-blue-500", "hover:bg-blue-600");
    }, 1000);
  }

  // 获取当前设置（供其他模块使用）
  getSettings() {
    return { ...this.settings };
  }

  // 重置为默认设置
  resetToDefaults() {
    const defaults = {
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      viewBox: "0 0 400 400",
    };

    this.updateCanvas(defaults);
    this.settings = defaults;
    this.updateInputs();
    this.showSuccess("已重置为默认设置");
  }
}

// 导出初始化函数
export function initCanvasSettings(svgCanvas) {
  return new CanvasSettingsManager(svgCanvas);
}

export default CanvasSettingsManager;
