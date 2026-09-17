const bcrypt = require("bcrypt");

jest.mock("../db", () => {
  const Sequelize = {
    Op: {
      ne: Symbol("ne"),
    },
  };
  return {
    Sequelize,
    users: {
      findOne: jest.fn(),
      findByPk: jest.fn(),
    },
    events: {
      findAll: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

jest.mock("bcrypt");

const db = require("../db");
const {
  updateUserProfileInDb,
  updateUserPreferencesInDb,
  updateUserPasswordInDb,
  exportUserDataFromDb,
  deleteUserAccountFromDb,
} = require("../services/user.service");

describe("user.service.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateUserProfileInDb", () => {
    it("should update profile successfully when email is available", async () => {
      db.users.findOne.mockResolvedValue(null);
      const mockUser = {
        id: "user-123",
        name: "Old Name",
        email: "old@example.com",
        preferences: { currency: "AUD" },
        save: jest.fn().mockResolvedValue(true),
      };
      db.users.findByPk.mockResolvedValue(mockUser);

      const result = await updateUserProfileInDb("user-123", {
        name: "New Name",
        email: "new@example.com",
      });

      expect(mockUser.name).toBe("New Name");
      expect(mockUser.email).toBe("new@example.com");
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: "user-123",
        name: "New Name",
        email: "new@example.com",
        preferences: { currency: "AUD" },
      });
    });

    it("should throw an error if email is already taken by another user", async () => {
      db.users.findOne.mockResolvedValue({ id: "user-456", email: "taken@example.com" });

      await expect(
        updateUserProfileInDb("user-123", {
          name: "New Name",
          email: "taken@example.com",
        })
      ).rejects.toThrow("Email is already in use");
    });

    it("should throw 404 error if user does not exist", async () => {
      db.users.findOne.mockResolvedValue(null);
      db.users.findByPk.mockResolvedValue(null);

      await expect(
        updateUserProfileInDb("missing-id", {
          name: "New Name",
          email: "new@example.com",
        })
      ).rejects.toThrow("User not found");
    });
  });

  describe("updateUserPreferencesInDb", () => {
    it("should update user preferences and return merged preferences", async () => {
      const mockUser = {
        id: "user-123",
        preferences: { currency: "AUD", weekStartsOn: 1 },
        save: jest.fn().mockResolvedValue(true),
      };
      db.users.findByPk.mockResolvedValue(mockUser);

      const result = await updateUserPreferencesInDb("user-123", {
        currency: "USD",
        bufferType: "percentage",
        bufferValue: 10,
      });

      expect(mockUser.preferences.currency).toBe("USD");
      expect(mockUser.preferences.bufferType).toBe("percentage");
      expect(mockUser.preferences.bufferValue).toBe(10);
      expect(mockUser.preferences.weekStartsOn).toBe(1);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser.preferences);
    });

    it("should throw 404 if user does not exist", async () => {
      db.users.findByPk.mockResolvedValue(null);

      await expect(
        updateUserPreferencesInDb("missing-id", { currency: "EUR" })
      ).rejects.toThrow("User not found");
    });
  });

  describe("exportUserDataFromDb", () => {
    it("should return exported user data with grouped events", async () => {
      const mockUser = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
        preferences: { currency: "AUD" },
        createdAt: "2026-01-01T00:00:00.000Z",
      };
      db.users.findByPk.mockResolvedValue(mockUser);

      const mockEvents = [
        {
          id: "event-1",
          name: "Rent",
          description: "Monthly rent",
          amount: 1500,
          date: "2026-02-01",
          type: "bill",
          rruleString: "RRULE:...",
          reactState: {},
          createdAt: "2026-01-01",
        },
        {
          id: "event-2",
          name: "Payday",
          description: "Bi-weekly pay",
          amount: 2500,
          date: "2026-02-05",
          type: "payday",
          rruleString: "RRULE:...",
          reactState: {},
          createdAt: "2026-01-01",
        },
      ];
      db.events.findAll.mockResolvedValue(mockEvents);

      const result = await exportUserDataFromDb("user-123");

      expect(result.profile.name).toBe("Test User");
      expect(result.profile.email).toBe("test@example.com");
      expect(result.bills.length).toBe(1);
      expect(result.bills[0].name).toBe("Rent");
      expect(result.paydays.length).toBe(1);
      expect(result.paydays[0].name).toBe("Payday");
    });

    it("should throw 404 if user not found", async () => {
      db.users.findByPk.mockResolvedValue(null);

      await expect(exportUserDataFromDb("missing-id")).rejects.toThrow("User not found");
    });
  });

  describe("deleteUserAccountFromDb", () => {
    it("should delete events and user record when password matches", async () => {
      const mockUser = {
        id: "user-123",
        hashedPassword: "hashed_password",
        destroy: jest.fn().mockResolvedValue(true),
      };
      db.users.findByPk.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      db.events.destroy.mockResolvedValue(2);

      const result = await deleteUserAccountFromDb("user-123", "correctPassword");

      expect(result).toBe(true);
      expect(db.events.destroy).toHaveBeenCalledWith({ where: { userId: "user-123" } });
      expect(mockUser.destroy).toHaveBeenCalled();
    });

    it("should throw 400 error if password does not match", async () => {
      const mockUser = {
        id: "user-123",
        hashedPassword: "hashed_password",
      };
      db.users.findByPk.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        deleteUserAccountFromDb("user-123", "wrongPassword")
      ).rejects.toThrow("Incorrect password");
    });

    it("should throw 404 error if user not found", async () => {
      db.users.findByPk.mockResolvedValue(null);

      await expect(
        deleteUserAccountFromDb("missing-id", "anyPassword")
      ).rejects.toThrow("User not found");
    });
  });

  describe("updateUserPasswordInDb", () => {
    it("should throw 404 if user not found", async () => {
      db.users.findByPk.mockResolvedValue(null);

      await expect(
        updateUserPasswordInDb("user-123", "currentPwd", "newPwd")
      ).rejects.toThrow("User not found");
    });

    it("should throw 400 error if current password does not match", async () => {
      const mockUser = {
        id: "user-123",
        hashedPassword: "hashed_old_pwd",
      };
      db.users.findByPk.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        updateUserPasswordInDb("user-123", "wrongPassword", "newPassword123")
      ).rejects.toThrow("Current password is incorrect");
    });

    it("should update password when current password matches", async () => {
      const mockUser = {
        id: "user-123",
        hashedPassword: "hashed_old_pwd",
        save: jest.fn().mockResolvedValue(true),
      };
      db.users.findByPk.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.genSalt.mockResolvedValue("salt123");
      bcrypt.hash.mockResolvedValue("new_hashed_pwd");

      const result = await updateUserPasswordInDb(
        "user-123",
        "correctPassword",
        "newPassword123"
      );

      expect(result).toBe(true);
      expect(mockUser.hashedPassword).toBe("new_hashed_pwd");
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
