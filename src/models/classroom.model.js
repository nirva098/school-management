const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]+$/.test(v); // Only alphabets and spaces
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    resources: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "under maintenance"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

classroomSchema.index({ school: 1 });

classroomSchema.index({ name: 1, school: 1 }, { unique: true });

classroomSchema.virtual("resourceCount").get(function () {
  return this.resources.length;
});

module.exports = mongoose.model("Classroom", classroomSchema);
