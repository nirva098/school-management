const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

const schoolRouter = require("./routes/school.routes");
const classroomRouter = require("./routes/classroom.routes");
const studentRouter = require("./routes/student.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello from Express!" });
});

app.use("/api/auth", authRouter);
app.use("/api/schools", schoolRouter);
app.use("/api/classrooms", classroomRouter);
app.use("/api/students", studentRouter);

module.exports = app;
