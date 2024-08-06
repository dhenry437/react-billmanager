import { differenceInWeeks, getWeeksInMonth, startOfMonth } from "date-fns";

export const titleCase = str => {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};

export const sentenceCase = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const ordinalSuffix = i => {
  let j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
};

export const getOrdinalWeekdayOfMonth = date => {
  const nWeeksDiff = differenceInWeeks(date, startOfMonth(date));

  return nWeeksDiff + 1 === getWeeksInMonth(date)
    ? "last"
    : ordinalSuffix(nWeeksDiff + 1);
};
