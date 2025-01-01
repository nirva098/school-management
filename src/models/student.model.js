const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "transferred"],
      default: "active",
    },
    contactInfo: {
      email: String,
      phone: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
