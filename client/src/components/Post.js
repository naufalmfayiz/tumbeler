import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Post({ post }) {
  const renderComments = () => {
    return post.comments.map((comment, index) => (
      <View key={index} style={styles.commentContainer}>
        <Text style={styles.commentUsername}>{comment.username}</Text>
        <Text style={styles.comment}>{comment.content}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{post.Author.username}</Text>
      </View>
      <Image source={{ uri: post.imgUrl }} style={styles.image} />
      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.content}>
        {post.tags.map((tag) => `#${tag}`).join(" ")}
      </Text>
      <View style={styles.footer}>
        <Text>{post.likes.length}</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ marginRight: 10 }}>{post.comments.length}</Text>
        <TouchableOpacity>
          <Ionicons name="chatbox-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* {renderComments()} */}
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },
  content: {
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  comment: {
    marginRight: 5,
  },
  commentUsername: {
    fontWeight: "bold",
    marginRight: 5,
  },
});
