import { SpaceProps, If as props } from "../../Props/UtilityComponent.props";
import "./UtilityCompoment.css";
export const Space = (props: SpaceProps) => {
  return (
    <div className="space-flex-container" style={{ gap: `${props.size}px` }}>
      {props.children}
    </div>
  );
};

export const If = (props: props) => {
  return <>{props.condition && props.children}</>;
};
