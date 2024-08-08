const {
  startOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  format,
} = require("date-fns");

const getMonthViewDates = yearMonth => {
  const firstDayOfMonth = startOfMonth(yearMonth);
  const monthViewDates = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  }).map(x => format(x, "yyyy-MM-dd"));

  return monthViewDates;
};

module.exports = {
  getMonthViewDates,
};
