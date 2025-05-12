import React, { useEffect, useRef, useMemo } from "react";
import "../styles/keyboard.css";
import { ReactComponent as BackspaceIcon } from "../assets/BackspaceIcon.svg";

const Keyboard = ({ onKeyPress, pressedKey, keyStatuses }) => {
  const keyRefs = useRef({});

  // Used useMemo to prevent rows to re-create them on every render.
  const rows = useMemo(
    () => [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
    ],
    []
  );

  useEffect(() => {
    if (!pressedKey) return;

    const upperKey = pressedKey.toUpperCase();
    const el = keyRefs.current[upperKey];
    if (!el) return;

    // Forcefully restart animation
    el.classList.remove("key-animate");

    // Used requestAnimationFrame to ensure reflow is complete before re-adding
    requestAnimationFrame(() => {
      el.classList.add("key-animate");

      const handleAnimationEnd = () => {
        el.classList.remove("key-animate");
        el.removeEventListener("animationend", handleAnimationEnd);
      };

      el.addEventListener("animationend", handleAnimationEnd);
    });
  }, [pressedKey]);

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((letter) => {
            const status = keyStatuses[letter] || "";
            return (
              <button
                key={letter}
                ref={(el) => (keyRefs.current[letter.toUpperCase()] = el)}
                className={`key-button key ${status}`}
                data-key={letter}
                onClick={onKeyPress}
              >
                {letter === "BACKSPACE" ? (
                  <BackspaceIcon
                    width={20}
                    height={20}
                    style={{ color: "#222" }}
                    aria-label="Backspace"
                  />
                ) : (
                  letter
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
