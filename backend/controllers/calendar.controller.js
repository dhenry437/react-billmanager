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

    // Push event occurrences into monthView
    let monthViewEvents = [];
    events.forEach(event =>
      event.occurrences.forEach(occurrence => {
        monthViewEvents.push({
          date: format(occurrence, "yyyy-MM-dd"),
          id: event.id,
          name: event.name,
          description: event.description,
          type: event.type,
          amount: event.amount,
          rrule: event.rrule,
        });
      })
    );

    let depositEvents = calculateDepositEvents(monthViewEvents, events);
    if (depositEvents) {
      // Add deposit events to monthViewEvents
      depositEvents.map(depositEvent => {
        const { date, deposit } = depositEvent;

        monthViewEvents[
          monthViewEvents.findIndex(
            monthViewEvent => monthViewEvent.date === date
          )
        ].deposit = deposit;

        return depositEvent;
      });
    }

    res.send({ monthViewEvents });
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

const calculateDepositEvents = (monthViewEvents, events) => {
  // Sort events into bills and paydays
  const bills = events.filter(x => x.type === "bill"); // ? All bills
  const paydays = monthViewEvents.filter(x => x.type === "payday"); // ? Only in view paydays

  depositEvents = [];
  paydays.forEach(payday => {
    const { date: pDate, rrule: pRRule } = payday;
    const nextPayday = pRRule.after(new Date(pDate));

    currentDepositEventIndex =
      depositEvents.push({
        date: pDate,
        deposit: { amount: null, breakdown: [] },
      }) - 1;

    bills.forEach(bill => {
      const {
        name: bName,
        rrule: bRRule,
        amount: bAmount,
        id: bId,
        description: bDescription,
      } = bill;

      const bNext = bRRule.after(new Date(pDate));
      const bPrevious = bRRule.before(new Date(pDate)); // TODO: || bill creation date

      const billsInPaydayCycle = bRRule.between(
        new Date(pDate),
        new Date(nextPayday)
      );

      let billAmount = 0;
      if (billsInPaydayCycle.length > 1) {
        billAmount = bAmount * billsInPaydayCycle.length;
      } else {
        const paydaysInBillCycle = pRRule.between(
          new Date(bPrevious),
          new Date(bNext)
        );

        billAmount = bAmount / paydaysInBillCycle.length;
      }

      depositEvents[currentDepositEventIndex].deposit.breakdown.push({
        name: bName,
        amount: billAmount,
        id: bId,
        description: bDescription,
      });
    });

    depositEvents[currentDepositEventIndex].deposit.amount = depositEvents[
      currentDepositEventIndex
    ].deposit.breakdown.reduce((partialSum, x) => partialSum + x.amount, 0);
  });

  return depositEvents;
};

module.exports = {
  getCalendarEvents,
};
