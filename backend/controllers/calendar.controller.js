const z = require("zod");
const { RRule } = require("rrule");
const { getEventsFromDb } = require("../services/event.service");
const { getMonthViewDates } = require("../services/calendar.service");
const { format } = require("date-fns");

const getCalendarEvents = async (req, res) => {
  const { yearMonth } = req.params;

  try {
    // Get events for user
    let events = await getEventsFromDb(req.user.id);

    // Keep only required properties
    events = events.map(
      ({ id, name, description, amount, type, rruleString }) => ({
        id,
        name,
        description,
        amount,
        type,
        rruleString,
      })
    );

    // Get RRules
    events = events.map(x => ({
      ...x,
      rrule: RRule.fromString(x.rruleString),
    }));

    // Get month view dates
    const monthViewDates = getMonthViewDates(yearMonth);

    // Get event occurrences for month view
    events = events.map(x => ({
      ...x,
      occurrences: x.rrule
        .between(new Date(monthViewDates[0]), new Date(monthViewDates.at(-1)))
        .flat(),
    }));

    // const monthViewEvents = events
    //   .map(x =>
    //     x.occurrences
    //       .map(y => ({
    //         [format(y, "yyyy-MM-dd")]: {
    //           name: x.name,
    //           description: x.description,
    //           type: x.type,
    //           amount: x.amount,
    //         },
    //       }))
    //       .flat()
    //   )
    //   .flat();

    let monthViewEvents = {};
    events.forEach(event =>
      event.occurrences.forEach(occurrence => {
        (monthViewEvents[format(occurrence, "yyyy-MM-dd")] =
          monthViewEvents[format(occurrence, "yyyy-MM-dd")] || []).push({
          id: event.id,
          name: event.name,
          description: event.description,
          type: event.type,
          amount: event.amount,
        });
      })
    );

    res.send({ monthViewEvents });

    // Sort events into bills and paydays
    // let bills = events.filter(x => x.type === "bill");
    // let paydays = events.filter(x => x.type === "payday");
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
