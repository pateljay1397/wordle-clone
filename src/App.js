import React, { useState, useEffect, useRef, useCallback } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { validateWord } from "./utils/validateWord";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WORD_LENGTH = 5;
const MAX_TURNS = 6;

function App() {
  const [guesses, setGuesses] = useState([]);
  const [statusMatrix, setStatusMatrix] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [pressedKey, setPressedKey] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [shakeRow, setShakeRow] = useState(null);
  const [keyStatuses, setKeyStatuses] = useState({});
  const keyTimeoutRef = useRef(null);

  const handleKeyPress = useCallback(
    async (e) => {
      if (gameOver) return;

      let key = e.key || e.target?.dataset.key || ""; // e.target?.dataset.key  is from UI button and e.key from physical keyboard

      key = key.toUpperCase();

      const flashPressedKey = (key) => {
        setTimeout(() => {
          setPressedKey(key);
        }, 10);

        clearTimeout(keyTimeoutRef.current);
        keyTimeoutRef.current = setTimeout(() => {
          setPressedKey(null);
        }, 100);
      };

      flashPressedKey(key);

      if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) {
          toast.dark("Not enough letters");
          setShakeRow(guesses.length);
          setTimeout(() => setShakeRow(null), 600);
          return;
        }

        const upperCurrentGuess = currentGuess.toUpperCase();

        const { isValid, score } = await validateWord(upperCurrentGuess);
        if (!isValid) {
          toast.dark("Not a valid word");
          setShakeRow(guesses.length);
          return;
        }

        const status = score.map((val) => {
          if (val === 2) return "correct";
          if (val === 1) return "present";
          return "absent";
        });

        const nextGuesses = [...guesses, upperCurrentGuess];
        const nextStatus = [...statusMatrix, status];

        setGuesses(nextGuesses);
        setStatusMatrix(nextStatus);
        setCurrentGuess("");
        updateKeyStatuses(upperCurrentGuess, status);

        if (isValid && score.every((s) => s === 2)) {
          setGameOver(true);
          toast.success("You Win Genius!");
        } else if (nextGuesses.length === MAX_TURNS) {
          setGameOver(true);
          toast.info(`${"You Lose. The word was ....."}`);
        }
      } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key.toUpperCase());
      }
    },
    [currentGuess, guesses, statusMatrix, gameOver]
  );

  const updateKeyStatuses = (guess, status) => {
    setKeyStatuses((prevStatuses) => {
      const updated = { ...prevStatuses };

      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const currentStatus = updated[letter];
        const newStatus = status[i];

        // Priority: correct > present > absent
        if (
          newStatus === "correct" ||
          (newStatus === "present" && currentStatus !== "correct") ||
          (!currentStatus && newStatus === "absent")
        ) {
          updated[letter] = newStatus;
        }
      }

      return updated;
    });
  };

  useEffect(() => {
    // Cleanup function to clear the key timeout when the component unmounts. Prevents state updates on an unmounted component which can cause memory leaks or warnings.
    return () => {
      if (keyTimeoutRef.current) {
        clearTimeout(keyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyPress(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="App">
      <h1>Wordle</h1>
      <img
        src="/logo192.png" // Replace this with the actual path to your Wordle logo
        alt="Wordle Logo"
        className="wordle-logo"
      />
      <Board
        guesses={guesses}
        currentGuess={currentGuess}
        statusMatrix={statusMatrix}
        shakeRow={shakeRow}
      />
      <Keyboard
        onKeyPress={handleKeyPress}
        pressedKey={pressedKey}
        keyStatuses={keyStatuses}
      />
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar />
    </div>
  );
}

export default App;
