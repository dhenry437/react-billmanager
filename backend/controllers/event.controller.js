const z = require("zod");

const {
  createRRule,
  createEventInDb,
  updateEventInDb,
  getEventsFromDb,
} = require("../services/event.service");
const { titleCase } = require("../util");
const { RRule } = require("rrule");

const createEventSchema = z.object({
  amount: z.coerce.number().gt(0),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().optional(),
  name: z.string(),
  recurring: z.boolean(),
  recurringDays: z.array(
    z.object({
      name: z.enum(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]),
      selected: z.boolean(),
    })
  ),
  recurringEnds: z.enum(["never", "on", "after"]),
  recurringEndsAfterN: z.coerce.number().gt(0),
  recurringEndsOnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  recurringFrequency: z.enum(["days", "weeks", "months", "years"]),
  recurringMonthly: z.enum(["nth", "date"]),
  recurringN: z.coerce.number().gt(0),
  type: z.enum(["bill", "payday"]),
});

const createEvent = async (req, res) => {
  const zodResult = await createEventSchema.safeParseAsync(req.body);

  const { amount, name, date, description, type } = req.body;

  if (zodResult.success) {
    let rule = null;
    if (req.body.recurring) {
      try {
        rule = createRRule(req.body);
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
        reactState: req.body,
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
    return res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: result.errors.issues.map(x => x.message),
      },
    });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  console.log(`id = ${id}`);
  let zodResult = await z.string().uuid().safeParseAsync(id);
  if (!zodResult.success) {
    return res.status(400).send({
      alert: {
        type: "danger",
        message: "Invalid ID in URL",
      },
    });
  }

  zodResult = await createEventSchema.safeParseAsync(req.body);

  const { amount, name, date, description, type } = req.body;

  if (zodResult.success) {
    let rule = null;
    if (req.body.recurring) {
      try {
        rule = createRRule(req.body);
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
      const response = await updateEventInDb(id, req.user.id, {
        amount,
        name,
        date,
        description,
        type,
        rruleString: rule.toString(),
        userId: req.user.id,
        reactState: req.body,
      });

      return res.send({
        event: response,
        alert: {
          type: "success",
          message: `${titleCase(type)} updated`,
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
    return res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: result.errors.issues.map(x => x.message),
      },
    });
  }
};

const getEventsCurrentUser = async (req, res) => {
  const searchSchema = z
    .object({
      type: z.enum(["bill", "payday"]).optional(),
      id: z.string().uuid().optional(),
    })
    .strict();

  const search = req.query;
  const zodResult = await searchSchema.safeParseAsync(search);

  if (zodResult.success) {
    try {
      const events = await getEventsFromDb(req.user.id, search);

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

module.exports = {
  createEvent,
  updateEvent,
  getEventsCurrentUser,
};
