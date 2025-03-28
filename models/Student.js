const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    progress: [
        {
            course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
            completedPercentage: { type: Number, default: 0 },
            lastActiveDate: { type: Date }
        }
    ]
});

module.exports = mongoose.model("Student", StudentSchema);