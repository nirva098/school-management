const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      zipCode: {
        type: String,
        validate: {
          validator: function (v) {
            return /^[0-9]{5,6}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid zip code!`,
        },
      },
      country: { type: String, default: "India" },
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
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

schoolSchema.index({ name: 1 });
schoolSchema.index({ "address.city": 1 });

module.exports = mongoose.model("School", schoolSchema);
