const express = require("express");
const Instructor = require("../models/Instructor");
const Course = require("../models/Course");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: API for managing instructors
*/

/**
 * @swagger
 * /instructors:
 *   get:
 *     tags:
 *       - Instructors
 *     summary: Get all instructors
 *     description: Fetches a list of all instructors, along with the names of the courses they have created.
 *     responses:
 *       200:
 *         description: A list of instructors with their created courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the instructor.
 *                   name:
 *                     type: string
 *                     description: The name of the instructor.
 *                   email:
 *                     type: string
 *                     description: The email of the instructor.
 *                   expertise:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of areas of expertise for the instructor.
 *                   coursesCreated:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of course names created by the instructor.
 *       500:
 *         description: Internal server error. Could not retrieve instructors.
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
        const instructors = await Instructor.find().populate("coursesCreated", "name");
        res.status(200).json(instructors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


/**
 * @swagger
 * /instructors/{id}:
 *   get:
 *     tags:
 *       - Instructors
 *     summary: Get a single instructor by ID
 *     description: Fetches a specific instructor by their unique ID and includes the names of courses they have created.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the instructor to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The instructor with their details and courses they created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the instructor.
 *                 name:
 *                   type: string
 *                   description: The name of the instructor.
 *                 email:
 *                   type: string
 *                   description: The email of the instructor.
 *                 expertise:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of areas of expertise for the instructor.
 *                 coursesCreated:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of course names created by the instructor.
 *       404:
 *         description: Instructor not found with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the instructor was not found.
 *       500:
 *         description: Internal server error. Could not retrieve the instructor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the server issue.
 */
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

/**
 * @swagger
 * /instructors:
 *   post:
 *     tags:
 *       - Instructors
 *     summary: Create a new instructor
 *     description: Creates a new instructor and saves them to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the instructor.
 *               email:
 *                 type: string
 *                 description: The email of the instructor.
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of expertise areas for the instructor.
 *     responses:
 *       201:
 *         description: The instructor was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the newly created instructor.
 *                 name:
 *                   type: string
 *                   description: The name of the newly created instructor.
 *                 email:
 *                   type: string
 *                   description: The email of the newly created instructor.
 *                 expertise:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The areas of expertise of the newly created instructor.
 *       400:
 *         description: Bad request. The request body is invalid or missing required data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 */
router.post("/", async (req, res) => {
    const instructor = new Instructor(req.body);
    try {
        const newInstructor = await instructor.save();
        res.status(201).json(newInstructor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


/**
 * @swagger
 * /instructors/{id}:
 *   put:
 *     tags:
 *       - Instructors
 *     summary: Update an instructor by ID
 *     description: Updates the details of a specific instructor identified by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the instructor to update.
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
 *                 description: The updated name of the instructor.
 *               email:
 *                 type: string
 *                 description: The updated email of the instructor.
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The updated list of expertise areas of the instructor.
 *     responses:
 *       200:
 *         description: The updated instructor details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the updated instructor.
 *                 name:
 *                   type: string
 *                   description: The updated name of the instructor.
 *                 email:
 *                   type: string
 *                   description: The updated email of the instructor.
 *                 expertise:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The updated list of expertise areas.
 *       404:
 *         description: Instructor not found. The instructor with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the instructor wasn't found.
 *       400:
 *         description: Bad request. Invalid or incomplete data provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the update failed.
 */
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


/**
 * @swagger
 * /instructors/{id}:
 *   delete:
 *     tags:
 *       - Instructors
 *     summary: Delete an instructor by ID
 *     description: Deletes the instructor with the specified ID and optionally deletes all courses they created.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the instructor to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The instructor was deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the instructor was deleted.
 *       404:
 *         description: Instructor not found. The instructor with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the instructor was not found.
 *       500:
 *         description: Internal server error. Could not delete the instructor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the deletion failed.
 */
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