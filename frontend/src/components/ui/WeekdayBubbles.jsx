import PropTypes from "prop-types";
import WeekdayBubble from "./WeekdayBubble";

export default function WeekdayBubbles(props) {
  const { weekdays, setWeekdays } = props;

  return (
    <div className=" flex justify-center space-x-4">
      {weekdays.map((weekday, i) => (
        <WeekdayBubble
          key={i}
          weekday={weekday.name.charAt(0).toUpperCase()}
          selected={weekday.selected}
          setWeekdays={x =>
            setWeekdays(
              weekdays.map(y =>
                y.name === weekday.name ? { ...y, selected: x } : y
              )
            )
          }
        />
      ))}
    </div>
  );
}

WeekdayBubbles.propTypes = {
  weekdays: PropTypes.array.isRequired,
  setWeekdays: PropTypes.func.isRequired,
};
