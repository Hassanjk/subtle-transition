
export const getPointerPos = ev => {
  return {
    x: ev.clientX,
    y: ev.clientY
  }
}

export const getMouseDistance = (mousePos, lastMousePos) => {
  return Math.hypot(mousePos.x - lastMousePos.x, mousePos.y - lastMousePos.y)
}

export const lerp = (a, b, n) => (1 - n) * a + n * b
