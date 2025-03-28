const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    courseId: { type: String, required: true },
    name: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor", required: true }, // Reference to Instructor
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    complexity: { type: String, required: true },
    prerequisites: { type: [String], required: true },
    duration: { type: String, required: true },
    rating: { type: Number, required: true }
});

module.exports = mongoose.model("Course", CourseSchema);