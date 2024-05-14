import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_POST_BY_ID = gql`
  query FindPostById($id: ID) {
    findPostById(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      Author {
        _id
        name
        username
        email
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation AddComment($id: ID, $content: String) {
    addComment(_id: $id, content: $content) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      Author {
        _id
        name
        username
        email
      }
    }
  }
`;

const ADD_LIKE = gql`
  mutation AddLike($id: ID) {
    addLike(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      Author {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function DetailScreen({ route }) {
  const { postId } = route.params;
  const [newComment, setNewComment] = useState("");

  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: {
      id: postId,
    },
  });
  // console.log(data, loading, error);

  const [addComment] = useMutation(CREATE_COMMENT);
  // console.log(data, loading, error);

  const [addLike] = useMutation(ADD_LIKE);
  // console.log(data, loading, error);

  const handleAddComment = () => {
    addComment({
      variables: {
        id: post._id,
        content: newComment,
      },
    });

    console.log("Adding comment:", newComment);
    // console.log(post._id);
    setNewComment("");
  };

  const handleAddLike = () => {
    addLike({
      variables: {
        id: post._id,
      },
    });
  };

  let post = {};
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  } else {
    post = data.findPostById;
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Something went wrong</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
          }}
          style={styles.profilePhoto}
        />
        <Text style={styles.username}>{post.Author.username}</Text>
      </View>
      <Image source={{ uri: post.imgUrl }} style={styles.image} />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionIcon} onPress={handleAddLike}>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.likes}>{post.likes.length} likes</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{post.content}</Text>
        <Text style={styles.tags}>
          {post.tags.map((tag) => `#${tag}`).join(" ")}
        </Text>
      </View>
      <Text style={styles.commentsTitle}>Comments:</Text>
      <FlatList
        data={post.comments}
        keyExtractor={(item) => item.createdAt}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUsername}>{item.username}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          onChangeText={setNewComment}
          value={newComment}
          placeholder="Add a comment..."
        />
        <TouchableOpacity style={styles.postButton} onPress={handleAddComment}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  actionIcon: {
    marginRight: 10,
  },
  likes: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  contentContainer: {
    padding: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 5,
  },
  tags: {
    fontSize: 14,
    color: "black",
    marginBottom: 5,
  },
  createdAt: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  updatedAt: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  commentContent: {
    flex: 1,
    fontSize: 13,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 7,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  postButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#318bfb",
    borderRadius: 5,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
