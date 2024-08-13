const express = require("express");
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const { getCalendarEvents } = require("../controllers/calendar.controller");

const router = express.Router();

// Get calendar events
router.get("/:yearMonth", ensureAuthenticated, getCalendarEvents);

module.exports = router;
