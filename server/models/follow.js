const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const { GraphQLError } = require("graphql");

class Follow {
  static collection() {
    return database.collection("Follow");
  }

  static async findFollowing(_id) {
    const followCollection = this.collection();
    return await followCollection
      .aggregate([
        {
          $match: {
            followerId: new ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "followingId",
            foreignField: "_id",
            as: "Following",
          },
        },
        {
          $unwind: {
            path: "$Following",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "Following.password": 0,
          },
        },
      ])
      .toArray();
  }

  static async findFollower(_id) {
    const followCollection = this.collection();
    return await followCollection
      .aggregate([
        {
          $match: {
            followingId: new ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "followerId",
            foreignField: "_id",
            as: "Follower",
          },
        },
        {
          $unwind: {
            path: "$Follower",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            "Follower.password": 0,
          },
        },
      ])
      .toArray();
  }

  static async findFollowById(_id) {
    const followCollection = this.collection();
    const data = followCollection.findOne({
      _id: new ObjectId(String(_id)),
    });
    return data;
  }

  static async createFollow(followingId, followerId) {
    const followCollection = this.collection();

    const existingFollow = await followCollection.findOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
    });

    if (existingFollow) {
      throw new GraphQLError("User already followed", {
        extensions: { code: "BAD_REQUEST" },
      });
    }
    if (followingId === followerId) {
      throw new GraphQLError("Cannot follow yourself", {
        extensions: { code: "BAD_REQUEST" },
      });
    }

    return followCollection.insertOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

module.exports = Follow;
