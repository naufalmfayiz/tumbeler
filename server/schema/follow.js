const typeDefs = `#graphql

  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
    Following: Following
    Follower: Follower
  }

  type Following{
    _id: ID
    name: String
    username: String
    email: String
  }

  type Follower{
    _id: ID
    name: String
    username: String
    email: String
  }


  # ROUTING
  # GET
  type Query {
    findFollowing(_id: ID): [Follow]
    findFollower(_id: ID): [Follow]
  }


  # Selain GET
  type Mutation {
    followUser(followingId: String): Follow
  }

`;

module.exports = typeDefs;
