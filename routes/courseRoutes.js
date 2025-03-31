const express = require("express");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().populate("instructor", "name");
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single course by name (including to use in Application's search bar)
router.get("/name/:name", async (req, res) => {
    try {
        const { name } = req.params;

        // Find the course by name
        const course = await Course.findOne({ name }).populate("instructor");

        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single course by courseId
router.get("/courseId/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course by courseId
        const course = await Course.findOne({courseId}).populate("instructor");

        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new course
router.post("/", async (req, res) => {
    const course = new Course(req.body);
    try {
        // Save the new course
        const newCourse = await course.save();

        // Update the instructor's data to include this course
        const instructorId = newCourse.instructor; // Assuming `instructor` is the ObjectId of the instructor
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            // If the instructor doesn't exist, delete the course and return an error
            await Course.findByIdAndDelete(newCourse._id);
            return res.status(404).json({ message: "Instructor not found" });
        }

        // Add the course to the instructor's `coursesCreated` array
        instructor.coursesCreated.push(newCourse._id);
        await instructor.save();

        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a course by courseId
router.put("/courseId/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOneAndUpdate({courseId}, req.body, { new: true });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a course by courseId
router.delete("/courseId/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find and delete the course
        const course = await Course.findOneAndDelete({ courseId });
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Update the instructor's data to remove the deleted course
        const instructorId = course.instructor; // Assuming `instructor` is the ObjectId of the instructor
        const instructor = await Instructor.findById(instructorId);
        if (instructor) {
            // Remove the course from the instructor's `coursesCreated` array
            instructor.coursesCreated = instructor.coursesCreated.filter(
                (courseId) => !courseId.equals(course._id)
            );
            await instructor.save();
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;