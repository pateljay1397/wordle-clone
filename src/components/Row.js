import React from "react";
import Tile from "./Tile";
import "../styles/row.css";

const Row = ({ guess = "", status = [], shake = false }) => {
  return (
    <div className={`row ${shake ? "shake" : ""}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Tile
          key={i}
          letter={guess[i] || ""}
          status={status[i] || ""}
          index={i}
        />
      ))}
    </div>
  );
};

export default Row;
