const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const { GraphQLError } = require("graphql");

class Post {
  static collection() {
    return database.collection("Posts");
  }

  static async findPosts() {
    return this.collection()
      .aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "authorId",
            foreignField: "_id",
            as: "Author",
          },
        },
        {
          $unwind: {
            path: "$Author",
            preserveNullAndEmptyArrays: false,
          },
        },
      ])
      .toArray();
  }

  static async findPostById(_id) {
    const data = await this.collection()
      .aggregate([
        {
          $match: {
            _id: new ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "authorId",
            foreignField: "_id",
            as: "Author",
          },
        },
        {
          $unwind: {
            path: "$Author",
            preserveNullAndEmptyArrays: false,
          },
        },
      ])
      .toArray();

    return data[0];
  }

  static async createPost({ content, tags, imgUrl, authorId }) {
    const schema = Joi.object({
      content: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (value.trim() === "") {
            return helpers.error("any.required");
          }
          return value;
        }),
      authorId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (value.trim() === "") {
            return helpers.error("any.required");
          }
          return value;
        }),
    });
    const { error } = schema.validate({ content, authorId });
    if (error) {
      throw new GraphQLError(error.details[0].message, {
        extensions: { code: "BAD_REQUEST" },
      });
    }

    return this.collection().insertOne({
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(String(authorId)),
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async addComment(_id, content, username) {
    const postsCollection = this.collection();

    const data = postsCollection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $push: {
          comments: {
            content,
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    );

    return data;
  }

  static async addLike(_id, username) {
    const postsCollection = this.collection();
    const searchLike = await this.findPostById(_id);

    const validateLike = searchLike.likes.find(
      (element) => element.username === username
    );

    if (!validateLike) {
      const data = postsCollection.updateOne(
        { _id: new ObjectId(_id) },
        {
          $push: {
            likes: {
              username,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }
      );
      return data;
    }

    if (validateLike) {
      const data = postsCollection.updateOne(
        { _id: new ObjectId(_id) },
        {
          $pull: {
            likes: {
              username,
            },
          },
        }
      );
      return data;
    }
  }
}

module.exports = Post;
