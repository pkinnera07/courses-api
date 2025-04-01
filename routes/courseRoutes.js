const express = require("express");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get all courses
 *     description: Fetches a list of all available courses with the name of their instructor.
 *     responses:
 *       200:
 *         description: A list of courses with instructor information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   courseId:
 *                     type: string
 *                     description: The unique identifier for the course.
 *                   name:
 *                     type: string
 *                     description: The name of the course.
 *                   instructor:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the course instructor.
 *                   description:
 *                     type: string
 *                     description: A short description of the course.
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of tags associated with the course.
 *                   complexity:
 *                     type: string
 *                     description: The difficulty level of the course.
 *                   prerequisites:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of prerequisites required for the course.
 *                   duration:
 *                     type: string
 *                     description: The duration of the course.
 *                   rating:
 *                     type: number
 *                     format: float
 *                     description: The average rating of the course.
 *       500:
 *         description: Internal server error. Could not retrieve courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().populate("instructor", "name");
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


/**
 * @swagger
 * /courses/name/{name}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get a single course by name
 *     description: Fetches a single course based on the provided name, including instructor details.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the course to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A course object with instructor information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                   description: The unique identifier for the course.
 *                 name:
 *                   type: string
 *                   description: The name of the course.
 *                 instructor:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the course instructor.
 *                 description:
 *                   type: string
 *                   description: A short description of the course.
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of tags associated with the course.
 *                 complexity:
 *                   type: string
 *                   description: The difficulty level of the course.
 *                 prerequisites:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of prerequisites required for the course.
 *                 duration:
 *                   type: string
 *                   description: The duration of the course.
 *                 rating:
 *                   type: number
 *                   format: float
 *                   description: The average rating of the course.
 *       404:
 *         description: Course not found. The course with the specified name does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error. Could not retrieve the course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.get("/name/:name", async (req, res) => {
    try {
        const { name } = req.params;

        // Find the course by name
        const course = await Course.findOne({ name }).populate("instructor", "name");

        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /courses/courseId/{courseId}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get a single course by courseId
 *     description: Fetches a single course based on the provided courseId, including instructor details.
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The unique identifier for the course to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A course object with instructor information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                   description: The unique identifier for the course.
 *                 name:
 *                   type: string
 *                   description: The name of the course.
 *                 instructor:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the course instructor.
 *                 description:
 *                   type: string
 *                   description: A short description of the course.
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of tags associated with the course.
 *                 complexity:
 *                   type: string
 *                   description: The difficulty level of the course.
 *                 prerequisites:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of prerequisites required for the course.
 *                 duration:
 *                   type: string
 *                   description: The duration of the course.
 *                 rating:
 *                   type: number
 *                   format: float
 *                   description: The average rating of the course.
 *       404:
 *         description: Course not found. The course with the specified courseId does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error. Could not retrieve the course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.get("/courseId/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course by courseId
        const course = await Course.findOne({courseId}).populate("instructor", "name");

        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


/**
 * @swagger
 * /courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Add a new course
 *     description: Adds a new course to the system and associates it with an instructor. If the instructor is not found, the course will be deleted and an error returned.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The unique identifier for the course.
 *               name:
 *                 type: string
 *                 description: The name of the course.
 *               instructor:
 *                 type: string
 *                 description: The ObjectId of the instructor who will teach the course.
 *               description:
 *                 type: string
 *                 description: A short description of the course.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of tags associated with the course.
 *               complexity:
 *                 type: string
 *                 description: The difficulty level of the course.
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of prerequisites required for the course.
 *               duration:
 *                 type: string
 *                 description: The duration of the course.
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: The average rating of the course.
 *     responses:
 *       201:
 *         description: Course successfully added to the system and associated with the instructor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                   description: The unique identifier for the newly created course.
 *                 name:
 *                   type: string
 *                   description: The name of the newly created course.
 *                 instructor:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the course instructor.
 *                 description:
 *                   type: string
 *                   description: A short description of the newly created course.
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of tags associated with the newly created course.
 *                 complexity:
 *                   type: string
 *                   description: The difficulty level of the newly created course.
 *                 prerequisites:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of prerequisites for the newly created course.
 *                 duration:
 *                   type: string
 *                   description: The duration of the newly created course.
 *                 rating:
 *                   type: number
 *                   format: float
 *                   description: The average rating of the newly created course.
 *       400:
 *         description: Bad request. Validation failed, or the request body is malformed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 *       404:
 *         description: Instructor not found. The provided instructor ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the instructor was not found.
 */
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


/**
 * @swagger
 * /courses/courseId/{courseId}:
 *   put:
 *     tags:
 *       - Courses
 *     summary: Update a course by courseId
 *     description: Updates the details of a course with the specified courseId.
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The unique identifier of the course to update.
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
 *                 description: The name of the course.
 *               instructor:
 *                 type: string
 *                 description: The ObjectId of the instructor who teaches the course.
 *               description:
 *                 type: string
 *                 description: A description of the course.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of tags associated with the course.
 *               complexity:
 *                 type: string
 *                 description: The difficulty level of the course.
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of prerequisites required for the course.
 *               duration:
 *                 type: string
 *                 description: The duration of the course.
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: The average rating of the course.
 *     responses:
 *       200:
 *         description: The updated course object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                   description: The unique identifier for the course.
 *                 name:
 *                   type: string
 *                   description: The updated name of the course.
 *                 instructor:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the instructor.
 *                 description:
 *                   type: string
 *                   description: The updated description of the course.
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The updated list of tags associated with the course.
 *                 complexity:
 *                   type: string
 *                   description: The updated difficulty level of the course.
 *                 prerequisites:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The updated prerequisites for the course.
 *                 duration:
 *                   type: string
 *                   description: The updated duration of the course.
 *                 rating:
 *                   type: number
 *                   format: float
 *                   description: The updated average rating of the course.
 *       404:
 *         description: Course not found. The course with the specified `courseId` does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the course wasn't found.
 *       400:
 *         description: Bad request. The request body is invalid or malformed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 */
router.put("/courseId/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOneAndUpdate({ courseId }, req.body, { new: true });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


/**
 * @swagger
 * /courses/courseId/{courseId}:
 *   delete:
 *     tags:
 *       - Courses
 *     summary: Delete a course by courseId
 *     description: Deletes the course with the specified courseId and removes it from the instructor's `coursesCreated` list.
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The unique identifier of the course to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the course was deleted.
 *       404:
 *         description: Course not found. The course with the specified `courseId` does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the course wasn't found.
 *       500:
 *         description: Internal server error. Could not delete the course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the deletion failed.
 */
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