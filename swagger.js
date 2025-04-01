const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "Online Learning Platform API", // API title
      version: "1.0.0", // API version
      description: "API documentation for the Online Learning Platform with REST and GraphQL endpoints.",
      contact: {
        name: "Pranay Kumar Kinnera",
        email: "your.email@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api", // Local development server
        description: "Local Development Server",
      },
      {
        url: "https://ignited-psi.vercel.app/api", // Cloud-deployed server
        description: "Cloud Deployed Server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the REST API route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerSpec, swaggerUi };
