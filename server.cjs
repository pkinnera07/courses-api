const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { swaggerSpec, swaggerUi } = require("./swagger");
const { default: expressPlayground } = require("graphql-playground-middleware-express");

// Load Environment Variables
require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// REST API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/instructors", instructorRoutes);

// Serve GraphQL Playground at /playground
app.get(
  "/playground",
  expressPlayground({
    endpoint: "/graphql", // The GraphQL endpoint
  })
);

// GraphQL Server Setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for production
  playground: true,    // Enable GraphQL Playground for production
  context: ({ req }) => {
    // Add authentication or other context logic here if needed
    return {};
  },
});

// Start the server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

startServer();
