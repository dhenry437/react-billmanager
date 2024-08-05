const db = require("../db");
const Sequelize = db.Sequelize;
const Event = db.events;

const { datetime, RRule, RRuleSet, rrulestr } = require("rrule");
const { getDate, format } = require("date-fns");
const { getOrdinalOfMonth } = require("../util");

const freqDictionary = {
  days: RRule.DAILY,
  weeks: RRule.WEEKLY,
  months: RRule.MONTHLY,
  years: RRule.YEARLY,
};

const weekdayDictionary = {
  sun: RRule.SU,
  mon: RRule.MO,
  tue: RRule.TU,
  wed: RRule.WE,
  thu: RRule.TH,
  fri: RRule.FR,
  sat: RRule.SA,
};

const createRRule = fields => {
  const {
    date,
    recurringDays,
    recurringEnds,
    recurringEndsAfterN,
    recurringEndsOnDate,
    recurringFrequency,
    recurringMonthly,
    recurringN,
  } = fields;

  let count = null;
  let until = null;
  if (recurringEnds === "on") {
    until = new Date(recurringEndsOnDate);
  } else if (recurringEnds === "after") {
    count = recurringEndsAfterN;
  }

  let byweekday = null;
  let bymonthday = null;
  let bysetpos = null;
  if (recurringFrequency === "weeks") {
    byweekday = recurringDays
      .filter(x => x.selected === true)
      .map(x => weekdayDictionary[x.name]);
  } else if (recurringFrequency === "months") {
    if (recurringMonthly === "nth") {
      bysetpos = getOrdinalOfMonth(date);
      byweekday = weekdayDictionary[format(date, "E").toLowerCase()];
    } else if (recurringMonthly === "date") {
      bymonthday = getDate(date);
    }
  }

  const rule = new RRule({
    wkst: RRule.SU,
    dtstart: new Date(date),
    freq: freqDictionary[recurringFrequency],
    interval: recurringN,
    until,
    count,
    byweekday,
    bymonthday,
    bysetpos,
  });

  return rule;
};

const createEventInDb = async event => {
  return await Event.create(event);
};

const getEventsByUserFromDb = async userId => {
  return await Event.findAll({ where: { userId } });
};

module.exports = {
  createRRule,
  createEventInDb,
  getEventsByUserFromDb,
};
