import Row from "./Row";
import "../styles/board.css";

const Board = ({ guesses, currentGuess, statusMatrix, shakeRow }) => {
  const rows = Array.from({ length: 6 }, (_, i) => {
    // 6 is MAX_TURNS to make guess
    if (i < guesses.length) {
      return (
        <Row
          key={i}
          guess={guesses[i]}
          status={statusMatrix[i]}
          shake={shakeRow === i}
        />
      );
    } else if (i === guesses.length) {
      return <Row key={i} guess={currentGuess} shake={shakeRow === i} />;
    } else {
      return <Row key={i} guess="" shake={shakeRow === i} />;
    }
  });

  return <div className="board">{rows}</div>;
};

export default Board;
