import React from "react";

const SeatIndicator = ({
  seats,
}) => {
  return (
    <h4>
      {seats === 0
        ? "Fully Booked"
        : `Seats Left: ${seats}`}
    </h4>
  );
};

export default SeatIndicator;