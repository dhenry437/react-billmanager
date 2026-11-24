import PropTypes from "prop-types";
import { Fragment, useContext } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { format, isValid, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { formatCurrency, titleCase } from "../../util";
import AuthContext from "../../hooks/AuthContext";

export default function DayEventsModal(props) {
  const { privacyMode } = useContext(AuthContext);
  const { dayEventsModalOpen, setDayEventsModalOpen, date, events } = props;

  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  const formattedDate =
    parsedDate && isValid(parsedDate)
      ? format(parsedDate, "EEEE, d MMMM yyyy")
      : date;

  const getEventColour = (type) => {
    switch (type) {
      case "deposit":
        return "blue";
      case "bill":
        return "red";
      case "payday":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Transition show={dayEventsModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setDayEventsModalOpen}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] w-full max-w-md transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                <div className="flex items-start justify-between pb-3 border-b border-gray-200">
                  <div>
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {formattedDate}
                    </DialogTitle>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {events.length} {events.length === 1 ? "event" : "events"}{" "}
                      scheduled
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setDayEventsModalOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 overflow-y-auto flex-1 min-h-0">
                  <ul role="list" className="space-y-2">
                    {events.map((event) => {
                      const { id, name, description, amount, type } = event;
                      const colour = getEventColour(type);

                      return (
                        <li key={`${type}-${id}`}>
                          <Link
                            to={`/${type}s/${id}`}
                            className={`flex items-center justify-between rounded-md bg-${colour}-100 hover:bg-${colour}-200 px-3 py-2.5 text-sm text-${colour}-700 transition-colors`}
                          >
                            <div className="flex items-center min-w-0 flex-1 pr-3">
                              <svg
                                className={`h-2 w-2 flex-shrink-0 fill-${colour}-500`}
                                viewBox="0 0 6 6"
                                aria-hidden="true"
                              >
                                <circle cx={3} cy={3} r={3} />
                              </svg>
                              <div className="ml-2.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium truncate">
                                    {name}
                                  </span>
                                  <span className="text-xs opacity-75">
                                    ({titleCase(type)})
                                  </span>
                                </div>
                                {description && (
                                  <p className="text-xs opacity-80 truncate mt-0.5">
                                    {description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {!(privacyMode && type === "payday") && (
                              <div className="flex-shrink-0 font-semibold">
                                {formatCurrency(amount)}
                              </div>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-5 sm:mt-6 flex items-center shrink-0">
                  <button
                    type="button"
                    className="inline-flex flex-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setDayEventsModalOpen(false)}
                  >
                    Go back to dashboard
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

DayEventsModal.propTypes = {
  dayEventsModalOpen: PropTypes.bool.isRequired,
  setDayEventsModalOpen: PropTypes.func.isRequired,
  date: PropTypes.string,
  events: PropTypes.array.isRequired,
};
