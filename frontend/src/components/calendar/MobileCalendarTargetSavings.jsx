import { useState } from "react";
import PropTypes from "prop-types";
import BreakdownModal from "./BreakdownModal";

export default function MobileCalendarTargetSavings(props) {
  const { targetSavings } = props;
  const { amount, breakdown } = targetSavings || {};

  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);

  return (
    <li
      key="deposit"
      className="flex items-center p-4 pr-6 bg-gray-100 text-gray-800 font-medium"
    >
      <span className="flex-grow">{`There should be $${
        amount ? parseFloat(amount.toFixed(2)) : "---.--"
      } in your bills account at the close of day`}</span>
      <button
        onClick={() => setBreakdownModalOpen(true)}
        className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
      >
        Breakdown<span className="sr-only"></span>
      </button>

      {breakdown && (
        <BreakdownModal
          breakdownModalOpen={breakdownModalOpen}
          setBreakdownModalOpen={setBreakdownModalOpen}
          breakdown={breakdown}
        />
      )}
    </li>
  );
}

MobileCalendarTargetSavings.propTypes = {
  targetSavings: PropTypes.object,
};
