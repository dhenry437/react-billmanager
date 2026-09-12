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
      ({
        id,
        name,
        description,
        amount,
        type,
        rruleString,
        reactState,
        createdAt,
      }) => ({
        id,
        name,
        description,
        amount,
        type,
        rruleString,
        reactState,
        createdAt,
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

    // const depositEvents = calculateDepositEvents(
    //   monthViewPaydayEvents,
    //   allBillEvents,
    //   allPaydayEvents
    // );

    // if (depositEvents) {
    //   // Add deposit events to monthViewEvents
    //   depositEvents.map(depositEvent => {
    //     const { date, deposit } = depositEvent;

    //     const index = monthViewEvents.findIndex(
    //       monthViewEvent =>
    //         monthViewEvent.date === date && monthViewEvent.type === "payday"
    //     );

    //     if (index !== -1) {
    //       monthViewEvents[index].deposit = deposit;
    //     }

    //     return depositEvent;
    //   });
    // }

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

const calculateDepositEvents = (
  monthViewPaydayEvents,
  allBillEvents,
  allPaydayEvents
) => {
  const depositEvents = [];
  monthViewPaydayEvents.forEach(monthViewPaydayEvent => {
    const { date: paydayDateString } = monthViewPaydayEvent;
    const currentPaydayDate = new Date(paydayDateString);

    const dayBeforePaydayString = format(
      subDays(currentPaydayDate, 1),
      "yyyy-MM-dd"
    );
    const dayBeforePaydayDate = subDays(currentPaydayDate, 1);

    const depositBreakdown = [];

    // Determine lastPayday and nextPayday for currentPaydayDate
    let lastPaydayForCurrentPayday = null;
    let nextPaydayForCurrentPayday = null;
    for (const payday of allPaydayEvents) {
      const paydayRule = payday.rrule;
      const before = paydayRule.before(currentPaydayDate, true);
      if (
        before &&
        (!lastPaydayForCurrentPayday || before > lastPaydayForCurrentPayday)
      ) {
        lastPaydayForCurrentPayday = before;
      }
      const after = paydayRule.after(currentPaydayDate);
      if (
        after &&
        (!nextPaydayForCurrentPayday || after < nextPaydayForCurrentPayday)
      ) {
        nextPaydayForCurrentPayday = after;
      }
    }

    // Determine lastPayday and nextPayday for dayBeforePaydayDate
    let lastPaydayForDayBefore = null;
    let nextPaydayForDayBefore = null;
    for (const payday of allPaydayEvents) {
      const paydayRule = payday.rrule;
      const before = paydayRule.before(dayBeforePaydayDate, true);
      if (
        before &&
        (!lastPaydayForDayBefore || before > lastPaydayForDayBefore)
      ) {
        lastPaydayForDayBefore = before;
      }
      const after = paydayRule.after(dayBeforePaydayDate);
      if (
        after &&
        (!nextPaydayForDayBefore || after < nextPaydayForDayBefore)
      ) {
        nextPaydayForDayBefore = after;
      }
    }

    // Iterate over all bills to calculate proportions for current payday and day before
    allBillEvents.forEach(bill => {
      const billRule = bill.rrule;
      let newTargetAmount = 0;
      let oldTargetAmount = 0;
      let nextBillOccurrenceDate = null;
      let oldNextBillDate = null;

      // Calculate newTargetAmount (for current payday)
      if (lastPaydayForCurrentPayday && nextPaydayForCurrentPayday) {
        const paydayCycleStart = lastPaydayForCurrentPayday;
        const paydayCycleEnd = nextPaydayForCurrentPayday;

        const occurrencesInPaydayCycle = billRule.between(
          paydayCycleStart,
          paydayCycleEnd,
          true
        ).length;

        if (occurrencesInPaydayCycle > 1) {
          const remainingOccurrences = billRule.between(
            addDays(currentPaydayDate, 1),
            paydayCycleEnd,
            true
          );
          newTargetAmount = bill.amount * remainingOccurrences.length;
          nextBillOccurrenceDate = remainingOccurrences[0];
        } else {
          const currentBillOccurrence = billRule.between(
            currentPaydayDate,
            currentPaydayDate,
            true
          );
          if (currentBillOccurrence.length > 0) {
            newTargetAmount = bill.amount;
            nextBillOccurrenceDate = currentBillOccurrence[0];
          } else {
            const nextOcc = billRule.after(currentPaydayDate);
            if (nextOcc) {
              let previousBillOccurrence = billRule.before(nextOcc);
              let billCycleStartDate;
              if (previousBillOccurrence) {
                billCycleStartDate = addDays(previousBillOccurrence, 1);
              } else {
                billCycleStartDate = addDays(billRule.origOptions.dtstart, 1);
              }

              let totalPaydaysInBillCycle = 0;
              for (const paydayEvent of allPaydayEvents) {
                const paydayRule = paydayEvent.rrule;
                totalPaydaysInBillCycle += paydayRule.between(
                  billCycleStartDate,
                  nextOcc,
                  true
                ).length;
              }

              let passedPaydaysInCycle = 0;
              for (const paydayEvent of allPaydayEvents) {
                const paydayRule = paydayEvent.rrule;
                passedPaydaysInCycle += paydayRule.between(
                  billCycleStartDate,
                  currentPaydayDate,
                  true
                ).length;
              }

              if (totalPaydaysInBillCycle > 0) {
                const proportion =
                  passedPaydaysInCycle / totalPaydaysInBillCycle;
                newTargetAmount = bill.amount * proportion;
              }
              nextBillOccurrenceDate = nextOcc;
            }
          }
        }
      }

      // Calculate oldTargetAmount (for day before payday)
      if (lastPaydayForDayBefore && nextPaydayForDayBefore) {
        const paydayCycleStart = lastPaydayForDayBefore;
        const paydayCycleEnd = nextPaydayForDayBefore;

        const occurrencesInPaydayCycle = billRule.between(
          paydayCycleStart,
          paydayCycleEnd,
          true
        ).length;

        if (occurrencesInPaydayCycle > 1) {
          const remainingOccurrences = billRule.between(
            addDays(dayBeforePaydayDate, 1),
            paydayCycleEnd,
            true
          );
          oldTargetAmount = bill.amount * remainingOccurrences.length;
          oldNextBillDate = remainingOccurrences[0];
        } else {
          const currentBillOccurrence = billRule.between(
            dayBeforePaydayDate,
            dayBeforePaydayDate,
            true
          );
          if (currentBillOccurrence.length > 0) {
            oldTargetAmount = bill.amount;
            oldNextBillDate = currentBillOccurrence[0];
          } else {
            const nextOcc = billRule.after(dayBeforePaydayDate);
            if (nextOcc) {
              let previousBillOccurrence = billRule.before(nextOcc);
              let billCycleStartDate;
              if (previousBillOccurrence) {
                billCycleStartDate = addDays(previousBillOccurrence, 1);
              } else {
                billCycleStartDate = addDays(billRule.origOptions.dtstart, 1);
              }

              let totalPaydaysInBillCycle = 0;
              for (const paydayEvent of allPaydayEvents) {
                const paydayRule = paydayEvent.rrule;
                totalPaydaysInBillCycle += paydayRule.between(
                  billCycleStartDate,
                  nextOcc,
                  true
                ).length;
              }

              let passedPaydaysInCycle = 0;
              for (const paydayEvent of allPaydayEvents) {
                const paydayRule = paydayEvent.rrule;
                passedPaydaysInCycle += paydayRule.between(
                  billCycleStartDate,
                  dayBeforePaydayDate,
                  true
                ).length;
              }

              if (totalPaydaysInBillCycle > 0) {
                const proportion =
                  passedPaydaysInCycle / totalPaydaysInBillCycle;
                oldTargetAmount = bill.amount * proportion;
              }
              oldNextBillDate = nextOcc;
            }
          }
        }
      }

      let amountToDeposit = 0;
      const isBillDueOnPayday =
        nextBillOccurrenceDate &&
        format(nextBillOccurrenceDate, "yyyy-MM-dd") === paydayDateString;
      const hasBillCycleRolledOver =
        nextBillOccurrenceDate?.getTime() !== oldNextBillDate?.getTime();

      if (isBillDueOnPayday) {
        amountToDeposit = newTargetAmount - oldTargetAmount;
      } else if (hasBillCycleRolledOver) {
        amountToDeposit = newTargetAmount;
      } else {
        amountToDeposit = newTargetAmount - oldTargetAmount;
      }

      if (amountToDeposit > 0) {
        depositBreakdown.push({
          name: bill.name,
          amount: amountToDeposit,
          id: bill.id,
          description: bill.description,
        });
      }
      if (bill.name === "Rent" && paydayDateString === "2025-09-15") {
        console.log(`-- ${bill.name} ${paydayDateString} --`);
        console.log(`newTargetAmount = ${newTargetAmount}`);
        console.log(`oldTargetAmount = ${oldTargetAmount}`);
        console.log(`amountToDeposit = ${amountToDeposit}`);
        console.log(`isBillDueOnPayday = ${isBillDueOnPayday}`);
        console.log(`hasBillCycleRolledOver = ${hasBillCycleRolledOver}`);
        console.log(`nextBillOccurrenceDate = ${nextBillOccurrenceDate}`);
        console.log(`oldNextBillDate = ${oldNextBillDate}`);
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

    if (dateStr === "2025-09-15") {
      console.log(`-- ${dateStr} --`);
      console.log(`lastPayday = ${lastPayday}`);
      console.log(`nextPayday = ${nextPayday}`);
      console.log(`-- -- `);
    }

    for (const bill of allBillEvents) {
      const billRule = bill.rrule;
      let billProportion = 0;
      let nextBillOccurrence = null;

      if (lastPayday && nextPayday) {
        const paydayCycleStart = lastPayday;
        const paydayCycleEnd = nextPayday;

        const occurrencesInPaydayCycle = billRule.between(
          addDays(paydayCycleStart, 1),
          paydayCycleEnd,
          true
        ).length;

        if (dateStr === "2025-09-15" && bill.name === "Rent") {
          console.log(`-- ${dateStr} ${bill.name} --`);
          console.log(`occurrencesInPaydayCycle = ${occurrencesInPaydayCycle}`);
        }

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
            const isRecurring =
              bill.reactState?.recurring !== false &&
              billRule.origOptions.count !== 1;
            let previousBillOccurrence = billRule.before(nextBillOccurrence);
            let billCycleStartDate;
            if (!isRecurring) {
              billCycleStartDate = startOfDay(
                new Date(bill.createdAt || billRule.origOptions.dtstart)
              );
              if (billCycleStartDate > nextBillOccurrence) {
                billCycleStartDate = nextBillOccurrence;
              }
            } else if (previousBillOccurrence) {
              billCycleStartDate = addDays(previousBillOccurrence, 1);
            } else {
              billCycleStartDate = addDays(billRule.origOptions.dtstart, 1);
            }

            const uniqueTotalPaydays = new Set();
            for (const paydayEvent of allPaydayEvents) {
              const paydayRule = paydayEvent.rrule;
              paydayRule
                .between(billCycleStartDate, nextBillOccurrence, true)
                .forEach(date =>
                  uniqueTotalPaydays.add(format(date, "yyyy-MM-dd"))
                );
            }
            const totalPaydaysInBillCycle = uniqueTotalPaydays.size;

            const uniquePassedPaydays = new Set();
            for (const paydayEvent of allPaydayEvents) {
              const paydayRule = paydayEvent.rrule;
              paydayRule
                .between(billCycleStartDate, currentDay, true)
                .forEach(date =>
                  uniquePassedPaydays.add(format(date, "yyyy-MM-dd"))
                );
            }
            const passedPaydaysInCycle = uniquePassedPaydays.size;

            if (totalPaydaysInBillCycle > 0) {
              const proportion = passedPaydaysInCycle / totalPaydaysInBillCycle;
              billProportion = bill.amount * proportion;
            } else if (!isRecurring) {
              billProportion = bill.amount;
            }

            if (dateStr === "2025-09-15" && bill.name === "Rent") {
              console.log(`-- ${dateStr} --`);
              console.log(`billProportion = ${billProportion}`);
              console.log(
                `totalPaydaysInBillCycle = ${totalPaydaysInBillCycle}`
              );
              console.log(`nextBillOccurrence = ${nextBillOccurrence}`);
              console.log(`-- -- `);
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
  calculateDailyTargetSavings,
};
