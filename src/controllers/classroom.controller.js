const Classroom = require("../models/classroom.model");

exports.createClassroom = async (req, res) => {
  try {
    const classroom = new Classroom({
      name: req.body.name,
      schoolId: req.body.schoolId,
      capacity: req.body.capacity,
      resources: req.body.resources,
    });
    const savedClassroom = await classroom.save();
    res.status(201).json(savedClassroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find({ schoolId: req.query.schoolId });
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBySchool = async (req, res) => {
  try {
    const classrooms = await Classroom.find({ schoolId: req.params.schoolId });
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedClassroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.status(200).json(updatedClassroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!deletedClassroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
