const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user.controller");

// Create new user
router.post("/users", createUser);

// Edit a user
// router.put("/users/:id");

// Delete a user
// router.delete("/users/:id");

module.exports = router;
