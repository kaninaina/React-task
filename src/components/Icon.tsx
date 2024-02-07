import React from "react";

export default function Icon({ size = 20, className = "" }) {
  return (
    <svg
      className={`fill-current ${className}`}
      width={size.toString() + "px"}
      height={size.toString() + "px"}
    >
      <use xlinkHref={`/icons/solid.svg#$`} />
    </svg>
  );
}
