const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Here you can handle things like authentication context if needed
    return {};
  }
});

await server.start();

// Apply Apollo middleware to the Express app
server.applyMiddleware({ app });

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
});
