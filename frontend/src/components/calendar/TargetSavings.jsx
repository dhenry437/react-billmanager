import { useState } from "react";
import PropTypes from "prop-types";
import BreakdownModal from "./BreakdownModal";
import { Link } from "react-router-dom";

export default function TargetSavings(props) {
  const { targetSavings } = props;
  const { amount, breakdown } = targetSavings;

  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  return (
    <>
      <Link
        onClick={(event) => {
          event.stopPropagation();
          setBreakdownModalOpen(true);
        }}
        className="inline-flex items-center rounded-md bg-gray-50 hover:bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
        href="#"
      >
        ${parseFloat(amount?.toFixed(2))}
      </Link>

      <BreakdownModal
        breakdownModalOpen={breakdownModalOpen}
        setBreakdownModalOpen={setBreakdownModalOpen}
        breakdown={breakdown}
      />
    </>
  );
}

TargetSavings.propTypes = {
  targetSavings: PropTypes.object.isRequired,
};
