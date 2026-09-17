const z = require("zod");
const {
  createUserInDb,
  getUsersFromDb,
  updateUserProfileInDb,
  updateUserPreferencesInDb,
  updateUserPasswordInDb,
  exportUserDataFromDb,
  deleteUserAccountFromDb,
} = require("../services/user.service");

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
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
      confirmPassword: z.string(),
      token: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["password", "confirmPassword"],
    });

  const result = await createUserSchema.safeParseAsync(req.body);

  if (result.success) {
    try {
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

    res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: issues.map(x => x.message),
      },
    });
  }
};

const updateProfile = async (req, res) => {
  const updateProfileSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
  });

  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: result.error.issues.map(x => x.message),
      },
    });
  }

  try {
    const updatedUser = await updateUserProfileInDb(req.user.id, result.data);

    if (req.user) {
      req.user.name = updatedUser.name;
      req.user.email = updatedUser.email;
    }

    res.send({
      user: updatedUser,
      alert: {
        type: "success",
        message: "Profile updated successfully",
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(e.statusCode || 500).send({
      alert: {
        type: "danger",
        message: e.message || "Failed to update profile",
      },
    });
  }
};

const updatePassword = async (req, res) => {
  const updatePasswordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: "Current password is required" }),
      newPassword: z
        .string()
        .min(8, { message: "New password must be at least 8 characters" }),
      confirmNewPassword: z.string(),
    })
    .refine(data => data.newPassword === data.confirmNewPassword, {
      message: "New passwords do not match",
      path: ["confirmNewPassword"],
    });

  const result = updatePasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: result.error.issues.map(x => x.message),
      },
    });
  }

  try {
    await updateUserPasswordInDb(
      req.user.id,
      result.data.currentPassword,
      result.data.newPassword
    );

    res.send({
      alert: {
        type: "success",
        message: "Password updated successfully",
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(e.statusCode || 500).send({
      alert: {
        type: "danger",
        message: e.message || "Failed to update password",
      },
    });
  }
};

const updatePreferences = async (req, res) => {
  const updatePreferencesSchema = z.object({
    currency: z.enum(["AUD", "USD", "EUR", "GBP", "CAD", "NZD"]).optional(),
    weekStartsOn: z.union([z.literal(0), z.literal(1)]).optional(),
    dateFormat: z.enum(["dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"]).optional(),
    bufferType: z.enum(["none", "fixed", "percentage"]).optional(),
    bufferValue: z.number().min(0).optional(),
  });

  const result = updatePreferencesSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: result.error.issues.map(x => x.message),
      },
    });
  }

  try {
    const updatedPreferences = await updateUserPreferencesInDb(
      req.user.id,
      result.data
    );

    if (req.user) {
      req.user.preferences = updatedPreferences;
    }

    res.send({
      preferences: updatedPreferences,
      alert: {
        type: "success",
        message: "Preferences updated successfully",
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(e.statusCode || 500).send({
      alert: {
        type: "danger",
        message: e.message || "Failed to update preferences",
      },
    });
  }
};

const exportData = async (req, res) => {
  try {
    const data = await exportUserDataFromDb(req.user.id);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=billmanager-export-${new Date().toISOString().split("T")[0]}.json`
    );
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (e) {
    console.error(e);
    return res.status(e.statusCode || 500).send({
      alert: {
        type: "danger",
        message: e.message || "Failed to export data",
      },
    });
  }
};

const deleteAccount = async (req, res) => {
  const deleteAccountSchema = z.object({
    password: z
      .string()
      .min(1, { message: "Current password is required to delete your account" }),
  });

  const result = deleteAccountSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      alert: {
        type: "danger",
        message: "Please address the following:",
        list: result.error.issues.map(x => x.message),
      },
    });
  }

  try {
    await deleteUserAccountFromDb(req.user.id, result.data.password);

    req.logout(err => {
      if (err) console.error("Logout error on delete account:", err);
      if (req.session) {
        req.session.destroy(() => {
          res.send({
            alert: {
              type: "success",
              message: "Account deleted successfully",
            },
          });
        });
      } else {
        res.send({
          alert: {
            type: "success",
            message: "Account deleted successfully",
          },
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(e.statusCode || 500).send({
      alert: {
        type: "danger",
        message: e.message || "Failed to delete account",
      },
    });
  }
};

module.exports = {
  createUser,
  updateProfile,
  updatePassword,
  updatePreferences,
  exportData,
  deleteAccount,
};


