const {
  getWeeksInMonth,
  differenceInWeeks,
  startOfMonth,
} = require("date-fns");

const getOrdinalOfMonth = date => {
  const nWeeksDiff = differenceInWeeks(date, startOfMonth(date));

  return nWeeksDiff + 1 === getWeeksInMonth(date) ? -1 : nWeeksDiff + 1;
};

const titleCase = str => {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};

module.exports = { getOrdinalOfMonth, titleCase };
