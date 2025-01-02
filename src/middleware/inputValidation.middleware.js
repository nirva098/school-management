const { body, validationResult } = require("express-validator");

const validationSchemas = {
  // Authentication validation rules
  "POST /api/auth/register": [
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

  // School validation rules
  "POST /schools": [
    body("name").isString().notEmpty().withMessage("School name is required."),
    body("address").isString().notEmpty().withMessage("Address is required."),
    body("contact").isString().notEmpty().withMessage("Contact is required."),
  ],
  "PUT /schools/:id": [
    body("name").isString().optional().withMessage("Invalid school name."),
    body("address").isString().optional().withMessage("Invalid address."),
    body("contact").isString().optional().withMessage("Invalid contact."),
  ],

  // Classroom validation rules
  "POST /classrooms": [
    body("name")
      .isString()
      .notEmpty()
      .withMessage("Classroom name is required."),
    body("schoolId")
      .isString()
      .notEmpty()
      .withMessage("School ID is required."),
    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be a positive integer."),
  ],
  "PUT /classrooms/:id": [
    body("name").isString().optional().withMessage("Invalid classroom name."),
    body("capacity")
      .isInt({ min: 1 })
      .optional()
      .withMessage("Invalid capacity."),
  ],

  // Student validation rules
  "POST /students": [
    body("name").isString().notEmpty().withMessage("Student name is required."),
    body("age")
      .isInt({ min: 1 })
      .withMessage("Age must be a positive integer."),
    body("classroomId")
      .isString()
      .notEmpty()
      .withMessage("Classroom ID is required."),
  ],
  "PUT /students/:id": [
    body("name").isString().optional().withMessage("Invalid student name."),
    body("age").isInt({ min: 1 }).optional().withMessage("Invalid age."),
  ],
};

const validateRequest = async (req, res, next) => {
  const routeKey = `${req.method} ${req.baseUrl}${req.route?.path || ""}`;
  const validators = validationSchemas[routeKey];

  if (!validators) {
    console.warn(`No validator for path ${routeKey}. Consider adding one`);
    return next(); // No validations for this route
  }

  // Run validators (async functions need to be awaited)
  for (const validator of validators) {
    await validator.run(req);
  }

  // Collect validation results
  const errors = validationResult(req);
  console.log("Errors ", errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = validateRequest;
