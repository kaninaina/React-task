import React, { useContext, useRef } from "react";
import { ActionContext } from "../../contextHook/ActionContext";
import "./SideBar.css";
import { ActionCardProps, Coordination, LooksValue } from "../../Props";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { ActionCard } from "../ActionCard/ActionCard";
import { Space } from "../Contructs/UtilityComponent";
export default function Sidebar() {
  const { onUpdatePostion } = useContext(ActionContext);
  let timeOut = useRef<NodeJS.Timeout | null>(null);
  const motionLinkChildren: ActionCardProps[] = [
    {
      type: "move",
      readonly: false,
      value: 10,
      action: (value, sprite) => {
        const angleInRadians = (sprite?.rotateZ ?? 0) * (Math.PI / 180);
        const deltaX = (value as number) * Math.cos(angleInRadians);
        const deltaY = (value as number) * Math.sin(angleInRadians);
        const newX = (sprite?.coordinateX ?? 0) + deltaX;
        const newY = (sprite?.coordinateY ?? 0) + deltaY;
        onUpdatePostion?.({
          ...sprite!,
          coordinateX: newX,
          coordinateY: newY,
        });
      },
      render: (state, setState, color) => {
        return (
          <div className="action-card" style={{ backgroundColor: color }}>
            <p>move</p>
            <input
              type="text"
              value={state as number}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                setState(parseInt(!e.target.value ? "0" : e.target.value));
              }}
            />
            <p>steps</p>
          </div>
        );
      },
    },
    {
      readonly: false,
      type: "rotate",
      value: 15,
      action: (value, sprite) => {
        onUpdatePostion?.({
          ...sprite!,
          rotateZ:
            (sprite?.rotateZ ?? 0) + (value as number) > 360
              ? 0 + (value as number)
              : (sprite?.rotateZ ?? 0) + (value as number),
        });
      },
      render: (state, setState, color) => {
        return (
          <div className="action-card" style={{ backgroundColor: color }}>
            <Space size={6}>
              <p>turn</p>
              <FaArrowRotateRight />
            </Space>

            <input
              type="text"
              value={state as number}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onChange={(e) => {
                setState(parseInt(!e.target.value ? "0" : e.target.value));
              }}
            />
            <p>degree</p>
          </div>
        );
      },
    },
    {
      type: "rotate",
      readonly: false,
      value: 15,
      action: (value, sprite) => {
        onUpdatePostion?.({
          ...sprite!,
          rotateZ:
            (sprite?.rotateZ ?? 0) - (value as number) < 0
              ? 360 - (value as number)
              : (sprite?.rotateZ ?? 0) - (value as number),
        });
      },
      render: (state, setState, color) => {
        return (
          <div className="action-card" style={{ backgroundColor: color }}>
            <Space size={6}>
              <p>turn</p>
              <FaArrowRotateLeft />
            </Space>
            <input
              type="text"
              value={state as number}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onChange={(e) => {
                setState(parseInt(!e.target.value ? "0" : e.target.value));
              }}
            />
            <p>degree</p>
          </div>
        );
      },
    },
    {
      value: 15,
      type: "random",
      readonly: false,
      action: (value, sprite) => {
        onUpdatePostion?.({
          ...sprite!,
          coordinateX: Math.floor(Math.random() * 300),
          coordinateY: Math.floor(Math.random() * 700),
        });
      },
      render: (state, setState, color) => {
        return (
          <div className="action-card" style={{ backgroundColor: color }}>
            <p>got to random position</p>
          </div>
        );
      },
    },
    {
      type: "range",
      value: { x: 0, y: 0 },
      readonly: false,
      action: (value, sprite) => {
        onUpdatePostion?.({
          ...sprite!,
          coordinateX: (value as Coordination).x,
          coordinateY: (value as Coordination).y,
        });
      },
      render: (state, setState, color) => {
        return (
          <div className="action-card" style={{ backgroundColor: color }}>
            <p>go to</p>
            <Space size={6}>
              <p>X</p>
              <p>:</p>
              <input
                type="text"
                value={(state as Coordination).x}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  setState({
                    ...(state as Coordination),
                    x: parseInt(!e.target.value ? "0" : e.target.value),
                  });
                }}
              />
            </Space>
            <Space size={6}>
              <p>Y</p>
              <p>:</p>
              <input
                type="text"
                value={(state as Coordination).y}
                onClick={(e) => {
                  e.stopPropagation();
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  setState({
                    ...(state as Coordination),
                    y: parseInt(!e.target.value ? "0" : e.target.value),
                  });
                }}
              />
            </Space>
          </div>
        );
      },
    },
  ];
  const looksLinkChildren: ActionCardProps[] = [
    {
      type: "transition",
      value: { message: "hi", time: 1, open: false },
      readonly: false,
      action: (value, sprite, from) => {
        clearTimeout(timeOut.current!);

        let newValue = value as LooksValue;

        onUpdatePostion?.({
          ...sprite!,
          transitionTime: newValue.time,
          message: {
            description: newValue.message,
            open: true,
            time: newValue.time,
          },
        });
        const latestValue = sprite;
        if (from) {
          timeOut.current = setTimeout(() => {
            from?.();
          }, newValue.time * 1000);
        } else {
          timeOut.current = setTimeout(() => {
            onUpdatePostion?.({
              ...latestValue!,
              transitionTime: 0,
              message: {
                description: newValue.message,
                open: false,
              },
            });
          }, newValue.time * 1000);
        }
      },
      render: (state, setState, color) => {
        return (
          <div className="action-card" style={{ backgroundColor: color }}>
            <p>say </p>
            <input
              type="text"
              value={(state as LooksValue).message}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onFocus={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                setState({
                  ...(state as LooksValue),
                  message: e.target.value,
                });
              }}
            />
            <p>for</p>
            <input
              type="text"
              value={(state as LooksValue).time}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                setState({
                  ...(state as LooksValue),
                  time: parseInt(!e.target.value ? "0" : e.target.value),
                });
              }}
            />
            <p>sec</p>
          </div>
        );
      },
    },
  ];
  const navItems = [
    {
      id: "motion",
      title: "Motion",
      children: motionLinkChildren,
      color: "#4c97ff",
    },
    {
      id: "looks",
      title: "Looks",
      children: looksLinkChildren,
      color: "#9966ff",
    },
  ];
  return (
    <div className="side-nav-bar-container">
      <div className="nav-link-container">
        <nav>
          <ul>
            {navItems.map((el) => {
              return (
                <li className="active" key={el.id}>
                  <div style={{ backgroundColor: el.color }}></div>
                  <p>{el.title}</p>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="nav-item-container">
        {navItems.map((el) => {
          return (
            <div className="nav-item">
              <p>{el.title}</p>
              <ul>
                {el.children?.map((item, i) => {
                  return (
                    <li key={item.type + i}>
                      <ActionCard {...item} draggable={true} color={el.color} />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
