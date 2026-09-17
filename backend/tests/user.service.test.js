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
  };
});

jest.mock("bcrypt");

const db = require("../db");
const {
  updateUserProfileInDb,
  updateUserPasswordInDb,
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
