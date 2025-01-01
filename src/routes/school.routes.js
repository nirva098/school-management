const express = require("express");
const { body } = require("express-validator");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { checkSchoolAccess } = require("../middleware/schoolAccess.middleware");
const schoolController = require("../controllers/school.controller");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize("superadmin"),
  [
    body("name").trim().notEmpty(),
    body("address.street").optional().trim(),
    body("address.city").optional().trim(),
    body("address.state").optional().trim(),
    body("address.zipCode").optional().trim(),
    body("address.country").optional().trim(),
    body("contactInfo.email").optional().isEmail(),
    body("contactInfo.phone").optional().trim(),
  ],
  schoolController.createSchool
);

router.get("/", authorize("superadmin"), schoolController.getSchools);

// router.get("/:id", checkSchoolAccess, schoolController.getById);

router.put("/:id", authorize("superadmin"), schoolController.updateSchool);

router.delete("/:id", authorize("superadmin"), schoolController.deleteSchool);

module.exports = router;