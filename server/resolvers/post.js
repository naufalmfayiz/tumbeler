const redis = require("../config/redis");
const Post = require("../models/post");
const User = require("../models/user");

const resolvers = {
  Query: {
    findPost: async () => {
      const posts = await redis.get("posts");
      // console.log(posts);
      if (posts) {
        return JSON.parse(posts);
      }

      const data = await Post.findPosts();

      await redis.set("posts", JSON.stringify(data));

      return data;
    },
    findPostById: async (_, args) => {
      const { _id } = args;
      const data = await Post.findPostById(_id);
      return data;
    },
  },
  Mutation: {
    addPost: async (_, args, contextValue) => {
      const auth = contextValue.authentication();

      const { content, tags, imgUrl } = args.newPost;
      const data = await Post.createPost({
        content,
        tags,
        imgUrl,
        authorId: auth._id,
      });
      // console.log(data);

      await redis.del("posts");
      return await Post.findPostById(data.insertedId);
    },

    addComment: async (_, args, contextValue) => {
      const auth = contextValue.authentication();

      const { _id, content } = args;
      const user = await User.findUserById(auth._id);

      const data = await Post.addComment(_id, content, user.username);

      await redis.del("posts");
      return await Post.findPostById(_id);
    },
    addLike: async (_, args, contextValue) => {
      const auth = contextValue.authentication();

      const { _id } = args;
      const user = await User.findUserById(auth._id);

      const data = await Post.addLike(_id, user.username);

      await redis.del("posts");
      return await Post.findPostById(_id);
    },
  },
};

module.exports = resolvers;
