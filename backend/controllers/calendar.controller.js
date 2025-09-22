const z = require("zod");
const { RRule } = require("rrule");
const { getEventsFromDb } = require("../services/event.service");
const { getMonthViewDates } = require("../services/calendar.service");
const { format, subDays, addDays, startOfDay } = require("date-fns");

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

    const allBillEvents = events.filter(event => event.type === "bill"); // Get all bill events
    const allPaydayEvents = events.filter(event => event.type === "payday"); // Get all payday events
    const monthViewPaydayEvents = monthViewEvents.filter(
      event => event.type === "payday"
    ); // Get payday occurrences in the current month view

    // Calculate daily savings first, as it's the source of truth for deposits
    const dailyTargetSavings = calculateDailyTargetSavings(
      monthViewDates,
      allBillEvents,
      allPaydayEvents
    );

    const depositEvents = calculateDepositEvents(
      monthViewPaydayEvents,
      dailyTargetSavings
    );

    if (depositEvents) {
      // Add deposit events to monthViewEvents
      depositEvents.map(depositEvent => {
        const { date, deposit } = depositEvent;

        const index = monthViewEvents.findIndex(
          monthViewEvent =>
            monthViewEvent.date === date && monthViewEvent.type === "payday"
        );

        if (index !== -1) {
          monthViewEvents[index].deposit = deposit;
        }

        return depositEvent;
      });
    }

    res.send({ monthViewEvents, dailyTargetSavings });
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

const calculateDepositEvents = (monthViewPaydayEvents, dailyTargetSavings) => {
  const depositEvents = [];
  monthViewPaydayEvents.forEach(monthViewPaydayEvent => {
    const { date: paydayDateString } = monthViewPaydayEvent;

    // Find the target savings for the payday and the day before
    const paydayTarget = dailyTargetSavings.find(
      d => d.date === paydayDateString
    );

    const dayBefore = format(
      subDays(new Date(paydayDateString), 1),
      "yyyy-MM-dd"
    );
    const dayBeforeTarget = dailyTargetSavings.find(d => d.date === dayBefore);

    if (!paydayTarget) return;

    const depositBreakdown = [];

    paydayTarget.targetSavings.breakdown.forEach(paydayBill => {
      const {
        id,
        name,
        amount: newTargetAmount,
        description,
        nextBillOccurrenceDate,
      } = paydayBill;

      const prevDayBill = dayBeforeTarget?.targetSavings.breakdown.find(
        b => b.id === id
      );
      const oldTargetAmount = prevDayBill ? prevDayBill.amount : 0;
      const oldNextBillDate = prevDayBill
        ? prevDayBill.nextBillOccurrenceDate
        : null;

      let amountToDeposit = 0;
      if (nextBillOccurrenceDate?.getTime() === oldNextBillDate?.getTime()) {
        // NORMAL CASE: Target is for the same upcoming bill, so deposit is the difference.
        amountToDeposit = newTargetAmount - oldTargetAmount;
      } else {
        // BOUNDARY CASE: The bill cycle has rolled over. The deposit is the full new target amount.
        amountToDeposit = newTargetAmount;
      }

      if (amountToDeposit > 0) {
        depositBreakdown.push({
          name: name,
          amount: amountToDeposit,
          id: id,
          description: description,
        });
      }
    });

    const totalDepositAmount = depositBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    if (totalDepositAmount > 0) {
      depositEvents.push({
        date: paydayDateString,
        deposit: {
          amount: totalDepositAmount,
          breakdown: depositBreakdown,
        },
      });
    }
  });

  return depositEvents;
};

const calculateDailyTargetSavings = (
  monthViewDates,
  allBillEvents,
  allPaydayEvents
) => {
  const dailySavings = [];

  for (const dateStr of monthViewDates) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const currentDay = new Date(Date.UTC(year, month - 1, day));

    const breakdownForThisDay = [];

    let lastPayday = null;
    let nextPayday = null;

    for (const payday of allPaydayEvents) {
      const paydayRule = payday.rrule;
      const before = paydayRule.before(currentDay, true);
      if (before && (!lastPayday || before > lastPayday)) {
        lastPayday = before;
      }
      const after = paydayRule.after(currentDay);
      if (after && (!nextPayday || after < nextPayday)) {
        nextPayday = after;
      }
    }

    for (const bill of allBillEvents) {
      const billRule = bill.rrule;
      let billProportion = 0;
      let nextBillOccurrence = null;

      if (lastPayday && nextPayday) {
        const paydayCycleStart = lastPayday;
        const paydayCycleEnd = subDays(nextPayday, 1);

        const occurrencesInPaydayCycle = billRule.between(
          paydayCycleStart,
          paydayCycleEnd,
          true
        ).length;

        if (occurrencesInPaydayCycle > 1) {
          const remainingOccurrences = billRule.between(
            addDays(currentDay, 1),
            paydayCycleEnd,
            true
          );
          billProportion = bill.amount * remainingOccurrences.length;
          nextBillOccurrence = remainingOccurrences[0]; // Not perfect, but an approximation
        } else {
          nextBillOccurrence = billRule.after(currentDay);
          if (nextBillOccurrence) {
            let billCycleStartDate = billRule.before(nextBillOccurrence);
            if (!billCycleStartDate) {
              billCycleStartDate = billRule.origOptions.dtstart;
            }

            let totalPaydaysInBillCycle = 0;
            for (const paydayEvent of allPaydayEvents) {
              const paydayRule = paydayEvent.rrule;
              totalPaydaysInBillCycle += paydayRule.between(
                billCycleStartDate,
                subDays(nextBillOccurrence, 1),
                true
              ).length;
            }

            let passedPaydaysInCycle = 0;
            for (const paydayEvent of allPaydayEvents) {
              const paydayRule = paydayEvent.rrule;
              passedPaydaysInCycle += paydayRule.between(
                billCycleStartDate,
                currentDay,
                true
              ).length;
            }

            if (totalPaydaysInBillCycle > 0) {
              const proportion = passedPaydaysInCycle / totalPaydaysInBillCycle;
              billProportion = bill.amount * proportion;
            }
          }
        }
      }

      if (billProportion > 0) {
        const { name, id, description } = bill;
        breakdownForThisDay.push({
          name: name,
          amount: billProportion,
          id: id,
          description: description,
          nextBillOccurrenceDate: nextBillOccurrence,
        });
      }
    }

    const totalNeededForDay = breakdownForThisDay.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    dailySavings.push({
      date: dateStr,
      targetSavings: {
        amount: totalNeededForDay,
        breakdown: breakdownForThisDay,
      },
    });
  }
  return dailySavings;
};

module.exports = {
  getCalendarEvents,
};
