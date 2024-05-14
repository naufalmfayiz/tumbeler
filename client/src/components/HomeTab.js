import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import AddPostScreen from "../screens/AddPostScreen";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function HomeTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        headerTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#00215E",
        },
        headerStyle: {
          backgroundColor: "#00215E",
        },
        headerTitleStyle: {
          color: "white",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Foundation name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Add Post"
        component={AddPostScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Foundation name="pencil" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Search User"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome name="search" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome name="user" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
