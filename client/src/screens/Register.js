import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery, useMutation } from "@apollo/client";

const REGISTER = gql`
  mutation AddUser($newUser: newUser) {
    addUser(newUser: $newUser) {
      _id
      name
      username
      email
      password
    }
  }
`;

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [addUser, { loading, error, data }] = useMutation(REGISTER);
  // console.log(loading, error, data);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error.toString().slice(13));
    }
    if (data) {
      Alert.alert("Success", `Account registered succesfully`);
      navigation.navigate("Login");
    }
  }, [error, data]);

  const handleRegister = () => {
    addUser({
      variables: {
        newUser: {
          email: email,
          name: name,
          password: password,
          username: username,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>tumbeler</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? Login </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#00215E",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});
