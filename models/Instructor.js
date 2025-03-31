const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    expertise: { type: [String], required: true },
    coursesCreated: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], default: [], required: true }, // Initialize as empty array
});

module.exports = mongoose.model("Instructor", InstructorSchema);