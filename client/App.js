import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import Login from "./src/screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "./src/screens/Register";
import DetailScreen from "./src/screens/DetailScreen";
import HomeTab from "./src/components/HomeTab";
import { ApolloProvider } from "@apollo/client";
import client from "./src/config/apolloConnection";
import { useEffect, useState } from "react";
import AuthContext from "./src/context/auth";
import * as SecureStore from "expo-secure-store";

const Stack = createNativeStackNavigator();

export default function App() {
  let [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("access_token")
      .then((result) => {
        if (result) {
          setIsSignedIn(true);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator>
            {!isSignedIn ? (
              <>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="HomeTab"
                  component={HomeTab}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Detail" component={DetailScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
