const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user.controller");
const { verifyReCaptcha } = require("../middleware/recaptcha.middleware");

// Create new user
router.post("", verifyReCaptcha, createUser);

// Edit a user
// router.put("/:id");

// Delete a user
// router.delete("/:id");

module.exports = router;
