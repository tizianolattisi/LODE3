export const CANVAS_SIZE = {
  W: 1920
};

export function getCanvasHeight(imageWidth: number, imageHeight: number, ): number {
  return (CANVAS_SIZE.W * imageHeight) / imageWidth;
}
