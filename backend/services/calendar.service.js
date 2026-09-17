const {
  startOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  format,
} = require("date-fns");

const getMonthViewDates = (yearMonth, weekStartsOn = 1) => {
  const firstDayOfMonth = startOfMonth(yearMonth);
  const monthViewDates = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { weekStartsOn }),
    end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn }),
  }).map(x => format(x, "yyyy-MM-dd"));

  return monthViewDates;
};

module.exports = {
  getMonthViewDates,
};
