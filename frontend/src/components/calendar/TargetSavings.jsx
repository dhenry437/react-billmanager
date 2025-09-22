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
        onClick={event => {
          event.stopPropagation();
          setBreakdownModalOpen(true);
        }}
        className="text-gray-400 font-normal">
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
