jest.mock("../db", () => ({
  Sequelize: { Op: { ne: Symbol("ne") } },
  users: {},
}));

jest.mock("../services/user.service");

const {
  updateProfile,
  updatePassword,
  updatePreferences,
  exportData,
  deleteAccount,
} = require("../controllers/user.controller");
const userService = require("../services/user.service");


describe("user.controller.js", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: "user-123", name: "Original Name", email: "orig@example.com" },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe("updateProfile", () => {
    it("should return 400 if validation fails (invalid email)", async () => {
      req.body = { name: "New Name", email: "not-an-email" };

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          alert: expect.objectContaining({
            type: "danger",
            list: expect.arrayContaining(["Invalid email address"]),
          }),
        })
      );
    });

    it("should update profile and session user on success", async () => {
      req.body = { name: "New Name", email: "new@example.com" };
      userService.updateUserProfileInDb.mockResolvedValue({
        id: "user-123",
        name: "New Name",
        email: "new@example.com",
      });

      await updateProfile(req, res);

      expect(userService.updateUserProfileInDb).toHaveBeenCalledWith("user-123", {
        name: "New Name",
        email: "new@example.com",
      });
      expect(req.user.name).toBe("New Name");
      expect(req.user.email).toBe("new@example.com");
      expect(res.send).toHaveBeenCalledWith({
        user: { id: "user-123", name: "New Name", email: "new@example.com" },
        alert: {
          type: "success",
          message: "Profile updated successfully",
        },
      });
    });

    it("should return error status and alert if service throws", async () => {
      req.body = { name: "New Name", email: "taken@example.com" };
      const err = new Error("Email is already in use");
      err.statusCode = 400;
      userService.updateUserProfileInDb.mockRejectedValue(err);

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        alert: {
          type: "danger",
          message: "Email is already in use",
        },
      });
    });
  });

  describe("updatePassword", () => {
    it("should return 400 if new password is too short", async () => {
      req.body = {
        currentPassword: "currentPassword1",
        newPassword: "short",
        confirmNewPassword: "short",
      };

      await updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          alert: expect.objectContaining({
            type: "danger",
            list: expect.arrayContaining([
              "New password must be at least 8 characters",
            ]),
          }),
        })
      );
    });

    it("should return 400 if confirmNewPassword does not match newPassword", async () => {
      req.body = {
        currentPassword: "currentPassword1",
        newPassword: "validPassword123",
        confirmNewPassword: "differentPassword123",
      };

      await updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          alert: expect.objectContaining({
            type: "danger",
            list: expect.arrayContaining(["New passwords do not match"]),
          }),
        })
      );
    });

    it("should return success when password is valid and updated", async () => {
      req.body = {
        currentPassword: "currentPassword1",
        newPassword: "validPassword123",
        confirmNewPassword: "validPassword123",
      };
      userService.updateUserPasswordInDb.mockResolvedValue(true);

      await updatePassword(req, res);

      expect(userService.updateUserPasswordInDb).toHaveBeenCalledWith(
        "user-123",
        "currentPassword1",
        "validPassword123"
      );
      expect(res.send).toHaveBeenCalledWith({
        alert: {
          type: "success",
          message: "Password updated successfully",
        },
      });
    });

    it("should return error status and alert when current password check fails", async () => {
      req.body = {
        currentPassword: "wrongPassword",
        newPassword: "validPassword123",
        confirmNewPassword: "validPassword123",
      };
      const err = new Error("Current password is incorrect");
      err.statusCode = 400;
      userService.updateUserPasswordInDb.mockRejectedValue(err);

      await updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        alert: {
          type: "danger",
          message: "Current password is incorrect",
        },
      });
    });
  });

  describe("updatePreferences", () => {
    it("should return 400 if validation fails (invalid currency)", async () => {
      req.body = { currency: "INVALID_CURRENCY" };

      await updatePreferences(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          alert: expect.objectContaining({
            type: "danger",
          }),
        })
      );
    });

    it("should update preferences and update session user on success", async () => {
      req.body = {
        currency: "USD",
        weekStartsOn: 0,
        dateFormat: "MM/dd/yyyy",
        bufferType: "percentage",
        bufferValue: 15,
      };

      const mockUpdated = {
        currency: "USD",
        weekStartsOn: 0,
        dateFormat: "MM/dd/yyyy",
        bufferType: "percentage",
        bufferValue: 15,
      };
      userService.updateUserPreferencesInDb.mockResolvedValue(mockUpdated);

      await updatePreferences(req, res);

      expect(userService.updateUserPreferencesInDb).toHaveBeenCalledWith(
        "user-123",
        req.body
      );
      expect(req.user.preferences).toEqual(mockUpdated);
      expect(res.send).toHaveBeenCalledWith({
        preferences: mockUpdated,
        alert: {
          type: "success",
          message: "Preferences updated successfully",
        },
      });
    });
  });

  describe("exportData", () => {
    it("should return user data as json download", async () => {
      const mockExportData = {
        version: "1.0",
        profile: { name: "Test User" },
        bills: [],
        paydays: [],
      };
      userService.exportUserDataFromDb.mockResolvedValue(mockExportData);
      res.setHeader = jest.fn();

      await exportData(req, res);

      expect(userService.exportUserDataFromDb).toHaveBeenCalledWith("user-123");
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json"
      );
      expect(res.send).toHaveBeenCalledWith(mockExportData);
    });
  });

  describe("deleteAccount", () => {
    it("should return 400 if password is missing", async () => {
      req.body = { password: "" };

      await deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should delete account and logout session on valid password", async () => {
      req.body = { password: "validPassword123" };
      userService.deleteUserAccountFromDb.mockResolvedValue(true);
      req.logout = jest.fn(cb => cb(null));
      req.session = { destroy: jest.fn(cb => cb()) };

      await deleteAccount(req, res);

      expect(userService.deleteUserAccountFromDb).toHaveBeenCalledWith(
        "user-123",
        "validPassword123"
      );
      expect(req.logout).toHaveBeenCalled();
      expect(req.session.destroy).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        alert: {
          type: "success",
          message: "Account deleted successfully",
        },
      });
    });
  });
});

