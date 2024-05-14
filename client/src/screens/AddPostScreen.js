import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const CREATE_POST = gql`
  mutation AddPost($newPost: newPost) {
    addPost(newPost: $newPost) {
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

export default function AddPostScreen() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const navigation = useNavigation();

  const [addPost, { data, loading, error }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      navigation.navigate("Home");
    },
    refetchQueries: ["FindPost"],
  });
  // console.log(data, loading, error);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error.toString().slice(13));
    }
  }, [error]);

  const handleAddPost = () => {
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    addPost({
      variables: {
        newPost: {
          content: content,
          imgUrl: imgUrl,
          tags: tagsArray,
        },
      },
    });

    console.log("Content:", content);
    console.log("Tags:", tagsArray);
    console.log("Image URL:", imgUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setContent}
        value={content}
        placeholder="Enter post content"
        multiline
      />
      <Text style={styles.label}>Tags:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTags}
        value={tags}
        placeholder="Enter tags (comma-separated)"
      />
      <Text style={styles.label}>Image URL:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setImgUrl}
        value={imgUrl}
        placeholder="Enter image URL"
      />
      <Button title="Add Post" onPress={handleAddPost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
