import { useContext, useEffect, useState } from "react";
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
import { gql, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import AuthContext from "../context/auth";

const LOGIN = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      access_token
      email
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const auth = useContext(AuthContext);

  const [login, { loading, error, data }] = useMutation(LOGIN, {
    onCompleted: async (mutationResult) => {
      // console.log(mutationResult.login.access_token);
      if (mutationResult?.login?.access_token) {
        await SecureStore.setItemAsync(
          "access_token",
          mutationResult?.login?.access_token
        );
      }
      auth.setIsSignedIn(true);
    },
  });
  // console.log(loading, error, data);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error.toString().slice(13));
    }
    // if (data) {
    //   Alert.alert("Success", `Account registered succesfully`);
    //   navigation.navigate("Login");
    // }
  }, [error]);

  const handleLogin = () => {
    login({
      variables: {
        email: email,
        password: password,
      },
    });
    // navigation.navigate("HomeTab");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>tumbeler</Text>
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
      <Button title="Login" onPress={handleLogin} />

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Don't have an account? Register{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>here</Text>
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
  registerContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});
