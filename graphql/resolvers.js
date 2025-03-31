const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Student = require("../models/Student");
const axios = require("axios");
const { sendEmail } = require('../services/emailService'); // Import the email service


const resolvers = {
  Query: {
    getCourses: async () => {
      return await Course.find().populate("instructor");
    },
    getCourse: async (_, { courseId }) => {
      return await Course.findOne({ courseId }).populate("instructor");
    },
    getInstructors: async () => {
      return await Instructor.find().populate("coursesCreated");
    },
    getInstructor: async (_, { id }) => {
      return await Instructor.findById(id).populate("coursesCreated");
    },
    getStudents: async () => {
      return await Student.find().populate("enrolledCourses");
    },
    getStudent: async (_, { id }) => {
      return await Student.findById(id).populate("enrolledCourses");
    },
    getRecommendations: async (_, { courseId }) => {
      try {
        const response = await axios.get(`https://course-recommendations-api.vercel.app/recommendations/${courseId}`);
        return response.data;  // Return recommended courses
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];  // Return an empty array on failure
      }
    },
  },
  Mutation: {
    // GraphQL Resolver for addCourse
addCourse: async (_, { courseId, name, description, tags, complexity, prerequisites, duration, rating, instructor }) => {
  
  // First, create the new course with all the fields
  const newCourse = new Course({
    courseId, name, description, tags, complexity, prerequisites, duration, rating, instructor
  });
  
  const instructorId = newCourse.instructor; // Assuming `instructor` is the ObjectId of the instructor

  // check if the instructor exists in the database
  if (instructor) {
    instructor = await Instructor.findById(instructorId);
    console.log("Instructor Data:", instructor); // Log the instructor data for debugging
    if (!instructor) {
      throw new Error("Instructor not found");
    }
  }

  try {
    // Save the course to the database
    const savedCourse = await newCourse.save();

    // Add the course to the instructor's `coursesCreated` array if instructor exists
    if (instructor) {
      instructor.coursesCreated.push(savedCourse._id);
      await instructor.save();
    }

    return savedCourse; // Return the saved course to the client
  } catch (err) {
    throw new Error("Error saving the course: " + err.message);
  }
},

    // Update course details
    updateCourse: async (_, { courseId, name, description, tags, complexity, prerequisites, duration, rating, instructor }) => {
      const course = await Course.findOneAndUpdate(
        { courseId },
        { name, description, tags, complexity, prerequisites, duration, rating, instructor },
        { new: true }
      );

      if (!course) throw new Error("Course not found");
      return course;
    },
    deleteCourse: async (_, { courseId }) => {
      try {
        // Find the course by courseId and delete it
        const course = await Course.findOneAndDelete({ courseId });
        if (!course) throw new Error("Course not found");
    
        // Now, find the instructor who created this course
        const instructor = await Instructor.findById(course.instructor);
        if (instructor) {
          // Remove the course from the instructor's `coursesCreated` array
          instructor.coursesCreated = instructor.coursesCreated.filter(
            (courseId) => !courseId.equals(course._id)
          );
          await instructor.save();
        }
    
        return "Course deleted successfully";
      } catch (err) {
        throw new Error("Error deleting the course: " + err.message);
      }
    },
    enrollStudentInCourse:  async (_, { studentId, courseId }) => {
      try {
        // Find the student and course
        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);
    
        // Check if the student or course exists
        if (!student || !course) {
          throw new Error("Student or Course not found");
        }
    
        // Check if the student is already enrolled in the course
        if (student.enrolledCourses.includes(courseId)) {
          throw new Error("Student is already enrolled in this course");
        }
    
        // Enroll the student by adding the courseId to the enrolledCourses array
        student.enrolledCourses.push(courseId);
        await student.save();
    
        // Optional: Fetch course recommendations based on the enrolled course
        const recommendations = await axios.get(`https://course-recommendations-api.vercel.app/recommendations/${courseId}`);

        // Optional: Send an email confirming the enrollment
        const subject = `Successfully Enrolled in ${course.name}`;
        const text = `You have successfully enrolled in the course: ${course.name}.`;
        const html = `<p>You have successfully enrolled in the course: <strong>${course.name}</strong>.</p><p>Happy Learning!</p>`;
        await sendEmail(student.email, subject, text, html);
    
        // Return the updated student with the enrolled courses
        return {
          student: student, // Return the updated student object
          recommendations: recommendations.data, // Return the course recommendations
        };
    
      } catch (err) {
        throw new Error("Error enrolling student in course: " + err.message);
      }
    },

    // Create a new student
    createStudent: async (_, { name, email }) => {
      const student = new Student({ name, email });
      try {
        const newStudent = await student.save();
        // Send a welcome email to the new student
        const subject = "Welcome to Our Learning Platform!";
        const text = `Hello ${newStudent.name}, welcome to our learning platform! We're excited to have you on board.`;
        const html = `<p>Hello <strong>${newStudent.name}</strong>, welcome to our learning platform! We're excited to have you on board.</p>`;

        await sendEmail(newStudent.email, subject, text, html); // Send the email

        return newStudent; // Return the created student
      } catch (err) {
        throw new Error("Error creating student: " + err.message);
      }
    },

    // Update student details by ID
    updateStudent: async (_, { id, name, email }) => {
      try {
        const updatedStudent = await Student.findByIdAndUpdate(
          id,
          { name, email },
          { new: true }
        );
        if (!updatedStudent) {
          throw new Error("Student not found");
        }
        return updatedStudent; // Return updated student
      } catch (err) {
        throw new Error("Error updating student: " + err.message);
      }
    },

    // Delete a student by ID
    deleteStudent: async (_, { id }) => {
      try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
          throw new Error("Student not found");
        }
        return "Student deleted successfully"; // Return success message
      } catch (err) {
        throw new Error("Error deleting student: " + err.message);
      }
    },

    // Create a new instructor
    createInstructor: async (_, { name, email }) => {
      const instructor = new Instructor({ name, email });
      try {
        const newInstructor = await instructor.save();
        return newInstructor; // Return the created instructor
      } catch (err) {
        throw new Error("Error creating instructor: " + err.message);
      }
    },

    // Update instructor details by ID
    updateInstructor: async (_, { id, name, email }) => {
      try {
        const updatedInstructor = await Instructor.findByIdAndUpdate(
          id,
          { name, email },
          { new: true }
        );
        if (!updatedInstructor) {
          throw new Error("Instructor not found");
        }
        return updatedInstructor; // Return updated instructor
      } catch (err) {
        throw new Error("Error updating instructor: " + err.message);
      }
    },

    // Delete an instructor by ID
    deleteInstructor: async (_, { id }) => {
      try {
        // Optionally, delete all courses created by this instructor
        await Course.deleteMany({ instructor: id });

        const deletedInstructor = await Instructor.findByIdAndDelete(id);
        if (!deletedInstructor) {
          throw new Error("Instructor not found");
        }
        return "Instructor deleted successfully"; // Return success message
      } catch (err) {
        throw new Error("Error deleting instructor: " + err.message);
      }
    },
  },
};

module.exports = resolvers;
