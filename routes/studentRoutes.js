const express = require("express");
const Student = require("../models/Student");
const { sendEmail } = require('../services/emailService'); // Import the email service
const Course = require("../models/Course"); // Import the Course model
const axios = require('axios'); // Import axios for API calls
const router = express.Router();

// Function to fetch course recommendations
async function fetchRecommendations(courseId) {
    try {
        const response = await axios.get(`https://course-recommendations-api.vercel.app/recommendations/${courseId}`);
        return response.data;  // Return the recommended courses data
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];  // Return an empty array if the recommendation fetch fails
    }
}

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
        // Send a welcome email to the new student
        const subject = "Welcome to Our Learning Platform!";
        const text = `Hello ${newStudent.name}, welcome to our learning platform! We're excited to have you on board.`;
        const html = `<p>Hello <strong>${newStudent.name}</strong>, welcome to our learning platform! We're excited to have you on board.</p>`; 

        await sendEmail(newStudent.email, subject, text, html); // Send the email

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
        // Find the student and course
        const student = await Student.findById(req.params.id);
        const course = await Course.findById(courseId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Enroll the student in the course
        student.enrolledCourses.push(courseId);
        await student.save();

        // Fetch course recommendations based on the enrolled course
        const recommendations = await fetchRecommendations(courseId);

        // Send an email to the student confirming their enrollment
        const subject = `Successfully Enrolled in ${course.name}`;
        const text = `You have successfully enrolled in the course: ${course.name}.`;
        const html = `<p>You have successfully enrolled in the course: <strong>${course.name}</strong>.</p><p>Happy Learning!</p>`;

        await sendEmail(student.email, subject, text, html);

        // Send back the student object as a response
        res.status(200).json({ student, recommendations });

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