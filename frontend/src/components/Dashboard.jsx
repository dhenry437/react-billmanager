import { Fragment, useCallback, useEffect, useState } from "react";
import { titleCase } from "../util";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Link } from "react-router-dom";
import { getCalendarEvents } from "../data/repository";

export default function Dashboard() {
  const today = format(new Date(), "yyyy-MM-dd", new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState([]);

  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const firstDayOfMonth = startOfMonth(selectedDate);
  const monthViewDates = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  }).map(x => format(x, "yyyy-MM-dd"));
  // Map calendar events to dates
  const calendarDates = monthViewDates.map(x => ({
    date: x,
    events: null,
  }));

  const getEventColour = type => {
    return type === "bill" ? "red" : "green";
  };

  // Should only fire when month view changes
  const fetchEvents = useCallback(async yearMonth => {
    const response = await getCalendarEvents(yearMonth);

    if (response.status === 200) {
      const { monthViewEvents } = response.data;

      if (monthViewEvents) {
        setEvents(monthViewEvents);
      }
    }
  }, []);

  const yearMonth = format(selectedDate, "yyyy-MM");
  useEffect(() => {
    fetchEvents(yearMonth);
  }, [fetchEvents, yearMonth]);

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const handleClickCell = date => {
    setSelectedDate(date);
  };

  const handleClickNextMonth = () => {
    setSelectedDate(format(addMonths(selectedDate, 1), "yyyy-MM-dd"));
  };

  const handleClickPreviousMonth = () => {
    setSelectedDate(format(addMonths(selectedDate, -1), "yyyy-MM-dd"));
  };

  const handleClickToday = () => {
    setSelectedDate(today);
  };

  return (
    <div>
      <div className="bg-gray-50 border border-gray-200 lg:h-0 lg:min-h-[742px] rounded-md">
        <div className="lg:flex lg:h-full lg:flex-col">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              <time dateTime={format(selectedDate, "yyyy-MM")}>
                {format(selectedDate, "MMMM yyyy")}
              </time>
            </h1>
            <div className="flex items-center">
              <div className="relative flex items-center rounded-md md:mr-6  bg-white shadow-sm md:items-stretch">
                <div
                  className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-300"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={handleClickPreviousMonth}
                  className="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 md:w-9 md:px-2 md:hover:bg-gray-50">
                  <span className="sr-only">Previous month</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleClickToday}
                  className="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 md:block">
                  Today
                </button>
                <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
                <button
                  type="button"
                  onClick={handleClickNextMonth}
                  className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 md:w-9 md:px-2 md:hover:bg-gray-50">
                  <span className="sr-only">Next month</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden  md:flex md:items-center">
                {/* Vertical divider */}
                <div className="h-6 w-px bg-gray-300" />
                <Link
                  to="/bills/add"
                  className="ml-6 rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Add bill
                </Link>
                <Link
                  to="/paydays/add"
                  className="ml-4 rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Add payday
                </Link>
              </div>
              <Menu as="div" className="relative ml-6 md:hidden">
                {/* Vertical divider */}
                <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Open menu</span>
                  <EllipsisHorizontalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </MenuButton>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <MenuItems className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <MenuItem>
                        {({ focus }) => (
                          <Link
                            to="/bills/add"
                            className={classNames(
                              focus
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}>
                            Add bill
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <Link
                            to="/paydays/add"
                            className={classNames(
                              focus
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}>
                            Add payday
                          </Link>
                        )}
                      </MenuItem>
                    </div>
                    <div className="py-1">
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            onClick={handleClickToday}
                            className={classNames(
                              focus
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}>
                            Go to today
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </header>
          <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
            <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
              {weekdays.map(weekday => (
                <div key={weekday} className="bg-white py-2">
                  {/* First letter only */}
                  {weekday.charAt(0).toUpperCase()}
                  <span className="sr-only sm:not-sr-only">
                    {/* The rest */}
                    {weekday.substring(1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
              <div className={`w-full grid grid-cols-7 auto-rows-fr gap-px`}>
                {calendarDates.map(calendarDate => {
                  const { date } = calendarDate;
                  const isCurrentMonth = isSameMonth(date, selectedDate);
                  const isSelectedDate = isSameDay(date, selectedDate);
                  const isCurrentDate = isToday(date);

                  return (
                    <button
                      key={format(date, "yyyy-MM-dd")}
                      onClick={() => handleClickCell(date)}
                      className={`${
                        isCurrentMonth
                          ? isSelectedDate
                            ? "bg-white font-semibold text-white"
                            : isCurrentDate
                            ? "bg-white font-semibold text-indigo-600"
                            : "bg-white text-gray-900"
                          : isSelectedDate
                          ? "font-semibold text-white bg-gray-50"
                          : "bg-gray-50 text-gray-500"
                      } flex flex-col px-3 py-2 h-14 hover:bg-gray-100 focus:z-10 w-full lg:h-full`}>
                      <time
                        className={`${
                          isSelectedDate
                            ? `flex h-6 w-6 items-center justify-center rounded-full ${
                                isCurrentDate ? "bg-indigo-600" : "bg-gray-900"
                              }`
                            : ""
                        } ml-auto lg:ml-0`}
                        dateTime={format(date, "yyyy-MM-dd")}>
                        {getDate(date)}
                      </time>
                      {events[date] && (
                        <>
                          <ol className="mt-2 w-full hidden lg:block">
                            {events[date].slice(0, 2).map((event, i) => {
                              const { type, id, amount, name } = event;

                              return (
                                <Link
                                  to={`/${type}s/${id}`}
                                  key={i}
                                  className={`flex group`}>
                                  <p
                                    className={`me-1 bg-${getEventColour(
                                      type
                                    )}-600 rounded-md text-white font-medium px-1.5 hidden xl:block`}>
                                    {titleCase(type)}
                                  </p>
                                  <p
                                    className={`me-1 bg-${getEventColour(
                                      type
                                    )}-600 rounded-md text-white font-medium px-1.5 xl:hidden`}>
                                    {titleCase(type).charAt(0)}
                                  </p>
                                  <p className="flex-1 truncate font-medium text-left text-gray-900 group-hover:text-indigo-600">
                                    {name}
                                  </p>
                                  <p className="ml-0.5 flex-none text-gray-500 font-normal group-hover:text-indigo-600">
                                    ${amount}
                                  </p>
                                </Link>
                              );
                            })}
                            {events?.length > 2 && (
                              <li className="text-gray-500">
                                + {events[date].length - 2} more
                              </li>
                            )}
                          </ol>
                          <span className="-mx-0.5 mt-auto flex flex-wrap-reverse lg:hidden">
                            {events[date].map((event, i) => (
                              <span
                                key={i}
                                className={`mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-${getEventColour(
                                  event.type
                                )}-400`}
                              />
                            ))}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {events[selectedDate] ? (
            <div className="px-4 py-10 sm:px-6 lg:hidden">
              <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
                {events[selectedDate].map((event, i) => (
                  <li
                    key={i}
                    className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                    <div className="flex-auto">
                      <p className="font-semibold text-gray-900">
                        <span
                          className={`bg-${getEventColour(
                            event.type
                          )}-600 rounded-md px-3 text-white me-1`}>
                          {titleCase(event.type)}
                        </span>
                        {event.name}
                      </p>
                      <p className="text-gray-800">{event.description}</p>
                      <p className="mt-2 text-gray-700">${event.amount}</p>
                    </div>
                    <Link
                      to={`/${event.type}s/${event.id}`}
                      className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100">
                      Edit<span className="sr-only">, {event.name}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="px-4 py-10 sm:px-6 lg:hidden">
              <div className="flex justify-center">
                <p className="font-medium text-gray-500">
                  Nothing on for the day
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
