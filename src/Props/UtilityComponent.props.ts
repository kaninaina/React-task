import React from "react";

export interface SpaceProps {
  size: number;
  children: React.ReactElement[] | React.ReactElement;
}

export interface If {
  children: React.ReactElement;
  condition: boolean;
}
