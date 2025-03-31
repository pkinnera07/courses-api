const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # Types for the GraphQL Schema
  type Course {
    id: ID!
    courseId: String!
    name: String!
    description: String!
    tags: [String]!
    complexity: String!
    prerequisites: [String]!
    duration: String!
    rating: Float!
    instructor: Instructor!
  }

  type Instructor {
    id: ID!
    name: String!
    email: String!
    expertise: [String]!
    coursesCreated: [Course]
  }

  type Student {
    id: ID!
    name: String!
    email: String!
    enrolledCourses: [Course]
    progress: [Progress]
  }

  type Progress {
    course: Course!
    completedPercentage: Float!
    lastActiveDate: String!
  }

  # Queries
  type Query {
    getCourses: [Course]
    getCourse(courseId: String!): Course
    getInstructors: [Instructor]
    getInstructor(id: ID!): Instructor
    getStudents: [Student]
    getStudent(id: ID!): Student
    getRecommendations(courseId: String!): [Course]
  }

  # Mutations
  type Mutation {
    addCourse(courseId: String!, name: String!, description: String!, tags: [String]!, complexity: String!, prerequisites: [String]!, duration: String!, rating: Float!, instructor: String!): Course
    updateCourse(courseId: String!, name: String, description: String, tags: [String], complexity: String, prerequisites: [String], duration: String, rating: Float): Course
    deleteCourse(courseId: String!): String
    enrollStudentInCourse(studentId: ID!, courseId: ID!): Student
    createStudent(name: String!, email: String!): Student!
    updateStudent(id: ID!, name: String, email: String): Student!
    deleteStudent(id: ID!): String!
    createInstructor(name: String!, email: String!): Instructor!
    updateInstructor(id: ID!, name: String, email: String): Instructor!
    deleteInstructor(id: ID!): String!
  }
`;

module.exports = typeDefs;
