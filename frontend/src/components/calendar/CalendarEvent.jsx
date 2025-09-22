import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BreakdownModal from "./BreakdownModal";
import { useState } from "react";

export default function CalendarEvent(props) {
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);

  const { id, name, amount, type, breakdown } = props;

  const getEventColour = type => {
    switch (type) {
      case "deposit":
        return "blue";
      case "bill":
        return "red";
      case "payday":
        return "green";
    }
  };

  const calendarEventContent = (
    <div
      className={`flex w-full items-center rounded-md bg-${getEventColour(
        type
      )}-100 hover:bg-${getEventColour(
        type
      )}-200 px-2 py-1 text-xs font-normal text-${getEventColour(type)}-700`}>
      <svg
        className={`h-1.5 w-1.5 flex-shrink-0 fill-${getEventColour(type)}-500`}
        viewBox="0 0 6 6"
        aria-hidden="true">
        <circle cx={3} cy={3} r={3} />
      </svg>
      <div className="ml-1.5 w-0 flex-grow truncate text-left">
        <span className="truncate">{name}</span>
      </div>
      <div className="ml-2 flex-shrink-0">${parseFloat(amount.toFixed(2))}</div>
    </div>
  );

  return (
    <div className="flex group mb-1">
      {type === "deposit" ? (
        <>
          <Link
            className={`flex-grow`}
            onClick={event => {
              event.stopPropagation();
              setBreakdownModalOpen(true);
            }}>
            {calendarEventContent}
          </Link>

          <BreakdownModal
            breakdownModalOpen={breakdownModalOpen}
            setBreakdownModalOpen={setBreakdownModalOpen}
            breakdown={breakdown}
          />
        </>
      ) : (
        <Link to={`/${type}s/${id}`} className="flex-grow">
          {calendarEventContent}
        </Link>
      )}
    </div>
  );
}

CalendarEvent.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  breakdown: PropTypes.array,
};
