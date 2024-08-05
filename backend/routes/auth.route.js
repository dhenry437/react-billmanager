const express = require("express");
const {
  getAuthenticatedUser,
  signInPassport,
  signOutPassport,
} = require("../controllers/auth.controller");
const { verifyReCaptcha } = require("../middleware/recaptcha.middleware");

const router = express.Router();

router.post("/sign-in", verifyReCaptcha, signInPassport);

router.post("/sign-out", signOutPassport);

// Get user
router.get("/user", getAuthenticatedUser);

module.exports = router;
