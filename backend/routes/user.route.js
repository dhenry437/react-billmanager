const express = require("express");
const router = express.Router();

const {
  createUser,
  updateProfile,
  updatePassword,
} = require("../controllers/user.controller");
const { verifyReCaptcha } = require("../middleware/recaptcha.middleware");
const { ensureAuthenticated } = require("../middleware/auth.middleware");

// Create new user
router.post("", verifyReCaptcha, createUser);

// Update user profile
router.put("/profile", ensureAuthenticated, updateProfile);

// Update user password
router.put("/password", ensureAuthenticated, updatePassword);

module.exports = router;

