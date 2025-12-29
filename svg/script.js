import { initDrawing } from "./drawing.js";
import { initVirtualJoystick } from "./virtual-joystick.js";

const MODE_TEXT = {
  line: "line",
  rect: "rectangle",
  circle: "circle",
  ellipse: "ellipse",
  polyline: "polyline",
};

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const status = document.getElementById("status");
  const { setMode } = initDrawing(canvas);

  initVirtualJoystick();

  canvas.addEventListener("drawingstart", (e) => {
    const { mode, startX, startY } = e.detail;
    status.textContent = `Drawing ${MODE_TEXT[mode]} from (${startX}, ${startY})`;
  });

  canvas.addEventListener("drawing", (e) => {
    const { mode, startX, startY, endX, endY } = e.detail;
    status.textContent = `Drawing ${MODE_TEXT[mode]} from (${startX}, ${startY}) to (${endX}, ${endY})`;
  });

  canvas.addEventListener("drawingend", (e) => {
    const { mode, startX, startY, endX, endY } = e.detail;
    status.textContent = `Drew ${MODE_TEXT[mode]} from (${startX}, ${startY}) to (${endX}, ${endY})`;
  });

  canvas.addEventListener("modechange", (e) => {
    const { mode } = e.detail;
    status.textContent = `Mode: ${
      MODE_TEXT[mode]
    }. Press 'r' for rect, 'l' for line, 'c' for circle, 'e' for ellipse, 'p' for polyline. ${
      mode === "polyline" ? "Click to add points, Ctrl+C to finish." : ""
    }`;
  });
});
