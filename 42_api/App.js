import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  RootTagContext,
} from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Button } from "react-native-paper";
import { ShakeDiv } from "./src/Component/ShakeDiv";
import axios from "axios";
import Svg, { Path, Polygon, SvgUri } from "react-native-svg";
import { UID, SECRET } from "@env";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import HomePage from "./src/View/HomePage.js";
import ProfileScreen from "./src/View/ProfileScreen.js";

const Stack = createNativeStackNavigator();

const MyTheme = {
  colors: {
    primary: "purple",
    background: "rgb(20, 20, 20)",
    card: "black",
    text: "white",
    border: "black",
    notification: "purple",
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ title: "Home" }}
        />
        <Stack.Screen name="Info Stud" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
