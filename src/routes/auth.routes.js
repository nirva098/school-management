const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["superadmin", "school_admin"]),
  ],
  authController.register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  authController.login
);

module.exports = router;
