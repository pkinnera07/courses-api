const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// Get all students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().populate("enrolledCourses", "name");
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single student by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id).populate("enrolledCourses");
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new student
router.post("/", async (req, res) => {
    const student = new Student(req.body);
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a student by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a student by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Enroll a student in a course
router.post("/:id/enroll", async (req, res) => {
    const { courseId } = req.body;
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        student.enrolledCourses.push(courseId);
        await student.save();
        res.status(200).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update student progress
router.put("/:id/progress", async (req, res) => {
    const { courseId, completedPercentage } = req.body;
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const progress = student.progress.find((p) => p.course.equals(courseId));
        if (progress) {
            progress.completedPercentage = completedPercentage;
            progress.lastActiveDate = new Date();
        } else {
            student.progress.push({ course: courseId, completedPercentage, lastActiveDate: new Date() });
        }
        await student.save();
        res.status(200).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;