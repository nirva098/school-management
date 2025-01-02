const express = require("express");
const { body } = require("express-validator");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { checkSchoolAccess } = require("../middleware/schoolAccess.middleware");
const studentController = require("../controllers/student.controller");

const router = express.Router();
router.use(authenticate);

// Enroll a new student
router.post("/enroll",
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
    studentController.enrollStudent
);

// Get students by classroom
router.get("/",
    authorize("school_admin"),
    checkSchoolAccess,
    studentController.getStudentsByClassroom);

// Update student details
router.put("/:id",
    authorize("school_admin"),
    [
        body("firstName").optional().trim().notEmpty(),
        body("lastName").optional().trim().notEmpty(),
        body("classroom").optional().isMongoId(),
        body("status").optional().isIn(["active", "inactive", "transferred"]),
    ],
    checkSchoolAccess,
    studentController.updateStudentDetails);

// Delete a student
router.delete("/:id",
    authorize("school_admin"),
    checkSchoolAccess,
    studentController.deleteStudent);

// Transfer a student
router.put("/transfer/:id",
    authorize("school_admin"),
    checkSchoolAccess,
    studentController.transferStudent);

module.exports = router;
