import { useRef, useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { CommentBoxProps } from "../../Props";

export const CommentBox = (
  props: CommentBoxProps & {
    onDelete: (id: string) => void;
    onChange: (value: CommentBoxProps) => void;
    onCommentBoxMove: (e: React.MouseEvent) => void;
  }
) => {
  const commentBoxCanMove = useRef<boolean>(false);
  const [isExpand, setExpand] = useState(true);
  const { onDelete, onChange, ...restProps } = props;
  return (
    <div
      className="comment-box"
      style={{
        position: "absolute",
        left: `${props.postion.x}px`,
        top: `${props.postion.y}px`,
        zIndex: 1,
      }}
    >
      <div
        className="comment-box-header"
        onMouseMove={(e) => {
          if (commentBoxCanMove.current) {
            props.onCommentBoxMove(e);
          }
        }}
        onMouseDown={() => {
          commentBoxCanMove.current = true;
        }}
        onMouseUp={(e) => {
          commentBoxCanMove.current = false;
        }}
        onMouseLeave={(e) => {
          commentBoxCanMove.current = false;
        }}
      >
        <div
          onClick={() => {
            setExpand(!isExpand);
          }}
        >
          {isExpand ? <GoTriangleDown /> : <GoTriangleUp />}
        </div>
        <div
          onClick={() => {
            props.onDelete(props.id);
          }}
        >
          X
        </div>
      </div>
      {isExpand && (
        <div className="comment-box-input">
          <textarea
            placeholder="Type comment here ..."
            value={props.description}
            onChange={(e) => {
              props.onChange({ ...restProps, description: e.target.value });
            }}
          />
        </div>
      )}
    </div>
  );
};
