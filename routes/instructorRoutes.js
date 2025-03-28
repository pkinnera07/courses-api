const express = require("express");
const Instructor = require("../models/Instructor");
const Course = require("../models/Course");

const router = express.Router();

// Get all instructors
router.get("/", async (req, res) => {
    try {
        const instructors = await Instructor.find().populate("coursesCreated", "name");
        res.status(200).json(instructors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single instructor by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Instructor.findById(id).populate("coursesCreated", "name");
        if (!instructor) return res.status(404).json({ message: "Instructor not found" });
        res.status(200).json(instructor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Create a new instructor
router.post("/", async (req, res) => {
    const instructor = new Instructor(req.body);
    try {
        const newInstructor = await instructor.save();
        res.status(201).json(newInstructor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an instructor by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInstructor = await Instructor.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInstructor) return res.status(404).json({ message: "Instructor not found" });
        res.status(200).json(updatedInstructor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an instructor by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Optionally, delete all courses created by this instructor
        await Course.deleteMany({ instructor: id });

        const deletedInstructor = await Instructor.findByIdAndDelete(id);
        if (!deletedInstructor) return res.status(404).json({ message: "Instructor not found" });
        res.status(200).json({ message: "Instructor deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;