import React from "react";
import { SpritePositionProps } from "./SpritePostionContext.props";

export interface ActionCardProps {
  value: ActionCardValueType;
  action?: (
    newPosition: number | Coordination | LooksValue,
    spritePosition: SpritePositionProps,
    from?: () => void
  ) => void;
  onChange?: (newPosition: number | Coordination | LooksValue) => void;
  draggable?: boolean;
  readonly: boolean;
  type: "rotate" | "move" | "range" | "transition" | "random";
  render?: (
    state: ActionCardValueType,
    onUpdateState: (value: ActionCardValueType) => void,
    color?: string
  ) => React.ReactElement;
  color?: string;
}
export type Coordination = { x: number; y: number };
export type LooksValue = { message: string; time: number; open: boolean };
export type ActionCardValueType = number | Coordination | LooksValue;
