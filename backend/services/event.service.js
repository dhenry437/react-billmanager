const db = require("../db");
const Sequelize = db.Sequelize;
const Event = db.events;

const { datetime, RRule, RRuleSet, rrulestr } = require("rrule");
const { getDate, format } = require("date-fns");
const { getOrdinalOfMonth } = require("../util");
const { where } = require("sequelize");

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

const updateEventInDb = async (id, userId, fields) => {
  const event = await Event.findOne({ where: { id, userId } });

  if (!event) {
    console.log(`--\nERROR: User ${userId} tried to update event ${id}\n--`);
  }

  return await event.update(fields);
};

const getEventsFromDb = async (userId, search) => {
  return await Event.findAll({
    where: { userId, ...(search && search) },
    attributes: [
      "id",
      "name",
      "description",
      "amount",
      "rruleString",
      "reactState",
    ],
    raw: true,
  });
};

const deleteEventFromDb = async (id, userId) => {
  const event = await Event.findOne({ where: { id, userId } });

  if (!event) {
    console.log(`--\nERROR: User ${userId} tried to delete event ${id}\n--`);
  }

  await event.destroy();

  return event;
};

module.exports = {
  createRRule,
  createEventInDb,
  updateEventInDb,
  getEventsFromDb,
  deleteEventFromDb,
};
