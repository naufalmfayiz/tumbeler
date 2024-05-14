import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";

const FOLLOW_USER = gql`
  mutation FollowUser($followingId: String) {
    followUser(followingId: $followingId) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export default function SearchedProfile({ user }) {
  const [followUser, { loading, error, data }] = useMutation(FOLLOW_USER, {
    refetchQueries: ["FindFollower", "FindFollowing"],
  });
  console.log(loading, error, data);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error.toString().slice(13));
    }
    if (data) {
      Alert.alert("Success", `${user.username} followed!`);
    }
  }, [error, data]);

  const handleFollow = async (_id) => {
    followUser({
      variables: {
        followingId: _id,
      },
    });
    // console.log(`Following ${_id}`);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
      }}
    >
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <TouchableOpacity onPress={() => handleFollow(user._id)}>
        <Text style={{ color: "blue" }}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
