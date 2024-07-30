const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user.controller");

// Create new user
router.post("/users", createUser);

// Edit a user
// router.put("/user/:id");

// Delete a user
// router.delete("/users/:id");

// // Sign in
// router.post("/auth/sign-in");

module.exports = router;
