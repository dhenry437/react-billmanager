const express = require("express");
const {
  createEvent,
  getEventsCurrentUser,
} = require("../controllers/event.controller");
const { verifyReCaptcha } = require("../middleware/recaptcha.middleware");
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const router = express.Router();

// Create new event
router.post("", ensureAuthenticated, verifyReCaptcha, createEvent);

// Get events for current user
router.get("", ensureAuthenticated, getEventsCurrentUser);

// Edit a event
// router.put("/:id");

// Delete a event
// router.delete("/:id");

module.exports = router;
