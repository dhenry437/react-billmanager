jest.mock("../services/event.service");
const {
  calculateDailyTargetSavings,
} = require("../controllers/calendar.controller");
const { RRule } = require("rrule");

describe("calendar.controller.js", () => {
  describe("calculateDailyTargetSavings", () => {
    let allBillEvents;
    let allPaydayEvents;
    let monthViewDates;
    let result;

    beforeEach(() => {
      allBillEvents = [
        {
          id: "7ddd5ada-fd16-47a1-b361-32618240c46d",
          name: "Hello Fresh",
          description: "Weekly meal kit subscription",
          amount: 85,
          type: "bill",
          rruleString:
            "DTSTART:20240221T000000Z\nRRULE:WKST=SU;FREQ=WEEKLY;INTERVAL=1;BYDAY=WE",
        },
        {
          id: "02032928-52fb-48ca-a99a-346383b74645",
          name: "Telstra",
          description: "incl. Pixel 8 repayment",
          amount: 101.8,
          type: "bill",
          rruleString:
            "DTSTART:20231109T000000Z\n" +
            "RRULE:WKST=SU;FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=9",
        },
        {
          id: "8dd648cb-fe42-4512-8a5a-58e168837782",
          name: "Rent",
          description: "Sackville St monthly rent",
          amount: 1173,
          type: "bill",
          rruleString:
            "DTSTART:20230415T000000Z\n" +
            "RRULE:WKST=SU;FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15",
        },
        {
          id: "a17186ce-46d9-41b4-ab84-232d2e1dc936",
          name: "Gas",
          description: "Energy Australia",
          amount: 75,
          type: "bill",
          rruleString:
            "DTSTART:20230222T000000Z\n" +
            "RRULE:WKST=SU;FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=22",
        },
        {
          id: "c4c2fd04-9218-4ccf-825d-d039b7c05103",
          name: "Electricity",
          description: "Energy Australia",
          amount: 225,
          type: "bill",
          rruleString:
            "DTSTART:20230222T000000Z\n" +
            "RRULE:WKST=SU;FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=22",
        },
        {
          id: "970288e5-be94-470d-b63b-3c3581433082",
          name: "Car Insurance",
          description: "Youi car insurance",
          amount: 1104,
          type: "bill",
          rruleString:
            "DTSTART:20240913T000000Z\nRRULE:WKST=SU;FREQ=YEARLY;INTERVAL=1",
        },
      ];

      allBillEvents = allBillEvents.map(event => {
        event.rrule = RRule.fromString(event.rruleString);
        return event;
      });

      allPaydayEvents = [
        {
          id: "9c7eaf6f-7dc9-4e3e-8a53-1ecd6e9272ed",
          name: "Flexcube",
          description: "Flexcube fortnightly pay",
          amount: 2048,
          type: "payday",
          rruleString:
            "DTSTART:20190805T000000Z\nRRULE:WKST=SU;FREQ=WEEKLY;INTERVAL=2;BYDAY=FR",
        },
        {
          id: "437913e8-1037-478b-810a-9d823c028688",
          name: "Jotun",
          description: "Jotun Australia monthly pay",
          amount: 5063.66,
          type: "payday",
          rruleString:
            "DTSTART:20241115T000000Z\n" +
            "RRULE:WKST=SU;FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15",
        },
      ];

      allPaydayEvents = allPaydayEvents.map(event => {
        event.rrule = RRule.fromString(event.rruleString);
        return event;
      });

      monthViewDates = [
        "2025-08-31",
        "2025-09-01",
        "2025-09-02",
        "2025-09-03",
        "2025-09-04",
        "2025-09-05",
        "2025-09-06",
        "2025-09-07",
        "2025-09-08",
        "2025-09-09",
        "2025-09-10",
        "2025-09-11",
        "2025-09-12",
        "2025-09-13",
        "2025-09-14",
        "2025-09-15",
        "2025-09-16",
        "2025-09-17",
        "2025-09-18",
        "2025-09-19",
        "2025-09-20",
        "2025-09-21",
        "2025-09-22",
        "2025-09-23",
        "2025-09-24",
        "2025-09-25",
        "2025-09-26",
        "2025-09-27",
        "2025-09-28",
        "2025-09-29",
        "2025-09-30",
        "2025-10-01",
        "2025-10-02",
        "2025-10-03",
        "2025-10-04",
      ];

      result = calculateDailyTargetSavings(
        monthViewDates,
        allBillEvents,
        allPaydayEvents
      );
    });

    it("should contain Hello Fresh on 2025-09-16 with amount 170", () => {
      expect(
        result.find(d => d.date === "2025-09-16").targetSavings.breakdown
      ).toContainEqual(
        expect.objectContaining({ name: "Hello Fresh", amount: 170 })
      );
    });

    it("should contain Hello Fresh on 2025-09-17 with amount 85", () => {
      expect(
        result.find(d => d.date === "2025-09-17").targetSavings.breakdown
      ).toContainEqual(
        expect.objectContaining({ name: "Hello Fresh", amount: 85 })
      );
    });

    it("should not contain Hello Fresh on 2025-09-24", () => {
      expect(
        result.find(d => d.date === "2025-09-24").targetSavings.breakdown
      ).not.toContainEqual(expect.objectContaining({ name: "Hello Fresh" }));
    });

    it("should calculate target savings for a non-recurring bill across paydays", () => {
      const oneOffBill = {
        id: "one-off-1",
        name: "Doctor Specialist",
        description: "Specialist consultation",
        amount: 300,
        type: "bill",
        createdAt: "2025-09-10T00:00:00.000Z",
        rruleString: "DTSTART:20250928T000000Z\nRRULE:FREQ=DAILY;COUNT=1",
        rrule: RRule.fromString(
          "DTSTART:20250928T000000Z\nRRULE:FREQ=DAILY;COUNT=1"
        ),
        reactState: { recurring: false },
      };

      const testResult = calculateDailyTargetSavings(
        monthViewDates,
        [oneOffBill],
        allPaydayEvents
      );

      // On 2025-09-11 (before any payday after Sept 10): 0 passed out of 3 paydays (Sept 12, 15, 26)
      expect(
        testResult.find(d => d.date === "2025-09-11").targetSavings.amount
      ).toBe(0);

      // On 2025-09-13 (after 1 payday: Sept 12): 1/3 * 300 = 100
      expect(
        testResult.find(d => d.date === "2025-09-13").targetSavings.amount
      ).toBe(100);

      // On 2025-09-16 (after 2 paydays: Sept 12, 15): 2/3 * 300 = 200
      expect(
        testResult.find(d => d.date === "2025-09-16").targetSavings.amount
      ).toBe(200);

      // On 2025-09-27 (after 3 paydays: Sept 12, 15, 26): 3/3 * 300 = 300
      expect(
        testResult.find(d => d.date === "2025-09-27").targetSavings.amount
      ).toBe(300);
    });
  });
});
