import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { UID, SECRET } from "@env";
import HomePage from "./src/View/HomePage.js";
import ProfileScreen from "./src/View/ProfileScreen.js";
// import * as SplashScreen from 'expo-splash-screen';

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

// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    // SplashScreen.show()
    axios
        .post(
          "https://api.intra.42.fr/oauth/token",
          `grant_type=client_credentials&client_id=${UID}&client_secret=${SECRET}`
        )
        .then((response) => {
          console.log('sisi')
          // SplashScreen.hideAsync();
          setAccessToken(response.data.access_token);
          setInterval(() => {
            console.log("oui");
            axios
              .post(
                "https://api.intra.42.fr/oauth/token",
                `grant_type=client_credentials&client_id=${UID}&client_secret=${SECRET}`
              )
              .then((response) => {
                setAccessToken(response.data.access_token);
              })
              .catch((error) => {});
          }, 720000);
        })
        .catch((error) => {});
    
  }, []);

  useEffect(() => {
   console.log(accessToken)
  }, [accessToken]);

  if (accessToken == '')
    return (<></>)

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ title: "Home" }}
          initialParams={{accessToken: accessToken}}
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
