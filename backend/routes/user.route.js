const express = require("express");
const router = express.Router();

const {
  createUser,
  updateProfile,
  updatePassword,
  updatePreferences,
  exportData,
  deleteAccount,
} = require("../controllers/user.controller");
const { verifyReCaptcha } = require("../middleware/recaptcha.middleware");
const { ensureAuthenticated } = require("../middleware/auth.middleware");

// Create new user
router.post("", verifyReCaptcha, createUser);

// Update user profile
router.put("/profile", ensureAuthenticated, updateProfile);

// Update user password
router.put("/password", ensureAuthenticated, updatePassword);

// Update user preferences
router.put("/preferences", ensureAuthenticated, updatePreferences);

// Export user data
router.get("/export", ensureAuthenticated, exportData);

// Delete user account and all data
router.delete("", ensureAuthenticated, deleteAccount);

module.exports = router;


