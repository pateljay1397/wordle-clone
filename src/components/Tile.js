import "../styles/tile.css";

const Tile = ({ letter, status, index = 0 }) => {
  const flip = status ? "flip" : "";

  return (
    <div
      className={`tile ${flip} ${status}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {letter}
    </div>
  );
};

export default Tile;
