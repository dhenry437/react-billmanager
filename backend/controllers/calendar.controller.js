const z = require("zod");
const { RRule } = require("rrule");
const { getEventsFromDb } = require("../services/event.service");
const { getMonthViewDates } = require("../services/calendar.service");

const getCalendarEvents = async (req, res) => {
  const { yearMonth } = req.params;

  try {
    // Get events for user
    const events = await getEventsFromDb(req.user.id);

    // Sort events into bills and paydays
    let bills = events.filter(x => x.type === "bill");
    let paydays = events.filter(x => x.type === "payday");

    // Get RRules for bills and paydays
    bills = bills.map(x => ({ ...x, rrule: RRule.fromString(x.rruleString) }));
    paydays = paydays.map(x => ({
      ...x,
      rrule: RRule.fromString(x.rruleString),
    }));

    // Get month view dates
    const monthViewDates = getMonthViewDates(yearMonth);

    // Get event occurrences for month view
    paydays = paydays.map(x => ({
      ...x,
      occurrences: x.rrule
        .between(new Date(monthViewDates[0]), new Date(monthViewDates.at(-1)))
        .flat(),
    }));
    bills = bills.map(x => ({
      ...x,
      occurrences: x.rrule
        .between(new Date(monthViewDates[0]), new Date(monthViewDates.at(-1)))
        .flat(),
    }));

    console.log(
      monthViewDates.map(x => ({
        date: x,
        events: { type: null, name: null, amount: null },
      }))
    );
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      alert: {
        type: "danger",
        heading: "DB error",
        message: "Check Node logs",
      },
    });
  }
};

module.exports = {
  getCalendarEvents,
};
