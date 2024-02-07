import MidArea from "../MidArea/MidArea";
import Sidebar from "../SideBar/Sidebar";
import React, { useState } from "react";
import "./LeftView.css";
const SvgComponent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    <title>{"Code V2"}</title>
    <path
      fill="#855CD6"
      fillRule="evenodd"
      d="M15 14.51a.5.5 0 0 1-.5.5H9.197a.495.495 0 0 0-.353.146l-.698.698a.5.5 0 0 1-.353.146H6.207a.5.5 0 0 1-.353-.146l-.698-.698a.497.497 0 0 0-.353-.146H3.5a.5.5 0 0 1-.5-.5V11.5a.5.5 0 0 1 .5-.5h1.293a.5.5 0 0 1 .353.146l.708.708a.5.5 0 0 0 .353.146h1.586a.5.5 0 0 0 .353-.146l.708-.708A.5.5 0 0 1 9.207 11H14.5a.5.5 0 0 1 .5.5v3.01Zm2-5a.5.5 0 0 1-.5.5H9.197a.495.495 0 0 0-.353.146l-.698.698a.5.5 0 0 1-.353.146H6.207a.5.5 0 0 1-.353-.146l-.698-.698a.497.497 0 0 0-.353-.146H3.5a.5.5 0 0 1-.5-.5V6.5a.5.5 0 0 1 .5-.5h1.293a.5.5 0 0 1 .353.146l.708.708A.5.5 0 0 0 6.207 7h1.586a.5.5 0 0 0 .353-.146l.708-.708A.5.5 0 0 1 9.207 6H16.5a.5.5 0 0 1 .5.5v3.01Z"
    />
  </svg>
);
export const LeftView = () => {
  const tabItems = [
    {
      id: "code",
      title: "Code",
      icon: <SvgComponent />,
      children: <Sidebar />,
    },
  ];
  const [activeTab, setActiveTab] = useState("code");
  return (
    <div className="container">
      <div className="side-bar-container">
        <div className="tab-header">
          <ul>
            {tabItems.map((el) => {
              return (
                <li key={el.id} className={activeTab === el.id ? "active" : ""}>
                  <div>{el.icon}</div>
                  <p>{el.title}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="tab-view">
          {tabItems.map((el) => {
            return (
              <div
                className={`tab-children-container ${
                  activeTab === el.id ? "active" : ""
                }`}
              >
                {el.children}
              </div>
            );
          })}
        </div>
      </div>

      <div className="workflow-container">
        <MidArea />
      </div>
    </div>
  );
};
