if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const userTypeDefs = require("./schema/user");
const postTypeDefs = require("./schema/post");
const followTypeDefs = require("./schema/follow");

const userResolver = require("./resolvers/user");
const postResolver = require("./resolvers/post");
const followResolver = require("./resolvers/follow");

const { GraphQLError } = require("graphql");
const { verifyToken } = require("./helper/jwt");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolver, postResolver, followResolver],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req }) => {
    return {
      authentication: () => {
        const authorizationHeader = req.headers.authorization || "";
        const token = authorizationHeader.split(" ")[1];
        if (!token) {
          throw new GraphQLError("Access Token must be provided", {
            extensions: { code: "NOT_AUTHORIZED" },
          });
        }

        const decodeToken = verifyToken(token);
        if (!token) {
          throw new GraphQLError("Access Token must be provided", {
            extensions: { code: "NOT_AUTHORIZED" },
          });
        }

        return decodeToken;
      },
    };
  },
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((error) => console.log(error));
