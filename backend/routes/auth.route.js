var passport = require("passport");
const express = require("express");
const {
  getAuthenticatedUser,
  signInPassport,
  signOutPassport,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/sign-in", signInPassport);

router.post("/sign-out", signOutPassport);

// Get user
router.get("/user", getAuthenticatedUser);

module.exports = router;
