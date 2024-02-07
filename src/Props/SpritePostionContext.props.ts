import React from "react";
import { ActionCardProps } from "./ActionCard.props";

export const spritePostionInitialValue: SpritePositionProps = {
  coordinateX: 0,
  coordinateY: 0,
  rotateZ: 0,
  transitionTime: 0,
  message: {
    open: false,
    description: "",
    time: 0,
  },
};

export interface SpritePositionProps {
  coordinateX: number;
  coordinateY: number;
  rotateZ: number;
  transitionTime: number;
  message: {
    open: boolean;
    description: string;
    time?: number;
  };
}

export interface SpritePositionContextProps {
  spritePostion: SpritePositionProps;
  onUpdatePostion: (value: React.SetStateAction<SpritePositionProps>) => void;
  motionList: Array<Partial<MotionListItem>>;
  setMotionList: (
    value: Partial<MotionListItem>[],
    canAddHistory?: boolean
  ) => void;
  dataTransfer: React.MutableRefObject<DragElementProps>;
  onUndo: () => void;
  onRedo: () => void;
  pastList: Array<Partial<MotionListItem>[]>;
  futureList: Array<Partial<MotionListItem>[]>;
  commentBoxList: CommentBoxProps[];
  updateCommentBoxList: (value: CommentBoxProps[]) => void;
  onPlayMotion: (value: PlayList) => void;
  playList: PlayList;
}

export type MotionListItem = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  children: ActionCardProps[];
};

export interface MotionListJourney {
  past: Partial<MotionListItem>[];
  present: Partial<MotionListItem>[];
  future: Partial<MotionListItem>[];
}

export interface CommentBoxProps {
  description: string;
  id: string;
  postion: {
    x: number;
    y: number;
  };
}

export interface DragElementProps {
  type: "block" | "card";
  id?: string;
  motionList: ActionCardProps[];
}

export interface PlayList {
  currentIndex: number;
  motionLists: ActionCardProps[];
  blockId?: string;
  isPlayListSart: boolean;
}
