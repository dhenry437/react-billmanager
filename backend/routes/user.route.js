const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user.controller");

// Create new user
router.post("", createUser);

// Edit a user
// router.put("/:id");

// Delete a user
// router.delete("/:id");

module.exports = router;
