const { body, validationResult } = require("express-validator");

const validationSchemas = {
  "POST /auth/register": [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
    body("role")
      .isIn(["super_admin", "school_admin"])
      .withMessage("Invalid role."),
  ],
  "POST /auth/login": [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  "POST /schools": [
    body("name").isString().notEmpty().withMessage("School name is required."),
    body("address").isString().notEmpty().withMessage("Address is required."),
    body("contact").isString().notEmpty().withMessage("Contact is required."),
  ],
};

const validateRequest = (req, res, next) => {
  const routeKey = `${req.method} ${req.route?.path}`;
  const validators = validationSchemas[routeKey];

  if (!validators) {
    return next(); // No validations for this route
  }

  // Run validators
  validators.forEach((validator) => validator.run(req));

  // Collect validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = validateRequest;
