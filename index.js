// index.js
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");

const schema = buildSchema(`
    type UserData{
        id: ID
        email: String
        first_name: String
        last_name: String
        avatar: String
    }

    type CreatedUser{
        id: ID
        name: String
        job: String
        createdAt: String
    }
    
    type Users{
        page: Int
        per_page: Int
        total: Int
        total_pages: Int
        data: [UserData]
    }

    type User{
        data: UserData
    }
    
    type Query {
        ping: String
        users: Users
        user(id: ID!): User
    }

    type Mutation{
        createUser(name: String!, job: String!): CreatedUser
    }
`);

const root = {
  ping: () => "Pong!!",
  users: async () =>
    await (await fetch(`https://reqres.in/api/users?page=2`)).json(),
  createUser: async (payload) =>
    await (
      await fetch(`https://reqres.in/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    ).json(),
  user: async (payload) => {
    const { id } = payload;
    return await (await fetch(`https://reqres.in/api/users/${id}`)).json();
  },
};

const app = express();

app.use(cors({ origin: "*" }));
app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Running a GraphQL API server at http://localhost:4000");
});
