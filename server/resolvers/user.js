const User = require("../models/user");

const resolvers = {
  Query: {
    findUsers: async () => {
      const data = await User.findUsers();
      // console.log(data);
      return data;
    },
    findUserById: async (_, args) => {
      const { _id } = args;
      const data = await User.findUserById(_id);
      return data;
    },
    searchUsers: async (_, args) => {
      const { name } = args;
      const data = await User.searchUsers(name);
      return data;
    },
    loggedInUser: async (_, args, contextValue) => {
      const auth = contextValue.authentication();
      const data = await User.findLoggedInUSer(auth._id);
      console.log(auth);
      return data;
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const { name, username, email, password } = args.newUser;
      const data = await User.createUser({
        name,
        username,
        email,
        password,
      });
      // console.log(data);

      const result = await User.findUserById(data.insertedId);
      return result;
    },
    login: async (_, args) => {
      const { email, password } = args;
      const result = await User.login(email, password);

      return result;
    },
  },
};

module.exports = resolvers;
