export function initVirtualJoystick() {
  const joystick = document.createElement("div");
  joystick.id = "virtual-joystick";
  joystick.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 120px;
    height: 120px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    display: none;
    z-index: 1000;
  `;

  const knob = document.createElement("div");
  knob.style.cssText = `
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  `;

  joystick.appendChild(knob);
  document.body.appendChild(joystick);

  let isDragging = false;
  let currentDirection = null;

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  if (isMobileDevice()) {
    joystick.style.display = "block";
  }

  function handleStart(e) {
    isDragging = true;
    e.preventDefault();
  }

  function handleMove(e) {
    if (!isDragging) return;

    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2 - 20;

    let knobX = deltaX;
    let knobY = deltaY;

    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      knobX = Math.cos(angle) * maxDistance;
      knobY = Math.sin(angle) * maxDistance;
    }

    knob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

    let newDirection = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 20) newDirection = "right";
      else if (deltaX < -20) newDirection = "left";
    } else {
      if (deltaY > 20) newDirection = "down";
      else if (deltaY < -20) newDirection = "up";
    }

    if (newDirection !== currentDirection) {
      if (currentDirection) {
        const keyUpEvent = new KeyboardEvent("keyup", {
          key: getArrowKey(currentDirection),
        });
        document.dispatchEvent(keyUpEvent);
      }

      if (newDirection) {
        const keyDownEvent = new KeyboardEvent("keydown", {
          key: getArrowKey(newDirection),
        });
        document.dispatchEvent(keyDownEvent);
      }

      currentDirection = newDirection;
    }
  }

  function handleEnd() {
    if (!isDragging) return;
    isDragging = false;

    knob.style.transform = "translate(-50%, -50%)";

    if (currentDirection) {
      const keyUpEvent = new KeyboardEvent("keyup", {
        key: getArrowKey(currentDirection),
      });
      document.dispatchEvent(keyUpEvent);
      currentDirection = null;
    }
  }

  function getArrowKey(direction) {
    switch (direction) {
      case "up":
        return "l";
      case "down":
        return "r";
      case "left":
        return "c";
      case "right":
        return "e";
      default:
        return "";
    }
  }

  joystick.addEventListener("touchstart", handleStart);
  joystick.addEventListener("mousedown", handleStart);
  document.addEventListener("touchmove", handleMove);
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("touchend", handleEnd);
  document.addEventListener("mouseup", handleEnd);

  return joystick;
}
