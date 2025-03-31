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

const app = express();

// Load Environment Variables
require("dotenv").config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes (REST API)
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/instructors", instructorRoutes);

// GraphQL Server Setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // You can add authentication logic or other context data if needed
    return {};
  },
});

// Wrap the async logic in a function
async function startServer() {
  // Ensure that Apollo Server starts first before applying the middleware
  await server.start();
  
  // Apply GraphQL middleware to Express app
  server.applyMiddleware({ app, path: '/graphql' }); // This adds a /graphql endpoint for GraphQL queries

  // Start the Express server after Apollo Server setup
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}${server.graphqlPath}`);
  });
}

// Call the startServer function to begin the process
startServer();
