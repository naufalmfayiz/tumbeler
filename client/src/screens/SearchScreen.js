import { View, TextInput, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import SearchedProfile from "../components/SearchedProfile";
import { useQuery, gql, useMutation } from "@apollo/client";

const SEARCH_USERS = gql`
  query SearchUsers($name: String!) {
    searchUsers(name: $name) {
      _id
      name
      username
      email
    }
  }
`;

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { name: searchTerm },
  });
  // console.log(loading, error, data);

  const handleSearch = () => {
    setSearchResults(data.searchUsers);
    // console.log(searchTerm);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by user/username"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onEndEditing={handleSearch}
      />
      <FlatList
        style={styles.list}
        data={searchResults}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <SearchedProfile user={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
  },
});
