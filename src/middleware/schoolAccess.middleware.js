const School = require("../models/school.model");

// Middleware to check if school admin has access to specific school
exports.checkSchoolAccess = async (req, res, next) => {
  try {
    const schoolId = req.params.schoolId || req.params.id || req.body.school;

    if (req.user.role === "superadmin") {
      return next();
    }

    if (
      req.user.role === "school_admin" &&
      req.user.school.toString() === schoolId
    ) {
      return next();
    }

    res.status(403).json({ message: "Access denied to this school" });
  } catch (error) {
    res.status(500).json({ message: "Error checking school access" });
  }
};
