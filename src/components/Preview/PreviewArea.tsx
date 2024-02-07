import React, { useContext, useEffect, useRef, useState } from "react";
import CatSprite from "../CatSprite";
import { ActionContext } from "../../contextHook/ActionContext";
import "./previewArea.css";
import { getCoordination } from "../Contructs/Common";
export default function PreviewArea() {
  const [isExpand, setExpand] = useState(false);
  const { spritePostion, onUpdatePostion } = useContext(ActionContext);
  const spriteCanMove = useRef(false);
  const spriteContainerRef = useRef<null | HTMLDivElement>(null);

  return (
    <div className={`right-view-container ${isExpand ? "expand" : ""}`}>
      <div className="preview-container">
        <div className="preview-header">
          <div></div>
          <div className="view-action-box">
            <ul>
              <li
                onClick={() => {
                  setExpand(!isExpand);
                }}
              >
                <svg
                  className="h-4 w-4 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke-width="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </li>
            </ul>
          </div>
        </div>
        <div className="preview-area" ref={spriteContainerRef}>
          <div
            className="sprite-wrapper"
            style={{
              left: `${spritePostion?.coordinateX}px`,
              top: `${spritePostion?.coordinateY}px`,
              transform: `rotateZ(${spritePostion?.rotateZ}deg)`,
              transition: "all",
              transitionTimingFunction: "linear",
              position: "relative",
            }}
            onMouseMove={(e) => {
              if (spriteCanMove.current) {
                const coordination = getCoordination(
                  e,
                  spriteContainerRef,
                  40,
                  40
                );

                onUpdatePostion?.({
                  ...spritePostion!,
                  coordinateX: coordination.x,
                  coordinateY: coordination.y,
                });
              }
            }}
            onMouseDown={() => {
              spriteCanMove.current = true;
            }}
            onMouseUp={(e) => {
              spriteCanMove.current = false;
            }}
            onMouseLeave={(e) => {
              spriteCanMove.current = false;
            }}
          >
            <CatSprite />
            <div
              className={`messageBox ${spritePostion?.message.open && "show"}`}
            >
              <p>{spritePostion?.message.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
