import React from "react";

export const getCoordination = (
  e: React.DragEvent<HTMLDivElement> | React.MouseEvent,
  boundaryRef: React.MutableRefObject<HTMLDivElement | null>,
  marginX: number,
  marginY: number
): { x: number; y: number } => {
  const rect = boundaryRef.current?.getBoundingClientRect?.();
  let ex = e.clientX;
  let ey = e.clientY;
  let x = rect?.x ?? 0;
  let y = rect?.y ?? 0;
  return { x: ex - x - marginX, y: ey - y - marginY };
};
