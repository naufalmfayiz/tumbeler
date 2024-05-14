const typeDefs = `#graphql

  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comments]
    likes: [Likes]
    createdAt: String
    updatedAt: String
    Author: Author
  }

  type Author {
    _id: ID
    name: String
    username: String
    email: String
  }

  type Comments {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Likes {
    username: String
    createdAt: String
    updatedAt: String
  }
  
  
  input newPost {
    content: String
    tags: [String]! 
    imgUrl: String 
  }
  
  # ROUTING
  # GET
  type Query {
    findPost: [Post]
    findPostById(_id: ID): Post
  }


  # Selain GET
  type Mutation {
    addPost(newPost: newPost): Post
    addComment(_id: ID, content: String): Post
    addLike(_id: ID): Post
  }

`;

module.exports = typeDefs;
