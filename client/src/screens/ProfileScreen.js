import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import AuthContext from "../context/auth";
import { useContext, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

// const GET_USER = gql`
//   query LoggedInUser {
//     loggedInUser {
//       _id
//       name
//       username
//       email
//     }
//   }
// `;

const GET_USER = gql`
  query LoggedInUser {
    loggedInUser {
      _id
      name
      username
      email
    }
  }
`;

const GET_FOLLOWER = gql`
  query FindFollower($id: ID) {
    findFollower(_id: $id) {
      _id
      Follower {
        _id
        name
        username
        email
      }
    }
  }
`;

const GET_FOLLOWING = gql`
  query FindFollowing($id: ID) {
    findFollowing(_id: $id) {
      _id
      Following {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function ProfileScreen() {
  const auth = useContext(AuthContext);

  const { loading, error, data, refetch } = useQuery(GET_USER);
  // console.log(loading, error, data);

  useEffect(() => {
    if (!loading && !error && data) {
      refetch();
    }
    // refetch();
    // followerRefetch();
    // followingRefetch();
  }, [data]);

  const {
    loading: followerLoading,
    error: followerError,
    data: followerData,
    refetch: followerRefetch,
  } = useQuery(GET_FOLLOWER, {
    variables: {
      id: data?.loggedInUser._id,
    },
  });

  const {
    loading: followingLoading,
    error: followingError,
    data: followingData,
    refetch: followingRefetch,
  } = useQuery(GET_FOLLOWING, {
    variables: {
      id: data?.loggedInUser._id,
    },
  });

  let follower = [];
  let following = [];

  if (loading || followerLoading || followingLoading) {
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
  if (error || followerError || followingError) {
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

  // console.log(followerData);

  const renderFollowingItem = ({ item }) => (
    <Text style={styles.text}>{item.Following.username}</Text>
  );

  const renderFollowerItem = ({ item }) => (
    <Text style={styles.text}>{item.Follower.username}</Text>
  );

  return (
    <View contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.profileContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.text}>{data?.loggedInUser?.name}</Text>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.text}>{data?.loggedInUser?.username}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{data?.loggedInUser?.email}</Text>
        <View style={{ marginTop: 25 }}>
          <Button
            title="Logout"
            onPress={async () => {
              await SecureStore.deleteItemAsync("access_token");
              auth.setIsSignedIn(false);
            }}
          />
        </View>
      </View>
      <View style={styles.followContainer}>
        <View style={styles.following}>
          <Text style={styles.title}>
            Following {`(${followingData?.findFollowing.length})`}
          </Text>
          <FlatList
            data={followingData?.findFollowing}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFollowingItem}
          />
        </View>
        <View style={styles.followers}>
          <Text style={styles.title}>
            Followers {`(${followerData?.findFollower.length})`}
          </Text>
          <FlatList
            data={followerData?.findFollower}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFollowerItem}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  profileContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  followContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  following: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    alignItems: "center",
  },
  followers: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});
