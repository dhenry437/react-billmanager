import { useState } from "react";
import PropTypes from "prop-types";
import CalendarEvent from "./CalendarEvent";
import DayEventsModal from "./DayEventsModal";

export default function CalendarEvents(props) {
  const { events, date } = props;
  const [dayEventsModalOpen, setDayEventsModalOpen] = useState(false);

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

  const sortedEvents = [...events].sort(
    (a, b) => (a.type === "payday" ? 0 : 1) - (b.type === "payday" ? 0 : 1)
  );

  const MAX_ITEMS_IN_CELL = 3;
  const shouldCollapse = sortedEvents.length > MAX_ITEMS_IN_CELL;
  const visibleEvents = shouldCollapse
    ? sortedEvents.slice(0, MAX_ITEMS_IN_CELL - 1)
    : sortedEvents;
  const hiddenCount = shouldCollapse
    ? sortedEvents.length - visibleEvents.length
    : 0;

  return (
    <>
      {sortedEvents.length > 0 && (
        <>
          {/* -- Desktop -- */}
          <ol className="mt-2 w-full hidden lg:block">
            {sortedEvents
              .filter(x => x.deposit)
              ?.map(event => {
                const { amount, breakdown } = event.deposit;

                return (
                  <CalendarEvent
                    key="deposit"
                    name="Deposit"
                    amount={amount}
                    type="deposit"
                    breakdown={breakdown}
                  />
                );
              })}
            {visibleEvents.map(event => {
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
            {hiddenCount > 0 && (
              <li
                onClick={event => {
                  event.stopPropagation();
                  setDayEventsModalOpen(true);
                }}
                className="text-center font-normal text-gray-500 hover:text-indigo-600"
              >
                + {hiddenCount} more
              </li>
            )}
          </ol>
          {hiddenCount > 0 && (
            <DayEventsModal
              dayEventsModalOpen={dayEventsModalOpen}
              setDayEventsModalOpen={setDayEventsModalOpen}
              date={date}
              events={sortedEvents}
            />
          )}
          {/*  -- Dots for Mobile -- */}
          <span className="-mx-0.5 mt-auto flex flex-wrap-reverse lg:hidden">
            {sortedEvents
              .filter(x => x.deposit)
              ?.map(event => {
                const { id } = event;
                return (
                  <span
                    key={id}
                    className={`mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-${getEventColour(
                      "deposit"
                    )}-400`}
                  />
                );
              })}
            {sortedEvents.map(event => {
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
  date: PropTypes.string,
};
