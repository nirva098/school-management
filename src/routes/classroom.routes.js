const express = require("express");
const { body } = require("express-validator");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { checkSchoolAccess } = require("../middleware/schoolAccess.middleware");
const classroomController = require("../controllers/classroom.controller");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize("school_admin"),
  checkSchoolAccess,
  [
    body("name").trim().notEmpty(),
    body("school").isMongoId(),
    body("capacity").isInt({ min: 1 }),
    body("resources").optional().isArray(),
  ],
  classroomController.createClassroom
);

// router.get(
//   "/school/:schoolId",
//   checkSchoolAccess,
//   classroomController.getAllBySchool
// );

router.get("/:id", checkSchoolAccess, classroomController.getClassrooms);

router.put(
  "/:id",
  authorize("school_admin"),
  checkSchoolAccess,
  [
    body("name").optional().trim().notEmpty(),
    body("capacity").optional().isInt({ min: 1 }),
    body("status").optional().isIn(["active", "inactive"]),
  ],
  classroomController.updateClassroom
);

router.delete(
  "/:id",
  authorize("school_admin"),
  checkSchoolAccess,
  classroomController.deleteClassroom
);

module.exports = router;
