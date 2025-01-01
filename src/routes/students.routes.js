const express = require("express");
const { body } = require("express-validator");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { checkSchoolAccess } = require("../middleware/schoolAccess.middleware");
const studentController = require("../controllers/student.controller");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize("school_admin"),
  checkSchoolAccess,
  [
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("dateOfBirth").isISO8601(),
    body("school").isMongoId(),
    body("classroom").optional().isMongoId(),
    body("contactInfo.email").optional().isEmail(),
    body("contactInfo.phone").optional().trim(),
  ],
  studentController.createStudent
);

router.get(
  "/school/:schoolId",
  checkSchoolAccess,
  studentController.getStudents
);

// router.get("/:id", checkSchoolAccess, studentController.getById);

router.put(
  "/:id",
  authorize("school_admin"),
  checkSchoolAccess,
  [
    body("firstName").optional().trim().notEmpty(),
    body("lastName").optional().trim().notEmpty(),
    body("classroom").optional().isMongoId(),
    body("status").optional().isIn(["active", "inactive", "transferred"]),
  ],
  studentController.updateStudent
);

// router.post(
//   "/:id/transfer",
//   authorize("school_admin"),
//   checkSchoolAccess,
//   [body("newSchool").isMongoId(), body("newClassroom").optional().isMongoId()],
//   studentController.transfer
// );

module.exports = router;
