const Follow = require("../models/follow");

const resolvers = {
  Query: {
    findFollowing: async (_, args) => {
      const { _id } = args;
      const data = await Follow.findFollowing(_id);

      return data;
    },
    findFollower: async (_, args) => {
      const { _id } = args;
      const data = await Follow.findFollower(_id);

      return data;
    },
  },
  Mutation: {
    followUser: async (_, args, contextValue) => {
      const auth = contextValue.authentication();

      const { followingId } = args;
      const data = await Follow.createFollow(
        followingId,
        (followerId = auth._id)
      );

      const result = await Follow.findFollowById(data.insertedId);
      return result;
    },
  },
};

module.exports = resolvers;
