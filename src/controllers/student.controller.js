const Student = require("../models/student.model");

exports.createStudent = async (req, res) => {
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

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ classroomId: req.query.classroomId });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
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
