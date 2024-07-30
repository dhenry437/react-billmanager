import { Fragment, useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
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
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const today = format(new Date(), "yyyy-MM-dd", new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const yearMonth = format(new Date(), "yyyy-MM-");
  const calendarEvents = [
    {
      date: `${yearMonth}3`,
      events: [
        { time: "10AM", name: "Design review", href: "#" },
        { time: "2PM", name: "Sales meeting", href: "#" },
      ],
    },
    {
      date: `${yearMonth}20`,
      events: [{ time: "6PM", name: "Date night", href: "#" }],
    },
    {
      date: `${yearMonth}14`,
      events: [{ time: "2PM", name: "Sam's birthday party", href: "#" }],
    },
    {
      date: `${yearMonth}27`,
      events: [
        { time: "3PM", name: "Maple syrup museum", href: "#" },
        { time: "7PM", name: "Hockey game", href: "#" },
        { time: "11PM", name: "Revolver Upstairs", href: "#" },
      ],
    },
    {
      date: `${yearMonth}4`,
      events: [{ time: "9PM", name: "Cinema with friends", href: "#" }],
    },
  ];
  const firstDayOfMonth = startOfMonth(selectedDate);
  const monthViewDates = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  }).map(x => format(x, "yyyy-MM-dd"));
  // Map calendar events to dates
  const calendarDates = monthViewDates.map(x => ({
    date: x,
    events:
      calendarEvents.find(y =>
        isEqual(
          parse(y.date, "yyyy-MM-dd", new Date()),
          parse(x, "yyyy-MM-dd", new Date())
        )
      )?.events || null,
  }));

  // Should only fire when month view changes
  const monthAndYear = format(selectedDate, "yyyy-MM");
  useEffect(() => {
    console.log("useEffect() in Dashboard");
    console.log(`monthAndYear = ${monthAndYear}`);
  }, [monthAndYear]);

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

  const handleClickLink = (e, href) => {
    e.stopPropagation();
    navigate(href);
  };

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8">
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
                <button
                  type="button"
                  className="ml-6 rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Add bill
                </button>
                <button
                  type="button"
                  className="ml-4 rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Add payday
                </button>
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
                          <a
                            href="#"
                            className={classNames(
                              focus
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}>
                            Add bill
                          </a>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <a
                            href="#"
                            className={classNames(
                              focus
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}>
                            Add payday
                          </a>
                        )}
                      </MenuItem>
                    </div>
                    <div className="py-1">
                      <MenuItem>
                        {({ focus }) => (
                          <a
                            href="#"
                            className={classNames(
                              focus
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}>
                            Go to today
                          </a>
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
                  {Array.from(weekday)[0].toUpperCase()}
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
                  const { date, events } = calendarDate;
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
                      {events && (
                        <>
                          <ol className="mt-2 w-full hidden lg:block">
                            {events.slice(0, 2).map((event, i) => {
                              const { time, name } = event;

                              return (
                                <a
                                  key={i}
                                  onClick={e => handleClickLink(e, event.href)}
                                  className="hover:visible flex group">
                                  <p className="flex-1 truncate font-medium text-left text-gray-900 group-hover:text-indigo-600">
                                    {name}
                                  </p>
                                  <time
                                    dateTime={`${date} ${time}`}
                                    className="ml-3 hidden flex-none text-gray-500 font-normal group-hover:text-indigo-600 xl:block">
                                    {time}
                                  </time>
                                </a>
                              );
                            })}
                            {events?.length > 2 && (
                              <li className="text-gray-500">
                                + {events.length - 2} more
                              </li>
                            )}
                          </ol>
                          <span className="-mx-0.5 mt-auto flex flex-wrap-reverse lg:hidden">
                            {events.map((_, i) => (
                              <span
                                key={i}
                                className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
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
          {calendarDates.find(x => x.date === selectedDate).events?.length >
          0 ? (
            <div className="px-4 py-10 sm:px-6 lg:hidden">
              <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
                {calendarDates
                  .find(x => x.date === selectedDate)
                  .events.map((event, i) => (
                    <li
                      key={i}
                      className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                      <div className="flex-auto">
                        <p className="font-semibold text-gray-900">
                          {event.name}
                        </p>
                        <time
                          dateTime={`${event.date} ${event.time}`}
                          className="mt-2 flex items-center text-gray-700">
                          <ClockIcon
                            className="mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {event.time}
                        </time>
                      </div>
                      <Link
                        to={event.href}
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
