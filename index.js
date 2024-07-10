// index.js
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type UserData{
        id: ID
        email: String
        first_name: String
        last_name: String
        avatar: String
    }
    
    type User{
        page: Int
        per_page: Int
        total: Int
        total_pages: Int
        data: [UserData]
    }
    
    type Query {
        hello: String
        user: User
    }
`);

const root = {
  hello: () => {
    return "Hello world!";
  },
  user: async () => {
    return await (await fetch(`https://reqres.in/api/users?page=2`)).json();
  },
};

const app = express();

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
