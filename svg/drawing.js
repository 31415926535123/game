export function initDrawing(canvas) {
  let drawing = false,
    startX,
    startY,
    currentShape,
    drawMode = "line",
    polylinePoints = []; // 存储折线的点

  const setAttributes = (el, attrs) => {
    Object.entries(attrs).forEach(([key, value]) =>
      el.setAttribute(key, value)
    );
  };

  const createSVGElement = (type, defaultAttrs = {}) => {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      type
    );
    setAttributes(element, defaultAttrs);
    return element;
  };

  const drawFunctions = {
    line: {
      start: (x, y) => {
        currentShape = createSVGElement("line", {
          stroke: "black",
          "stroke-width": "2",
          x1: x,
          y1: y,
          x2: x,
          y2: y,
        });
        canvas.appendChild(currentShape);
      },
      draw: (x, y) => {
        setAttributes(currentShape, {
          x2: x,
          y2: y,
        });
      },
    },
    rect: {
      start: (x, y) => {
        currentShape = createSVGElement("rect", {
          stroke: "black",
          "stroke-width": "2",
          fill: "none",
          x: x,
          y: y,
          width: 0,
          height: 0,
        });
        canvas.appendChild(currentShape);
      },
      draw: (x, y) => {
        const width = x - startX;
        const height = y - startY;
        setAttributes(currentShape, {
          x: width < 0 ? x : startX,
          y: height < 0 ? y : startY,
          width: Math.abs(width),
          height: Math.abs(height),
        });
      },
    },
    circle: {
      start: (x, y) => {
        currentShape = createSVGElement("circle", {
          stroke: "black",
          "stroke-width": "2",
          fill: "none",
          cx: x,
          cy: y,
          r: 0,
        });
        canvas.appendChild(currentShape);
      },
      draw: (x, y) => {
        const radius = Math.sqrt(
          Math.pow(x - startX, 2) + Math.pow(y - startY, 2)
        );
        setAttributes(currentShape, {
          r: radius,
        });
      },
    },
    ellipse: {
      start: (x, y) => {
        currentShape = createSVGElement("ellipse", {
          stroke: "black",
          "stroke-width": "2",
          fill: "none",
          cx: x,
          cy: y,
          rx: 0,
          ry: 0,
        });
        canvas.appendChild(currentShape);
      },
      draw: (x, y) => {
        const rx = Math.abs(x - startX) / 2;
        const ry = Math.abs(y - startY) / 2;
        const cx = startX + (x - startX) / 2;
        const cy = startY + (y - startY) / 2;
        setAttributes(currentShape, {
          cx: cx,
          cy: cy,
          rx: rx,
          ry: ry,
        });
      },
    },
    polyline: {
      start: (x, y) => {
        if (polylinePoints.length === 0) {
          // 只在开始新的折线时初始化
          polylinePoints = [`${x},${y}`];
          currentShape = createSVGElement("polyline", {
            stroke: "black",
            "stroke-width": "2",
            fill: "none",
            points: polylinePoints.join(" "),
          });
          canvas.appendChild(currentShape);
        }
        // 如果数组非空，什么都不做，让 draw 方法处理点的添加
      },
      draw: (x, y) => {
        // 显示从最后一个点到当前鼠标位置的预览线
        const previewPoints = [...polylinePoints, `${x},${y}`];
        setAttributes(currentShape, {
          points: previewPoints.join(" "),
        });
      },
      finish: () => {
        polylinePoints = [];
      },
    },
  };

  function startDrawing(e) {
    if (drawMode === "polyline") {
      // 折线模式：每次点击添加一个点
      if (polylinePoints.length === 0) {
        // 第一个点，初始化折线
        drawFunctions[drawMode].start(e.offsetX, e.offsetY);
      } else {
        // 后续点，直接添加到折线
        polylinePoints.push(`${e.offsetX},${e.offsetY}`);
        setAttributes(currentShape, {
          points: polylinePoints.join(" "),
        });
      }
      canvas.dispatchEvent(
        new CustomEvent("drawingstart", {
          detail: { startX: e.offsetX, startY: e.offsetY, mode: drawMode },
        })
      );
    } else {
      // 其他图形模式：传统拖拽绘制
      drawing = true;
      startX = e.offsetX;
      startY = e.offsetY;
      drawFunctions[drawMode].start(startX, startY);
      canvas.dispatchEvent(
        new CustomEvent("drawingstart", {
          detail: { startX, startY, mode: drawMode },
        })
      );
    }
  }

  function draw(e) {
    // 确定起始坐标
    let currentStartX, currentStartY;
    if (drawMode === "polyline") {
      // 折线模式：使用第一个点作为起始坐标
      [currentStartX, currentStartY] = polylinePoints[0].split(",");
    } else {
      // 其他图形模式：使用拖拽起始点
      if (!drawing) return;
      currentStartX = startX;
      currentStartY = startY;
    }

    // 绘制图形
    drawFunctions[drawMode].draw(e.offsetX, e.offsetY);

    // 触发事件
    canvas.dispatchEvent(
      new CustomEvent("drawing", {
        detail: {
          startX: currentStartX,
          startY: currentStartY,
          endX: e.offsetX,
          endY: e.offsetY,
          mode: drawMode,
        },
      })
    );
  }

  function stopDrawing() {
    // 折线模式：mouseup 不结束绘制，只是更新预览
    // 折线需要通过 Ctrl+C 结束
    if (drawMode === "polyline") return;

    // 其他图形模式：mouseup 结束绘制
    drawing = false;
    canvas.dispatchEvent(
      new CustomEvent("drawingend", { detail: { mode: drawMode } })
    );
  }

  function setMode(mode) {
    drawMode = mode;
    canvas.dispatchEvent(new CustomEvent("modechange", { detail: { mode } }));
  }

  const keyToModeMap = {
    r: "rect",
    R: "rect",
    l: "line",
    L: "line",
    c: "circle",
    C: "circle",
    e: "ellipse",
    E: "ellipse",
    p: "polyline",
    P: "polyline",
  };

  function handleKey(e) {
    // 处理 Ctrl+C 结束折线绘制
    if (
      e.ctrlKey &&
      e.key === "c" &&
      drawMode === "polyline" &&
      polylinePoints.length > 0
    ) {
      drawFunctions.polyline.finish();
      canvas.dispatchEvent(
        new CustomEvent("drawingend", { detail: { mode: drawMode } })
      );
      return;
    }

    // 处理模式切换
    const mode = keyToModeMap[e.key];
    if (mode) {
      // 如果正在绘制折线，先结束当前折线
      if (drawMode === "polyline" && polylinePoints.length > 0) {
        drawFunctions.polyline.finish();
        canvas.dispatchEvent(
          new CustomEvent("drawingend", { detail: { mode: drawMode } })
        );
      }
      setMode(mode);
    }
  }

  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  document.addEventListener("keydown", handleKey);

  return { setMode };
}
