const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} = require("graphql");

const User = require("../models/userModel");

/*
|--------------------------------------------------------------------------
| User Type
|--------------------------------------------------------------------------
*/
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

/*
|--------------------------------------------------------------------------
| Root Query
|--------------------------------------------------------------------------
*/
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",

  fields: {
    users: {
      type: new GraphQLList(UserType),

      async resolve() {
        return await User.find().select("-password");
      },
    },
  },
});

/*
|--------------------------------------------------------------------------
| Schema
|--------------------------------------------------------------------------
*/
const schema = new GraphQLSchema({
  query: RootQuery,
});

module.exports = schema;