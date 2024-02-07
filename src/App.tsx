import React from "react";

import PreviewArea from "./components/Preview/PreviewArea";
import { LeftView } from "./components/LeftView/LeftView";

import { ContextProvider } from "./contextHook/ActionContext";
import "./App.css";
export default function App() {
  return (
    <ContextProvider>
      <div className="app-container">
        <div className="left-view-container">
          <LeftView />
        </div>
        <PreviewArea />
      </div>
    </ContextProvider>
  );
}
