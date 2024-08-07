const express = require("express");
const {
  createEvent,
  getEventsCurrentUser,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const router = express.Router();

// Create new event
router.post("", ensureAuthenticated, createEvent);

// Get events for current user
router.get("", ensureAuthenticated, getEventsCurrentUser);

// Edit a event
router.put("/:id", ensureAuthenticated, updateEvent);

// Delete a event
router.delete("/:id", ensureAuthenticated, deleteEvent);

module.exports = router;
