const z = require("zod");
const { createUserInDb, getUsersFromDb } = require("../services/user.service");

const db = require("../db");
const { verifyReCaptcha } = require("./auth.controller");
// const Sequelize = db.Sequelize;
const User = db.users;

const createUser = async (req, res) => {
  const createUserSchema = z
    .object({
      name: z.string(),
      email: z
        .string()
        .email()
        .refine(
          // Check if email is in use
          async data => {
            console.log(`data = ${data}`);
            const users = await getUsersFromDb({ email: data });
            console.log(`users.length = ${users.length}`);

            return users.length === 0;
          },
          { message: "Email is in use", path: ["email"] }
        ),
      password: z.string(),
      confirmPassword: z.string(),
      token: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["password", "confirmPassword"],
    });

  const result = await createUserSchema.safeParseAsync(req.body);

  if (result.success) {
    if (await verifyReCaptcha(req.body.token)) {
      const response = await createUserInDb(req.body);
      res.send({
        user: response,
        alert: {
          type: "success",
          message: "Account created",
          buttons: [
            {
              text: "Sign in",
              href: "/sign-in",
            },
          ],
        },
      });
    } else {
      res.status(400).send({
        alert: {
          type: "danger",
          message: "Invalid reCaptcha",
        },
      });
    }
  } else {
    const {
      error: { issues },
    } = result;

    res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: issues.map(x => x.message),
      },
    });
  }
};

module.exports = {
  createUser,
};
