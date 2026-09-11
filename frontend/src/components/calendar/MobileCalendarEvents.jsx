import PropTypes from "prop-types";
import MobileCalendarEvent from "./MobileCalendarEvent";
import MobileCalendarDeposit from "./MobileCalendarDeposit";
import MobileCalendarTargetSavings from "./MobileCalendarTargetSavings";

export default function MobileCalendarEvents(props) {
  const { events, getEventColour, targetSavings } = props;
  return (
    <div className="px-4 py-10 sm:px-6 lg:hidden">
      <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
        <MobileCalendarTargetSavings targetSavings={targetSavings} />

        {events.map(event => {
          const { id, type, name, description, amount } = event;

          return (
            <MobileCalendarEvent
              key={id}
              id={id}
              name={name}
              description={description}
              amount={amount}
              type={type}
              getEventColour={getEventColour}
            />
          );
        })}

        {events.length > 0 ? (
          events
            .filter(x => x.deposit)
            .map((event, i) => {
              const { deposit } = event;

              return <MobileCalendarDeposit key={i} deposit={deposit} />;
            })
        ) : (
          <div className="flex justify-center p-5">
            <p className="font-medium text-gray-500">Nothing on for the day</p>
          </div>
        )}
      </ol>
    </div>
  );
}

MobileCalendarEvents.propTypes = {
  events: PropTypes.array.isRequired,
  getEventColour: PropTypes.func.isRequired,
  targetSavings: PropTypes.object,
};
