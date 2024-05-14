const typeDefs = `#graphql

  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
  }

  type SearchUser {
    _id: ID
    name: String
    username: String
    email: String
  }


  type UserCredential {
    access_token: String
    email: String
  }

  input newUser {
    name: String!
    username: String! 
    email: String! 
    password: String! 
  }
  
  # ROUTING
  # GET
  type Query {
    findUsers: [User]
    findUserById(_id: ID): User
    searchUsers(name: String!): [SearchUser]
    loggedInUser: User
  }

  # Selain GET
  type Mutation {
    addUser(newUser: newUser): User
    login(email: String, password: String): UserCredential
  }

`;

module.exports = typeDefs;
