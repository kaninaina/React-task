import { useContext, useEffect, useState } from "react";
import { ActionCardProps, Coordination, LooksValue } from "../../Props";
import "./ActionCard.css";
import { ActionContext } from "../../contextHook/ActionContext";

export const ActionCard = (props: ActionCardProps) => {
  const [state, setState] = useState<number | Coordination | LooksValue>(() => {
    return props.value;
  });

  const { dataTransfer, spritePostion, onUpdatePostion } =
    useContext(ActionContext);

  useEffect(() => {
    if (props.type === "range" && !props.readonly) {
      setState({
        x: spritePostion?.coordinateX!,
        y: spritePostion?.coordinateY!,
      });
    }
  }, [spritePostion]);
  useEffect(() => {
    if (props.readonly) {
      props.onChange?.(state);
    }
  }, [state]);
  return (
    <div
      style={{ width: "fit-content" }}
      draggable={!!props.draggable}
      onClick={(e) => {
        if (!props.readonly) {
          if (props.type === "transition") {
            props.action?.(state, spritePostion!, () => {
              onUpdatePostion?.((preValue) => {
                return {
                  ...preValue!,
                  message: { ...preValue?.message!, open: false },
                };
              });
            });
          } else {
            props.action?.(state, spritePostion!);
          }
        }
      }}
      onDragStart={(e) => {
        if (dataTransfer?.current) {
          dataTransfer.current = {
            motionList: [{ ...props, value: state }],
            type: "card",
          };
        }
      }}
    >
      {props.render?.(state, setState, props.color)}
    </div>
  );
};
