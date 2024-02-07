import React, { createContext, useEffect, useRef, useState } from "react";
import {
  CommentBoxProps,
  DragElementProps,
  LooksValue,
  MotionListItem,
  PlayList,
  SpritePositionContextProps,
  SpritePositionProps,
  spritePostionInitialValue,
} from "../Props";

export const ActionContext = createContext<Partial<SpritePositionContextProps>>(
  {}
);

export const ContextProvider = (props: { children: React.ReactElement }) => {
  const [spritePostion, setSpiritePostion] = useState<SpritePositionProps>(
    () => spritePostionInitialValue
  );

  const [commentBoxList, setCommentBoxList] = useState<Array<CommentBoxProps>>(
    []
  );
  const [motionList, setMotionList] = useState<Array<Partial<MotionListItem>>>(
    []
  );

  const [playList, setPlayList] = useState<PlayList>({
    currentIndex: 0,
    motionLists: [],
    isPlayListSart: false,
  });

  const currentDragElement = useRef<DragElementProps>({
    motionList: [],
    type: "card",
  });

  let timeOutInterval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    clearTimeout(timeOutInterval.current!);
    if (playList.isPlayListSart) {
      const currentAnimation = playList.motionLists[playList.currentIndex];
      if (currentAnimation) {
        currentAnimation.action?.(currentAnimation.value, spritePostion, () => {
          setSpiritePostion((prevSprite) => ({
            ...prevSprite,
            transitionTime: 0,
            message: {
              description: "",
              open: false,
            },
          }));
        });

        const animationInterval =
          currentAnimation.type === "transition"
            ? (currentAnimation.value as LooksValue).time * 1000
            : 100;

        timeOutInterval.current = setTimeout(() => {
          setPlayList((prevalue) => {
            return {
              ...prevalue,
              currentIndex: prevalue.currentIndex + 1,
              blockId:
                playList.currentIndex === playList.motionLists.length - 1
                  ? undefined
                  : playList.blockId,
            };
          });
        }, animationInterval);
      } else {
        setPlayList({ ...playList, isPlayListSart: false });
      }
    }
  }, [playList]);

  const [past, setPast] = useState<Array<Partial<MotionListItem>[]>>([]);
  const [future, setFuture] = useState<Array<Partial<MotionListItem>[]>>([]);
  const onUndo = () => {
    if (past.length === 0) return "";

    const newPast = [...past];
    const newPresent = newPast.pop();

    setPast(newPast);
    setFuture([motionList, ...future]);
    setMotionList(() => {
      return newPresent ?? [];
    });
  };

  const onRedo = () => {
    if (future.length === 0) return "";
    const newFuture = [...future];
    const newPresent = newFuture.shift();
    setPast([...past, motionList]);
    setFuture(newFuture);
    setMotionList(newPresent ?? []);
  };

  return (
    <ActionContext.Provider
      value={{
        spritePostion,
        onUpdatePostion: setSpiritePostion,
        motionList,
        setMotionList: (value, canAddHistory) => {
          if (!!canAddHistory) {
            setPast([...past, motionList]);
            setFuture([]);
          }
          setMotionList(() => value);
        },
        dataTransfer: currentDragElement,
        commentBoxList,
        updateCommentBoxList: setCommentBoxList,
        onPlayMotion: (value) => {
          setPlayList({
            ...playList,
            ...value,
            blockId: value.blockId!,
            isPlayListSart: value.isPlayListSart,
          });
        },
        onRedo,
        onUndo,
        futureList: future,
        pastList: past,
        playList,
      }}
    >
      {props.children}
    </ActionContext.Provider>
  );
};
