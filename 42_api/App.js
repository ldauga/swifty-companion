import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, View, Animated, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { UID, SECRET } from "@env";
import HomePage from "./src/View/HomePage.js";
import ProfileScreen from "./src/View/ProfileScreen.js";
import { SplashScreen } from "./src/Component/SplashScreen.js";
import { Text } from "react-native";
import TextAnimator from "./src/Component/TextAnimator.js";

const Stack = createNativeStackNavigator();

const MyTheme = {
  colors: {
    primary: "purple",
    background: "rgb(50, 50, 50)",
    card: "black",
    text: "white",
    border: "black",
    notification: "purple",
  },
};

function isPortrait() {
  const dim = Dimensions.get("screen");
  return dim.height >= dim.width;
}

export default function App() {
  const [accessToken, setAccessToken] = useState("");
  const splashRef = useRef(null);
  const textRef = useRef(null);
  const [displaySplashScreen, setDisplaySplashScreen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setOrientation(isPortrait() ? "PORTRAIT" : "LANDSCAPE");
      }
    );
    return () => subscription?.remove();
  }, []);

  const [orientation, setOrientation] = useState(
    isPortrait() ? "PORTRAIT" : "LANDSCAPE"
  );

  useEffect(() => {
    axios
      .post(
        "https://api.intra.42.fr/oauth/token",
        `grant_type=client_credentials&client_id=${UID}&client_secret=${SECRET}`
      )
      .then((response) => {
        setAccessToken(response.data.access_token);
        splashRef.current.unshow(1000);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setInterval(() => {
          axios
            .post(
              "https://api.intra.42.fr/oauth/token",
              `grant_type=client_credentials&client_id=${UID}&client_secret=${SECRET}`
            )
            .then((response) => {
              setAccessToken(response.data.access_token);
            })
            .catch((error) => {});
        }, 710000);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    console.log("accessToken :", accessToken);
  }, [accessToken]);

  if (loading)
    return (
      <View
        style={{ backgroundColor: "rgb(50, 50, 50)" }}
        onTouchStart={() => {
          splashRef.current.show(1000);
        }}
      >
        <SplashScreen ref={splashRef} display={displaySplashScreen}>
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgb(50, 50, 50)",
              zIndex: 9999,
            }}
          >
            <View
              style={
                orientation == "PORTRAIT"
                  ? {
                      display: "flex",
                      alignSelf: "center",
                      marginTop: "25%",
                      width: "90%",
                      height: "50%",
                    }
                  : {
                      marginVertical: "10%",
                      width: "30%",
                      height: "60%",
                      marginHorizontal: "10%",
                    }
              }
            >
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png",
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </View>
        </SplashScreen>
      </View>
    );

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ title: "Home" }}
          initialParams={{ accessToken: accessToken }}
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
