const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const ConnectToServer = require('./config/db');
const User = require('./models/User');

// Create an Express server
const app = express();

// Define your GraphQL schema
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): User!
  }
`);

// Define your GraphQL resolvers
const root = {
    users: async () => {
      return await User.find();
    },
    user: async ({ id }) => {
      return await User.findById(id);
    },
    createUser: async ({ name, email }) => {
      const user = new User({ name, email });
      await user.save();
      return user;
    },
    updateUser: async ({ id, name, email }) => {
      return await User.findByIdAndUpdate(id, { name, email }, { new: true });
    },
    deleteUser: async ({ id }) => {
      return await User.findByIdAndRemove(id);
    },
  }


// Set up the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable the GraphiQL UI for testing
}));

// Start the server
app.listen(8000, () => {
  ConnectToServer();
  console.log('Server started on port 8000');
});
