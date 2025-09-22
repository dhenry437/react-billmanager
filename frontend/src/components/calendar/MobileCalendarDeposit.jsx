import { useState } from "react";
import PropTypes from "prop-types";
import BreakdownModal from "./BreakdownModal";

export default function MobileCalendarDeposit(props) {
  const { deposit } = props;
  const { amount, breakdown } = deposit;

  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);

  return (
    <li
      key="deposit"
      className="group flex items-center p-4 pr-6 focus-within:bg-blue-200 hover:bg-blue-200 bg-blue-100 text-blue-800 font-medium">
      <span className="flex-grow">{`You need to deposit $${parseFloat(
        amount.toFixed(2)
      )}`}</span>
      <button
        onClick={setBreakdownModalOpen}
        className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100">
        Breakdown<span className="sr-only"></span>
      </button>

      <BreakdownModal
        breakdownModalOpen={breakdownModalOpen}
        setBreakdownModalOpen={setBreakdownModalOpen}
        breakdown={breakdown}
      />
    </li>
  );
}

MobileCalendarDeposit.propTypes = {
  deposit: PropTypes.object.isRequired,
};
