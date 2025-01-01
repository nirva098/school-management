const School = require("../models/school.model");

exports.createSchool = async (req, res) => {
  try {
    const school = new School({
      name: req.body.name,
      address: req.body.address,
      contact: req.body.contact,
      createdBy: req.user.id,
    });
    const savedSchool = await school.save();
    res.status(201).json(savedSchool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedSchool)
      return res.status(404).json({ message: "School not found" });
    res.status(200).json(updatedSchool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    const deletedSchool = await School.findByIdAndDelete(req.params.id);
    if (!deletedSchool)
      return res.status(404).json({ message: "School not found" });
    res.status(200).json({ message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
