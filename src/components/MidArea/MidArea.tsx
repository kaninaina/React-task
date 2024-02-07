import React, { useContext, useRef, useState } from "react";
import { ActionContext } from "../../contextHook/ActionContext";
import { ActionCard } from "../ActionCard/ActionCard";
import { CommentBoxProps, MotionListItem } from "../../Props";
import "./MidArea.css";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { getCoordination } from "../Contructs/Common";
import { CommentBox } from "../CommentBox/CommentBox";

export default function MidArea() {
  const {
    motionList,
    setMotionList,
    dataTransfer,
    commentBoxList,
    updateCommentBoxList,
    onRedo,
    onUndo,
    futureList,
    pastList,
  } = useContext(ActionContext);
  const [contextMenuPostion, setContetMenuPosition] = useState<{
    x: number;
    y: number;
    open: boolean;
  }>({ open: false, x: 0, y: 0 });

  const spriteContainerRef = useRef<null | HTMLDivElement>(null);
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const coordination = getCoordination(e, spriteContainerRef, 20, 20);
    let data = dataTransfer;
    if (data?.current.type === "card") {
      setMotionList?.([
        ...motionList!,
        {
          id: Math.floor(Math.random() * 10000) + "",
          position: { x: coordination.x, y: coordination.y },
          children: [...data?.current.motionList!],
        },
      ]);
    }
  };
  const onMotionListMove = (e: React.MouseEvent) => {
    return getCoordination(e, spriteContainerRef, 50, 50);
  };
  const contextMenuItems = [
    {
      lable: "Undo",
      action: () => {
        onUndo?.();
      },
      disable: (pastList?.length ?? 0) == 0,
    },
    {
      lable: "Redo",
      action: () => {
        onRedo?.();
      },
      disable: (futureList?.length ?? 0) == 0,
    },
    {
      lable: "Add Comment",
      action: () => {
        let newCommentBox: CommentBoxProps = {
          description: "",
          postion: { x: contextMenuPostion?.x!, y: contextMenuPostion?.y! },
          id: Math.random() * 10000 + "",
        };
        updateCommentBoxList?.([...commentBoxList!, newCommentBox]);
      },
      disable: false,
    },
    {
      lable: `Delete ${motionList?.length} Blocks`,
      action: () => {
        let getConfirm = window.confirm(
          `Delete all ${motionList?.length} blocks?`
        );
        if (getConfirm) setMotionList?.([]);
      },
      disable: motionList?.length === 0,
    },
  ];

  return (
    <div
      ref={spriteContainerRef}
      style={{ width: "100%", height: "100%", position: "relative", zIndex: 0 }}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        setContetMenuPosition({ ...contextMenuPostion, open: false });
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        const coordination = getCoordination(e, spriteContainerRef, 0, 0);
        setContetMenuPosition({
          ...contextMenuPostion,
          x: coordination.x,
          y: coordination.y,
          open: true,
        });
      }}
    >
      {motionList?.map((item, index) => {
        return (
          <MotionList
            item={item}
            onMotionListMove={onMotionListMove}
            index={index}
          />
        );
      })}

      <div
        className={`context-menu ${contextMenuPostion.open && "show"}`}
        style={{
          top: `${contextMenuPostion?.y}px`,
          left: `${contextMenuPostion?.x}px`,
        }}
      >
        <ul>
          {contextMenuItems.map((el) => {
            return (
              <li
                key={el.lable}
                onClick={() => {
                  if (!el.disable) {
                    el.action();
                  }
                }}
                className={`${el.disable ? "disable" : ""}`}
              >
                {el.lable}
              </li>
            );
          })}
        </ul>
      </div>
      {commentBoxList?.map((el, i) => {
        return (
          <CommentBox
            {...el}
            onChange={(value) => {
              let newCommenList = [...commentBoxList];
              newCommenList[i] = value;
              updateCommentBoxList?.(newCommenList);
            }}
            onDelete={(id) => {
              const newCommentList = commentBoxList.filter((commnetbox) => {
                return commnetbox.id !== id;
              });
              updateCommentBoxList?.(newCommentList);
            }}
            onCommentBoxMove={(e) => {
              const coordination = getCoordination(
                e,
                spriteContainerRef,
                40,
                10
              );
              const commentBox = [...commentBoxList!];
              commentBox[i] = {
                ...commentBox[i],
                postion: { x: coordination.x, y: coordination.y },
              };
              updateCommentBoxList?.(commentBox);
            }}
          />
        );
      })}
    </div>
  );
}

const MotionList = ({
  item,
  onMotionListMove,
  index,
}: {
  item: Partial<MotionListItem>;
  onMotionListMove: (e: React.MouseEvent) => { x: number; y: number };
  index: number;
}) => {
  const {
    motionList,
    setMotionList,
    dataTransfer,
    onPlayMotion,

    playList,
  } = useContext(ActionContext);
  const [motionListCanmove, setMotionListCanMOve] = useState<
    "static" | "press" | "move"
  >("static");
  const motionListParentRef = useRef<HTMLUListElement | null>(null);
  const [isDragOver, setDragOver] = useState<boolean>(false);

  return (
    <ul
      ref={motionListParentRef}
      className={`motion-list-container ${
        playList?.isPlayListSart && playList?.blockId === item.id && "animate"
      }`}
      style={{
        position: "absolute",
        left: `${item.position?.x}px`,
        top: `${item.position?.y}px`,
        zIndex: motionListCanmove === "move" ? 100 : 1,
        padding: "0px 50px 50px 50px",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
      }}
      onMouseMove={(e) => {
        if (motionListCanmove !== "static") {
          const coordination = onMotionListMove(e);

          const newMotionList = [...motionList!];
          newMotionList[index] = {
            ...newMotionList[index],
            position: { x: coordination.x, y: coordination.y },
          };
          setMotionList?.(newMotionList);
          setMotionListCanMOve("move");

          motionListParentRef.current?.classList.add("dragger");
        }
      }}
      onMouseDown={() => {
        setMotionListCanMOve("press");

        if (dataTransfer?.current) {
          dataTransfer.current = {
            motionList: item.children ?? [],
            type: "block",
            id: item.id,
          };
        }
      }}
      onMouseUp={(e) => {
        if (motionListCanmove === "press") {
          if (!playList?.isPlayListSart) {
            onPlayMotion?.({
              currentIndex: 0,
              motionLists: item.children!,
              blockId: item.id!,
              isPlayListSart: true,
            });
          } else {
            onPlayMotion?.({ ...playList, isPlayListSart: false });
          }
          setMotionListCanMOve("static");

          return "";
        }

        const coordination = onMotionListMove(e);

        let findOverLayElement = motionList?.findIndex((el) => {
          let x = (el.position?.x ?? 0) + 100;
          let y = (el.position?.y ?? 0) + ((el.children?.length ?? 0) + 1) * 30;

          if (
            coordination.x >= (el.position?.x ?? 0) &&
            coordination.x <= x &&
            coordination.y >= (el.position?.y ?? 0) &&
            coordination.y <= y &&
            el.id !== item.id
          ) {
            return true;
          }
        });

        if (findOverLayElement !== -1) {
          let data = dataTransfer?.current;
          let newMotionList = [...motionList!];

          if (newMotionList[findOverLayElement!].children !== undefined) {
            newMotionList[findOverLayElement!].children = [
              ...(newMotionList[findOverLayElement!].children ?? []),
              ...data?.motionList!,
            ];
          }
          let newBlockUpdateMotionList = newMotionList.filter((el) => {
            return el.id !== data?.id;
          });
          setMotionList?.(newBlockUpdateMotionList, true);
          if (playList?.isPlayListSart && playList?.blockId === item.id) {
            onPlayMotion?.({
              currentIndex: playList?.currentIndex!,
              blockId: item.id!,
              motionLists: newMotionList[index].children!,
              isPlayListSart: playList.isPlayListSart,
            });
          }
        }
        setMotionListCanMOve("static");
      }}
      onMouseLeave={(e) => {
        setMotionListCanMOve("static");
      }}
      onDrop={(e) => {
        e.stopPropagation();
        let data = dataTransfer?.current;
        let newMotionList = [...motionList!];

        newMotionList[index].children = [
          ...newMotionList[index].children!,
          ...data?.motionList!,
        ];
        setMotionList?.(newMotionList);
        setDragOver(false);
        if (playList?.isPlayListSart && playList?.blockId === item.id) {
          onPlayMotion?.({
            currentIndex: playList?.currentIndex!,
            blockId: item.id!,
            motionLists: newMotionList[index].children!,
            isPlayListSart: playList.isPlayListSart,
          });
        }
      }}
    >
      {item.children?.map((el, i) => {
        return (
          <li
            style={{ width: "fit-content", listStyleType: "none" }}
            key={el.type + i}
            className={
              isDragOver && i === (item.children?.length ?? 0) - 1
                ? "show-hover"
                : ""
            }
          >
            <ActionCard
              {...el}
              readonly={true}
              draggable={false}
              onChange={(value) => {
                let newMotionList = [...motionList!];
                newMotionList[index] = {
                  ...newMotionList[index],
                  children: [...newMotionList[index].children!].map(
                    (newMotion, childIndex) => {
                      if (childIndex === i) {
                        return { ...newMotion, value: value };
                      } else return newMotion;
                    }
                  ),
                };

                setMotionList?.(newMotionList);
              }}
            />
          </li>
        );
      })}
    </ul>
  );
};
