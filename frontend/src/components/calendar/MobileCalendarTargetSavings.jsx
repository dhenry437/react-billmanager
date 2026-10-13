import { useState } from "react";
import PropTypes from "prop-types";
import BreakdownModal from "./BreakdownModal";
import { formatCurrency } from "../../util";

export default function MobileCalendarTargetSavings(props) {
  const { targetSavings } = props;
  const { amount, breakdown } = targetSavings || {};

  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);

  return (
    <li
      key="deposit"
      className="flex items-center p-4 pr-6 bg-gray-100 text-gray-800 font-medium"
    >
      <div className="flex-grow">
        <span>{`There should be ${formatCurrency(
          amount
        )} in your bills account at the close of day`}</span>
      </div>
      <button
        type="button"
        onClick={() => setBreakdownModalOpen(true)}
        className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Breakdown<span className="sr-only"></span>
      </button>

      {targetSavings && (
        <BreakdownModal
          breakdownModalOpen={breakdownModalOpen}
          setBreakdownModalOpen={setBreakdownModalOpen}
          breakdown={breakdown}
          targetSavings={targetSavings}
        />
      )}
    </li>
  );
}

MobileCalendarTargetSavings.propTypes = {
  targetSavings: PropTypes.object,
};
