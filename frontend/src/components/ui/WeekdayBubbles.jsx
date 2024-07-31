import PropTypes from "prop-types";
import WeekdayBubble from "./WeekdayBubble";

export default function WeekdayBubbles(props) {
  const { weekdays, selected, setSelected } = props;

  return (
    <div className=" flex justify-center space-x-4">
      {weekdays.map((weekday, i) => (
        <WeekdayBubble
          key={i}
          weekday={weekday.charAt(0).toUpperCase()}
          selected={selected.includes(weekday)}
          setSelected={x => (x ? true : false)}
        />
      ))}
    </div>
  );
}

WeekdayBubbles.propTypes = {
  weekdays: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};
