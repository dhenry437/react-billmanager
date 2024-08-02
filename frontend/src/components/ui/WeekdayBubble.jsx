import PropTypes from "prop-types";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function WeekdayBubble(props) {
  const { weekday, selected, setWeekdays } = props;

  return (
    <Switch
      checked={selected}
      onChange={setWeekdays}
      className={classNames(
        selected ? "bg-indigo-600 text-white" : "bg-gray-200",
        "inline-flex justify-center items-center h-8 w-8 text-sm font-semibold cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      )}>
      {weekday}
      <span className="sr-only">{weekday}</span>
    </Switch>
  );
}

WeekdayBubble.propTypes = {
  weekday: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  setWeekdays: PropTypes.func.isRequired,
};
