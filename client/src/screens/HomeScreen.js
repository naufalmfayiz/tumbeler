import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Post from "../components/Post";
import { useQuery, gql } from "@apollo/client";

const GET_POSTS = gql`
  query FindPost {
    findPost {
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

export default function HomeScreen({ navigation }) {
  const { loading, error, data } = useQuery(GET_POSTS);
  // console.log(loading, error, data);

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

  const renderPost = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Detail", { postId: item._id })}
    >
      <Post post={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data.findPost}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  list: {
    padding: 10,
  },
});
