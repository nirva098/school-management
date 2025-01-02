const express = require("express");
const authController = require("../controllers/auth.controller");
const validateRequest = require("../middleware/inputValidation.middleware");

const router = express.Router();

router.post("/register", validateRequest, authController.register);
router.post("/login", validateRequest, authController.login);

router.get("/test", (req, res) => {
  res.json("Hello");
});

module.exports = router;
