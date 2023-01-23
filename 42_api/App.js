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

{
  /* <svg>
  <g id="banner-content">
    <g
      id="UI-Intranet-banner-content"
      transform="translate(-96.000000, -60.000000)"
    >
      <g id="banner-content-g-1" transform="translate(96.000000, 60.000000)">
        <polygon
          id="banner-content-polygon-1"
          points="0,0 0,80.5 34.3,104 68,80.5 68,0"
        ></polygon>
      </g>
    </g>
  </g>
</svg>; */
}

const Stack = createNativeStackNavigator();

const HomePage = ({ navigation }) => {
  const styles = StyleSheet.create({
    main_container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // backgroundColor: "green",
    },
    img_container: {
      marginVertical: "10%",
      width: "80%",
      height: "30%",
      // backgroundColor: "red",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    text_container: {
      width: "80%",
      display: "flex",
      alignItems: "center",
      // te: 'large',
      // height: '10%',
      // backgroundColor: "red",
    },
    text: {
      fontSize: "30",
      textAlign: "center",
      color: "white",
    },
    text_input: {
      marginTop: "10%",
      width: "80%",
      // height: '5%',
      backgroundColor: "black",
      borderRadius: "10",
      fontSize: "25",
      padding: "2%",
      color: "white",
    },
  });

  const [textInputValue, setTextInputValue] = useState("ldauga");

  const shakeRef = useRef(null);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View
        style={styles.main_container}
        onTouchStart={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.img_container}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png",
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.text_container}>
          <Text style={styles.text}>
            Search 42 student's login to display his info !
          </Text>
        </View>
        <ShakeDiv ref={shakeRef}>
          <TextInput
            style={styles.text_input}
            placeholder="login"
            value={textInputValue}
            onChangeText={(value) => setTextInputValue(value)}
          />
        </ShakeDiv>
        <Button
          icon="magnify"
          mode="contained"
          style={{ marginTop: "20%" }}
          // disabled={textInputValue == ''}
          onPress={() => {
            // console.log(UID)

            if (textInputValue != "") {
              navigation.navigate("Info Stud", { login: textInputValue });
              // setTextInputValue("");
            } else {
              shakeRef.current.startShake();
            }
          }}
        >
          Search
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const ProfileScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userDisplay, setUserDisplay] = useState(null);
  const [userProject, setUserProject] = useState(null);
  const [selectedCursus, setSelectedCursus] = useState("");

  const [userCoa, setUserCoa] = useState(null);

  const styles = StyleSheet.create({
    main_container_loading_error: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      alignItems: "center",
    },
    main_container_profile: {
      width: "100%",
      height: "100%",
      // backgroundColor: "red"
    },
    info_user_container: {
      width: "100%",
      height: "40%",
      // display: "flex",
      // flexDirection: "row",
      // backgroundColor: "green"
    },
  });

  useEffect(() => {
    console.log("useEffect");
    // if (userDisplay != null)
    // console.log("useEffect", userDisplay.cursus_users[0].has_coalition);
    if (accessToken == "") {
      const timeoutId = setTimeout(() => {
        axios
          .post(
            "https://api.intra.42.fr/oauth/token",
            `grant_type=client_credentials&client_id=${UID}&client_secret=${SECRET}`
          )
          .then((response) => {
            setAccessToken(response.data.access_token);
            // console.log("auth", response.data.access_token);
            clearTimeout(timeoutId);
          })
          .catch((error) => {
            console.log("tocken err", error);
            setError(true);
          });

      }, 1000)
    } else if (userDisplay == null) {
      axios
        .get(
          "https://api.intra.42.fr/v2/users/" +
            route.params.login.toLowerCase(),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(Object.keys(response.data.cursus_users));
          // console.log(response.data);
          // console.log(response.data.cursus_users[1]);
          setUserDisplay(response.data);

          if (!response.data.cursus_users[0].has_coalition) {
            const timeout_id = setTimeout(() => {
              setLoading(false);
              clearInterval(timeout_id);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log("user err", err);
          setError(true);
        });
    } else if (userDisplay.cursus_users[0].has_coalition && userCoa == null) {
      axios
        .get(
          "https://api.intra.42.fr/v2/users/" +
            route.params.login.toLowerCase() +
            "/coalitions",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(Object.keys(response.data[0]));
          console.log(response.data);
          setUserCoa(response.data);
          // console.log(response.data);

          // setUserDisplay(response.data);
          const timeout_id = setTimeout(() => {
            setLoading(false);
            clearInterval(timeout_id);
          }, 1000);
        })
        .catch((err) => {
          console.log("coa err", err);
          setError(true);
        });
    }
  }, [accessToken, userDisplay, userProject]);

  useEffect(() => {
    if (userDisplay != null) {
      axios
        .get(
          `https://api.intra.42.fr/v2/users/${route.params.login.toLowerCase()}/projects_users?page[size]=100&filter[status]=finished`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log(Object.keys(response.data[0]));
          console.log(response.data.length);
          setUserProject(response.data);
        })
        .catch((err) => {
          console.log(Object.keys(err));
          console.log("project err", err);
          setError(true);
        });
      setSelectedCursus((userDisplay.cursus_users.length - 1).toString());
    }
  }, [loading]);

  useEffect(() => {
    if (userDisplay != null) {
    }
  }, [selectedCursus]);

  if (error)
    return (
      <View style={styles.main_container_loading_error}>
        <Icon name="warning" size={"100%"} color="white"></Icon>
        <Text
          style={{ fontSize: 20, color: "white", marginTop: "2%" }}
        >{`${route.params.login}'s profile wasn't found, try again`}</Text>
        <Button
          icon="home"
          mode="contained"
          style={{ marginTop: "20%", backgroundColor: "purple" }}
          // disabled={textInputValue == ''}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          Back to home
        </Button>
      </View>
    );

  if (loading)
    return (
      <View style={styles.main_container_loading_error}>
        <ActivityIndicator size="large" color="purple"></ActivityIndicator>
        <Text
          style={{ color: "white", marginTop: "10%", fontSize: 20 }}
        >{`Searching for ${route.params.login} profile`}</Text>
      </View>
    );

  return (
    <View style={styles.main_container_profile}>
      <View style={styles.info_user_container}>
        {userCoa != null ? (
          <Image
            source={{
              uri: userCoa[Math.floor(selectedCursus) ? 0 : 1].cover_url,
            }}
            style={{ height: "100%", width: "100%", position: "absolute" }}
          ></Image>
        ) : (
          <></>
        )}
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ height: "80%", width: "50%", display: "flex" }}>
            <View
              style={{
                width: "90%",
                height: "80%",
                // backgroundColor: "yellow",
                marginTop: "5%",
                marginHorizontal: "5%",
              }}
            >
              <Image
                source={{ uri: userDisplay.image.link }}
                style={{ height: "100%", width: "auto" }}
              ></Image>
            </View>
            <View
              style={{
                width: "90%",
                height: "15%",
                backgroundColor: "#FFFFFFAA",
                borderRadius: "10",
                // opacity: '0.5',
                marginTop: "5%",
                marginHorizontal: "5%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: "20" }}>{`Login: `}</Text>
              <Text
                style={{ fontSize: "20", fontWeight: "900", color: "black" }}
              >
                {userDisplay.login}
              </Text>
            </View>
          </View>
          <View style={{ height: "80%", width: "50%", display: "flex" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "25.5%",
                // backgroundColor: "red",
              }}
            >
              <View
                style={{
                  width: "70%",
                  height: "90%",
                  marginVertical: "5%",
                  // backgroundColor: "red",
                  backgroundColor: "#00000088",
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: "black",
                  borderRadius: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: "10",
                    marginLeft: "2%",
                    marginTop: "2%",
                    color: "white",
                    height: "20%",
                  }}
                >
                  BlackHole at :
                </Text>
                <Text
                  style={{
                    fontSize: "20",
                    alignSelf: "center",
                    marginTop: "auto",
                    marginBottom: "auto",
                    color: "white",
                    width: "96%",
                    height: "40%",
                    display: "flex",
                    textAlign: "center",
                  }}
                >
                  {userDisplay.cursus_users[Math.floor(selectedCursus)]
                    .blackholed_at != null
                    ? `${new Date(
                        userDisplay.cursus_users[
                          Math.floor(selectedCursus)
                        ].blackholed_at
                      ).getDate()} / ${
                        new Date(
                          userDisplay.cursus_users[
                            Math.floor(selectedCursus)
                          ].blackholed_at
                        ).getMonth() + 1
                      } / ${new Date(
                        userDisplay.cursus_users[
                          Math.floor(selectedCursus)
                        ].blackholed_at
                      ).getFullYear()}
                      `
                    : "null"}
                </Text>
              </View>
              {userCoa != null ? (
                <View
                  style={{
                    width: 50,
                    height: 60,
                    // display
                    marginLeft: "auto",
                    marginRight: "2%",
                    // backgroundColor: "red",
                  }}
                >
                  <Svg
                    style={{ position: "absolute", zIndex: -1 }}
                    fill={"black"}
                    width={50}
                    height={75}
                  >
                    <Polygon points="0,0 50,0 50,50 25,75 0,50"></Polygon>
                  </Svg>
                  <SvgUri
                    style={{ position: "absolute" }}
                    uri={userCoa[Math.floor(selectedCursus) ? 0 : 1].image_url}
                    fill={"white"}
                  ></SvgUri>
                </View>
              ) : (
                <></>
              )}
            </View>
            <View
              style={{
                height: "70%",
                width: "90%",
                marginTop: "10%",
                backgroundColor: "#00000088",
                marginHorizontal: "5%",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "black",
                borderRadius: 15,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  height: "30%",
                  width: "100%",
                  marginTop: "3%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>Cursus :</Text>
                <Picker
                  style={{
                    // marginLeft: "auto",
                    // marginRight: "1%",
                    width: "65%",
                    height: "70%",
                  }}
                  itemStyle={{
                    width: "100%",
                    height: "100%",
                    color: "white",
                    fontSize: 10,
                    fontWeight: "900",
                    backgroundColor: "#00000055",
                  }}
                  selectedValue={selectedCursus}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedCursus(itemValue)
                  }
                >
                  {userDisplay.cursus_users.map((item, index) => (
                    <Picker.Item
                      key={index.toString()}
                      label={item.cursus.name}
                      value={index.toString()}
                    />
                  ))}
                  {/* <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" /> */}
                </Picker>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  height: "30%",
                  width: "100%",
                  marginTop: "3%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>Wallet :</Text>
                <Text
                  style={{
                    color: "white",
                    width: "65%",
                    textAlign: "center",
                  }}
                >
                  {`${userDisplay.wallet} ₳`}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  height: "30%",
                  width: "100%",
                  marginTop: "3%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>Evaluation points :</Text>
                <Text
                  style={{
                    color: "white",
                    width: "27%",
                    textAlign: "center",
                  }}
                >
                  {`${userDisplay.correction_point}`}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            height: "15%",
            width: "90%",
            backgroundColor: "#FFFFFF66",
            marginHorizontal: "5%",
            borderRadius: 15,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              fontWeight: "900",
              color: "#000000",
            }}
          >{`Level ${Math.round(
            userDisplay.cursus_users[Math.floor(selectedCursus)].level - 0.5
          )} (${Math.floor(
            (userDisplay.cursus_users[Math.floor(selectedCursus)].level -
              Math.round(
                userDisplay.cursus_users[Math.floor(selectedCursus)].level - 0.5
              )) *
              100 -
              0.5
          )}%)`}</Text>
          <View
            style={{
              height: "100%",
              width: `${Math.floor(
                (userDisplay.cursus_users[Math.floor(selectedCursus)].level -
                  Math.round(
                    userDisplay.cursus_users[Math.floor(selectedCursus)].level -
                      0.5
                  )) *
                  100 -
                  0.5
              )}%`,
              backgroundColor: "#AAAAFF",
              position: "absolute",
              zIndex: -1,
            }}
          ></View>
        </View>
      </View>
      <ScrollView style={{ maxHeight: "50%" }}>
        <View
          style={{
            width: "95%",
            height: 500,
            // backgroundColor: "green",
            marginHorizontal: "2.5%",
            marginTop: "5%",
          }}
        >
          {userProject != null && userProject.filter(item => item.cursus_ids[0] == userDisplay.cursus_users[Math.floor(selectedCursus)].cursus.id).map(item => <Text>{item.project.name}</Text>)}
        </View>

        <View
          style={{
            width: "95%",
            height: 200,
            // backgroundColor: "green",
            marginHorizontal: "2.5%",
            marginTop: "5%",
          }}
        ></View>
      </ScrollView>

      {/* <Text>This is {route.params.login}'s profile</Text> */}
    </View>
  );
};

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
