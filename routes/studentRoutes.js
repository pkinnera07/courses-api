const express = require("express");
const Student = require("../models/Student");
const { sendEmail } = require('../services/emailService'); // Import the email service
const Course = require("../models/Course"); // Import the Course model
const axios = require('axios'); // Import axios for API calls
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API for managing students
 */

/**
 * @swagger
 * /students:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get all students
 *     description: Fetches a list of all students, including their enrolled courses.
 *     responses:
 *       200:
 *         description: A list of students with their enrolled courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the student.
 *                   name:
 *                     type: string
 *                     description: The name of the student.
 *                   email:
 *                     type: string
 *                     description: The email of the student.
 *                   enrolledCourses:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of course IDs the student is enrolled in.
 *       500:
 *         description: Internal server error. Could not retrieve students.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student profile by ID
 *     description: Fetches the student's profile, including their enrolled courses and progress.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the student.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The student's profile with enrolled courses and progress.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the student.
 *                 name:
 *                   type: string
 *                   description: The name of the student.
 *                 email:
 *                   type: string
 *                   description: The email of the student.
 *                 enrolledCourses:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of course IDs the student is enrolled in.
 *                 progress:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       course:
 *                         type: string
 *                         description: The unique identifier of the course.
 *                       completedPercentage:
 *                         type: number
 *                         description: The percentage of the course completed by the student.
 *                       lastActiveDate:
 *                         type: string
 *                         format: date-time
 *                         description: The last date the student was active in the course.
 *       404:
 *         description: Student not found with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the student was not found.
 *       500:
 *         description: Internal server error while fetching the student profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the issue.
 */

/**
 * @swagger
 * /students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Create a new student
 *     description: Registers a new student and sends a welcome email to them.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the student.
 *               email:
 *                 type: string
 *                 description: The email of the student.
 *     responses:
 *       201:
 *         description: The student was successfully created and a welcome email was sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the student.
 *                 name:
 *                   type: string
 *                   description: The name of the student.
 *                 email:
 *                   type: string
 *                   description: The email of the student.
 *                 enrolledCourses:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of course IDs the student is enrolled in.
 *                 progress:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       course:
 *                         type: string
 *                         description: The ID of the course.
 *                       completedPercentage:
 *                         type: number
 *                         description: The percentage of completion for the course.
 *                       lastActiveDate:
 *                         type: string
 *                         format: date-time
 *                         description: The last active date of the student in the course.
 *       400:
 *         description: Invalid input data. The student creation failed due to incorrect or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 */

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     tags:
 *       - Students
 *     summary: Update a student by ID
 *     description: Updates the information of a student based on their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the student to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the student.
 *               email:
 *                 type: string
 *                 description: The email of the student.
 *               enrolledCourses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of course IDs the student is enrolled in.
 *               progress:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     course:
 *                       type: string
 *                       description: The ID of the course.
 *                     completedPercentage:
 *                       type: number
 *                       description: The percentage of completion for the course.
 *                     lastActiveDate:
 *                       type: string
 *                       format: date-time
 *                       description: The last active date of the student in the course.
 *     responses:
 *       200:
 *         description: The student was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the student.
 *                 name:
 *                   type: string
 *                   description: The name of the student.
 *                 email:
 *                   type: string
 *                   description: The email of the student.
 *                 enrolledCourses:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of course IDs the student is enrolled in.
 *                 progress:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       course:
 *                         type: string
 *                         description: The ID of the course.
 *                       completedPercentage:
 *                         type: number
 *                         description: The percentage of completion for the course.
 *                       lastActiveDate:
 *                         type: string
 *                         format: date-time
 *                         description: The last active date of the student in the course.
 *       404:
 *         description: Student not found with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the student was not found.
 *       400:
 *         description: Invalid data. The student update failed due to incorrect or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 */

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     tags:
 *       - Students
 *     summary: Delete a student by ID
 *     description: Deletes a student record identified by the student's ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the student to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The student was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the student was deleted.
 *       404:
 *         description: Student not found with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the student was not found.
 *       500:
 *         description: Internal server error while deleting the student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the issue with the deletion.
 */

/**
 * @swagger
 * /recommendations/{courseId}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Fetch course recommendations based on a given course
 *     description: Fetches a list of course recommendations based on a specific course ID. **This route interacts with a third-party API.**
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The unique identifier of the course for which recommendations are fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of recommended courses based on the given course.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the recommended course.
 *                   name:
 *                     type: string
 *                     description: The name of the recommended course.
 *                   description:
 *                     type: string
 *                     description: The description of the recommended course.
 *                   duration:
 *                     type: string
 *                     description: The duration of the recommended course.
 *                   rating:
 *                     type: number
 *                     description: The rating of the recommended course.
 *       404:
 *         description: No recommendations found for the given course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message explaining that no recommendations were found.
 *       500:
 *         description: Internal server error while fetching recommendations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message explaining why the request failed.
 */
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

router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("enrolledCourses");
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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