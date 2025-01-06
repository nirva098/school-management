const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\\s]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid first name!`,
      },
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\\s]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid last name!`,
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          const age = new Date().getFullYear() - v.getFullYear();
          return age >= 5 && age <= 20;
        },
        message: (props) => `The student must be between 5 and 20 years old.`,
      },
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
      email: {
        type: String,
        validate: {
          validator: function (v) {
            return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(v);
          },
          message: (props) => `${props.value} is not a valid email!`,
        },
      },
      phone: {
        type: String,
        validate: {
          validator: function (v) {
            return /^[0-9]{10}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: {
          type: String,
          validate: {
            validator: function (v) {
              return /^[0-9]{5,6}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid zip code!`,
          },
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ school: 1 });
studentSchema.index({ classroom: 1 });
studentSchema.index({ school: 1, status: 1 });

module.exports = mongoose.model("Student", studentSchema);
