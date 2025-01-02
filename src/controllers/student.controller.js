const Student = require("../models/student.model");

// Enroll a new student
exports.enrollStudent = async (req, res) => {
  try {
    const student = new Student({
      name: req.body.name,
      age: req.body.age,
      classroomId: req.body.classroomId,
    });
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get students by classroom
exports.getStudentsByClassroom = async (req, res) => {
  try {
    const students = await Student.find({ classroomId: req.query.classroomId });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student details
exports.updateStudentDetails = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Transfer a student
exports.transferStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { classroomId: req.body.classroomId },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
