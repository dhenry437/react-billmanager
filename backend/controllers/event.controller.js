const z = require("zod");

const {
  createRRule,
  createEventInDb,
  getEventsByUserFromDb,
} = require("../services/event.service");
const { titleCase } = require("../util");
const { RRule } = require("rrule");

const createEvent = async (req, res) => {
  const weekdaySchema = z.enum([
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ]);
  const recurringEndsSchema = z.enum(["never", "on", "after"]);
  const recurringFrequencySchema = z.enum(["days", "weeks", "months", "years"]);
  const recurringMonthlySchema = z.enum(["nth", "date"]);
  const typeSchema = z.enum(["bill", "payday"]);

  const createEventSchema = z.object({
    amount: z.coerce.number().gt(0),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    description: z.string().optional(),
    name: z.string(),
    recurring: z.boolean(),
    recurringDays: z.array(
      z.object({
        name: weekdaySchema,
        selected: z.boolean(),
      })
    ),
    recurringEnds: recurringEndsSchema,
    recurringEndsAfterN: z.coerce.number().gt(0),
    recurringEndsOnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    recurringFrequency: recurringFrequencySchema,
    recurringMonthly: recurringMonthlySchema,
    recurringN: z.coerce.number().gt(0),
    type: typeSchema,
  });

  const result = await createEventSchema.safeParseAsync(req.body);

  const {
    amount,
    date,
    description,
    name,
    recurring,
    recurringDays,
    recurringEnds,
    recurringEndsAfterN,
    recurringEndsOnDate,
    recurringFrequency,
    recurringMonthly,
    recurringN,
    type,
  } = req.body;

  if (result.success) {
    let rule = null;
    if (recurring) {
      try {
        rule = createRRule(req.body);
        console.log(rule.toString());
        console.log(rule.toText());
      } catch (e) {
        console.log(e);
        return res.status(500).send({
          alert: {
            type: "danger",
            heading: "RRule error",
            message: "Check Node logs",
          },
        });
      }
    }

    try {
      const response = await createEventInDb({
        amount,
        name,
        date,
        description,
        type,
        rruleString: rule.toString(),
        userId: req.user.id,
        reactState: {
          amount,
          date,
          description,
          name,
          recurring,
          recurringDays,
          recurringEnds,
          recurringEndsAfterN,
          recurringEndsOnDate,
          recurringFrequency,
          recurringMonthly,
          recurringN,
        },
      });

      return res.send({
        event: response,
        alert: {
          type: "success",
          message: `${titleCase(type)} created`,
          buttons: [
            {
              text: `View all ${req.body.type}s`,
              href: `/${req.body.type}s`,
            },
          ],
        },
      });
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
  } else {
    const {
      error: { issues },
    } = result;

    return res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: issues.map(x => x.message),
      },
    });
  }
};

const getEventsCurrentUser = async (req, res) => {
  try {
    const { type } = req.query;
    console.log(type);
    if (type) {
      if (type !== "bill" && type !== "payday") {
        return res.status(400).send("Invalid type");
      }
    }

    const events = await getEventsByUserFromDb(req.user.id, type);

    return res.send({
      events: events.map(x => ({
        ...x,
        recurring: RRule.fromString(x.rruleString).toText(),
      })),
    });
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
  createEvent,
  getEventsCurrentUser,
};
