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
import CalendarEvents from "./calendar/CalendarEvents";
import Calendar from "./calendar/Calendar";

export default function Dashboard() {
  return (
    <div>
      <Calendar />
    </div>
  );
}
