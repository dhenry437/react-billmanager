import PropTypes from "prop-types";
import CalendarEvent from "./CalendarEvent";

export default function CalendarEvents(props) {
  const { events } = props;

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

  return (
    <>
      {events.length > 0 && (
        <>
          <ol className="mt-2 w-full hidden lg:block">
            {events
              .filter(x => x.deposit)
              ?.map(event => {
                const { amount, breakdown } = event.deposit;

                return (
                  <>
                    <CalendarEvent
                      key="deposit"
                      name="Deposit"
                      amount={amount}
                      type="deposit"
                      breakdown={breakdown}
                    />
                  </>
                );
              })}
            {events.slice(0, 2).map(event => {
              const { type, id, amount, name } = event;

              return (
                <CalendarEvent
                  key={id}
                  id={id}
                  name={name}
                  amount={amount}
                  type={type}
                />
              );
            })}
            {events.length > 2 && (
              <li className="text-gray-500">+ {events.length - 2} more</li>
            )}
          </ol>
          <span className="-mx-0.5 mt-auto flex flex-wrap-reverse lg:hidden">
            {events.map(event => {
              const { id } = event;
              return (
                <span
                  key={id}
                  className={`mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-${getEventColour(
                    event.type
                  )}-400`}
                />
              );
            })}
          </span>
        </>
      )}
    </>
  );
}

CalendarEvents.propTypes = {
  events: PropTypes.array.isRequired,
};
