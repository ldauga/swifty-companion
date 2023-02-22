import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import axios from "axios";
import Svg, { Polygon, SvgUri } from "react-native-svg";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import {
  displayProject,
  displayProjectInProgress,
} from "../Component/DisplayProject";
import { SplashScreen } from "../Component/SplashScreen";

function isPortrait() {
  const dim = Dimensions.get("screen");
  return dim.height >= dim.width;
}

const ProfileScreen = ({ navigation, route }) => {
  const [orientation, setOrientation] = useState(
    isPortrait() ? "PORTRAIT" : "LANDSCAPE"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openProject, setopenProject] = useState(false);
  const [openProjectInProgress, setopenProjectInProgress] = useState(false);
  const [openSkills, setopenSkills] = useState(false);
  const [userDisplay, setUserDisplay] = useState(null);
  const [userProject, setUserProject] = useState(null);
  const [selectedCursus, setSelectedCursus] = useState("");
  const [displaySplashScreen, setDisplaySplashScreen] = useState(true);
  const [displaySplashScreenBackground, setDisplaySplashScreenBackground] = useState(true);

  const [scrollGlobal, setScrollGlobal] = useState(true);

  const [userCoa, setUserCoa] = useState(null);

  const splashRef = useRef(null);
  const loadingSplashRef = useRef(null);

  const styles_portrait = StyleSheet.create({
    main_container_loading_error: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      alignItems: "center",
    },
    splash_screen_img_container: {
      display: "flex",
      alignSelf: "center",
      marginTop: "25%",
      width: "90%",
      height: "50%",
    },
    main_container_profile: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: -1,
    },
    info_user_container: {
      width: "100%",
      height: "40%",
    },
    info_user: {
      height: "80%",
      width: "50%",
      display: "flex",
    },
    user_profile_pic_container: {
      width: "90%",
      height: "80%",
      marginTop: "5%",
      marginHorizontal: "5%",
    },
    user_login_container: {
      width: "90%",
      height: "15%",
      backgroundColor: "#FFFFFFAA",
      borderRadius: 10,
      marginTop: "5%",
      marginHorizontal: "5%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
  });

  const styles_landscape = StyleSheet.create({
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
      display: "flex",
      flexDirection: "row",
      position: "absolute",
      zIndex: -1,
    },
    splash_screen_img_container: {
      marginVertical: "10%",
      width: "30%",
      height: "60%",
      marginHorizontal: "10%",
    },
    info_user_container: {
      width: "50%",
      height: "100%",
    },
    info_user: {
      height: "80%",
      width: "50%",
      display: "flex",
    },
    user_profile_pic_container: {
      width: "90%",
      height: "80%",
      marginTop: "5%",
      marginHorizontal: "5%",
    },
    user_login_container: {
      width: "90%",
      height: "15%",
      backgroundColor: "#FFFFFFAA",
      borderRadius: 10,
      marginTop: "5%",
      marginHorizontal: "5%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
  });

  useEffect(() => {
    if (userDisplay == null) {
      axios
        .get(
          "https://api.intra.42.fr/v2/users/" +
            route.params.login.toLowerCase().trim(),
          {
            headers: {
              Authorization: `Bearer ${route.params.accessToken}`,
            },
          }
        )
        .then((response) => {
          setUserDisplay(response.data);
          setUserProject(response.data.projects_users);

          if (response.data["staff?"] === true) {
            loadingSplashRef.current.unshow(1000);
            const timeout_id = setTimeout(() => {
              setLoading(false);
              clearInterval(timeout_id);
            }, 1000);
          }
        })
        .catch((err) => {
          setError(true);
        });
    } else if (
      userDisplay["staff?"] != true &&
      ((userCoa == null &&
        userDisplay.cursus_users != undefined &&
        userDisplay.cursus_users[0].has_coalition) ||
        (userCoa == null &&
          userDisplay.data.cursus_users != undefined &&
          userDisplay.data.cursus_users[0].has_coalition))
    ) {
      axios
        .get(
          "https://api.intra.42.fr/v2/users/" +
            route.params.login.toLowerCase().trim() +
            "/coalitions",
          {
            headers: {
              Authorization: `Bearer ${route.params.accessToken}`,
            },
          }
        )
        .then((response) => {
          setUserCoa(response.data);

          loadingSplashRef.current.unshow(1000);
          const timeout_id = setTimeout(() => {
            setLoading(false);
            clearInterval(timeout_id);
          }, 1000);
        })
        .catch((err) => {
          setError(true);
        });
    }
  }, [userDisplay]);

  useEffect(() => {
    if (userDisplay != null && userDisplay["staff?"] != true) {
      setSelectedCursus((userDisplay.cursus_users.length - 1).toString());
    }
    if (!loading && userDisplay != null) {
      splashRef.current.show(500);
      setTimeout(() => {

        setDisplaySplashScreenBackground(false)
        splashRef.current.unshow(1500);
        setTimeout(() => {
          setDisplaySplashScreen(false)
        }, 1500)
      }, 1000)
    }
  }, [loading]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setOrientation(isPortrait() ? "PORTRAIT" : "LANDSCAPE");
      }
    );
    return () => subscription?.remove();
  }, []);

  if (error)
    return (
      <View
        style={
          orientation == "PORTRAIT"
            ? styles_portrait.main_container_loading_error
            : styles_landscape.main_container_loading_error
        }
      >
        <Icon
          name="warning"
          style={orientation == "PORTRAIT" ? {} : { marginTop: "15%" }}
          size={100}
          color="white"
        ></Icon>
        <Text
          style={{ fontSize: 20, color: "white", marginTop: "2%" }}
        >{`${route.params.login}'s profile wasn't found, try again`}</Text>
        <Button
          icon="home"
          mode="contained"
          style={{ marginTop: "20%", backgroundColor: "purple" }}
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
      <SplashScreen ref={loadingSplashRef} duration={1000} display={true}>
        <View
          style={
            orientation == "PORTRAIT"
              ? styles_portrait.main_container_loading_error
              : styles_landscape.main_container_loading_error
          }
        >
          <ActivityIndicator size="large" color="purple"></ActivityIndicator>
          <Text
            style={{ color: "white", marginTop: "10%", fontSize: 20 }}
          >{`Searching for ${route.params.login
            .toLowerCase()
            .trim()} profile`}</Text>
        </View>
      </SplashScreen>
    );

  return (
    <>
    <View style={displaySplashScreenBackground ? {backgroundColor: 'rgb(50, 50, 50)'} : {}}>

      <SplashScreen ref={splashRef} duration={2000} display={displaySplashScreen}>
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
                ? styles_portrait.splash_screen_img_container
                : styles_landscape.splash_screen_img_container
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
      <View
        style={
          orientation == "PORTRAIT"
            ? styles_portrait.main_container_profile
            : styles_landscape.main_container_profile
        }
      >
        <View
          style={
            orientation == "PORTRAIT"
              ? styles_portrait.info_user_container
              : styles_landscape.info_user_container
          }
        >
          {userDisplay["staff?"] == true || userCoa != null ? (
            <Image
              source={{
                uri:
                  userDisplay["staff?"] != true
                    ? userCoa != null &&
                      userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                      ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1]
                          .cover_url
                      : userCoa[Math.floor(selectedCursus) ? 0 : 1].cover_url
                    : "https://wallpaperaccess.com/full/697601.jpg",
              }}
              style={{ height: "100%", width: "100%", position: "absolute" }}
            ></Image>
          ) : (
            <></>
          )}
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View
              style={
                orientation == "PORTRAIT"
                  ? styles_portrait.info_user
                  : styles_landscape.info_user
              }
            >
              <View
                style={
                  orientation == "PORTRAIT"
                    ? styles_portrait.user_profile_pic_container
                    : styles_landscape.user_profile_pic_container
                }
              >
                <Image
                  source={{ uri: userDisplay.image.link }}
                  style={{ height: "100%", width: "auto" }}
                ></Image>
              </View>
              <View
                style={
                  orientation == "PORTRAIT"
                    ? styles_portrait.user_login_container
                    : styles_landscape.user_login_container
                }
              >
                <Text style={{ fontSize: 20 }}>{`Login: `}</Text>
                <Text
                  style={{ fontSize: 20, fontWeight: "600", color: "black" }}
                >
                  {userDisplay.login}
                </Text>
              </View>
            </View>
            <View
              style={
                orientation == "PORTRAIT"
                  ? styles_portrait.info_user
                  : styles_landscape.info_user
              }
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  height: "25.5%",
                }}
              >
                <View
                  style={{
                    width: "70%",
                    height: "100%",
                    marginVertical: "5%",
                    backgroundColor: "#00000088",
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderColor: "black",
                    borderRadius: 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      marginLeft: "2%",
                      marginTop: "2%",
                      color: "white",
                    }}
                  >
                    BlackHole at :
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      alignSelf: "center",
                      color: "white",
                      width: "96%",
                      display: "flex",
                      textAlign: "center",
                    }}
                  >
                    {userDisplay["staff?"] != true
                      ? userDisplay.cursus_users[Math.floor(selectedCursus)]
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
                        : "null"
                      : "null"}
                  </Text>
                </View>
                {userCoa != null || userDisplay["staff?"] == true ? (
                  <View
                    style={{
                      width: 50,
                      height: 60,
                      marginLeft: "auto",
                      marginRight: "2%",
                    }}
                  >
                    <Svg
                      style={{ position: "absolute", zIndex: -1 }}
                      fill={
                        userDisplay["staff?"] != true
                          ? userCoa != null &&
                            userCoa[Math.floor(selectedCursus) ? 0 : 1] ==
                              undefined
                            ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1]
                                .color
                            : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                          : "white"
                      }
                      width={50}
                      height={75}
                    >
                      <Polygon points="0,0 50,0 50,50 25,75 0,50"></Polygon>
                    </Svg>
                    <SvgUri
                      style={{
                        position: "absolute",
                        zIndex: 999,
                        maxHeight: 60,
                        maxWidth: 50,
                        right: 0,
                      }}
                      uri={
                        userDisplay["staff?"] != true
                          ? userCoa != null &&
                            userCoa[Math.floor(selectedCursus) ? 0 : 1]
                              .image_url == undefined
                            ? ""
                            : userCoa[Math.floor(selectedCursus) ? 0 : 1]
                                .image_url
                          : ""
                      }
                      fill={"black"}
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

                  {userDisplay["staff?"] != true ? (
                    <Picker
                      style={{
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
                    </Picker>
                  ) : (
                    <Text style={{ color: "white" }}>Staff Cursus</Text>
                  )}
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
            >
              {userDisplay["staff?"] != true
                ? `Level ${Math.round(
                    userDisplay.cursus_users[Math.floor(selectedCursus)].level -
                      0.5
                  )} (${Math.floor(
                    (userDisplay.cursus_users[Math.floor(selectedCursus)]
                      .level -
                      Math.round(
                        userDisplay.cursus_users[Math.floor(selectedCursus)]
                          .level - 0.5
                      )) *
                      100 -
                      0.5
                  )}%)`
                : "Level Max"}
            </Text>
            <View
              style={{
                height: "100%",
                width:
                  userDisplay["staff?"] != true
                    ? `${Math.floor(
                        (userDisplay.cursus_users[Math.floor(selectedCursus)]
                          .level -
                          Math.round(
                            userDisplay.cursus_users[Math.floor(selectedCursus)]
                              .level - 0.5
                          )) *
                          100 -
                          0.5
                      )}%`
                    : "100%",
                backgroundColor:
                  userDisplay["staff?"] != true
                    ? userCoa != null &&
                      userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                      ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                      : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                    : "white",
                position: "absolute",
                zIndex: -1,
              }}
            ></View>
          </View>
        </View>
        <ScrollView
          style={{ maxHeight: orientation == "PORTRAIT" ? "60%" : "100%" }}
          scrollEnabled={scrollGlobal}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "95%",
              height: 60,
              backgroundColor:
                userDisplay["staff?"] != true
                  ? userCoa != null &&
                    userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                    ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                    : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                  : "white",
              marginHorizontal: "2.5%",
              marginTop: "5%",
              borderRadius: 15,
              borderBottomLeftRadius: openProject ? 0 : 15,
              borderBottomRightRadius: openProject ? 0 : 15,
            }}
          >
            <Text
              style={{
                marginLeft: "2%",
                fontSize: 25,
                fontWeight: "800",
              }}
            >
              Project :
            </Text>
            {openProject ? (
              <Icon
                style={{
                  marginRight: "2%",
                }}
                onPress={() => {
                  setopenProject(!openProject);
                }}
                name="arrow-up"
                size={30}
              />
            ) : (
              <Icon
                style={{
                  marginRight: "2%",
                }}
                onPress={() => {
                  setopenProject(!openProject);
                }}
                name="arrow-down"
                size={30}
              />
            )}
          </View>
          <View
            style={{
              width: "95%",
              height: openProject ? 200 : 0,
              backgroundColor:
                userDisplay["staff?"] != true
                  ? userCoa != null &&
                    userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                    ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                    : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                  : "white",
              marginHorizontal: "2.5%",
              flex: 1,
            }}
          >
            <ScrollView
              onTouchStart={() => {
                setScrollGlobal(false);
              }}
              onTouchEnd={() => {
                setScrollGlobal(true);
              }}
              onScrollEndDrag={() => {
                setScrollGlobal(true);
              }}
            >
              {displayProject(
                userProject != null
                  ? userProject.filter(
                      (item) =>
                        item.cursus_ids[0] ==
                          userDisplay.cursus_users[Math.floor(selectedCursus)]
                            .cursus_id && item.status == "finished"
                    )
                  : null
              )}
            </ScrollView>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "95%",
              height: 60,
              backgroundColor:
                userDisplay["staff?"] != true
                  ? userCoa != null &&
                    userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                    ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                    : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                  : "white",
              marginHorizontal: "2.5%",
              marginTop: "5%",
              borderRadius: 15,
              borderBottomLeftRadius: openProjectInProgress ? 0 : 15,
              borderBottomRightRadius: openProjectInProgress ? 0 : 15,
            }}
          >
            <Text
              style={{
                marginLeft: "2%",
                fontSize: 25,
                fontWeight: "800",
              }}
            >
              Project In Progress :
            </Text>
            {openProjectInProgress ? (
              <Icon
                style={{
                  marginRight: "2%",
                }}
                onPress={() => {
                  setopenProjectInProgress(!openProjectInProgress);
                }}
                name="arrow-up"
                size={30}
              />
            ) : (
              <Icon
                style={{
                  marginRight: "2%",
                }}
                onPress={() => {
                  setopenProjectInProgress(!openProjectInProgress);
                }}
                name="arrow-down"
                size={30}
              />
            )}
          </View>
          <View
            style={{
              width: "95%",
              height: openProjectInProgress ? 200 : 0,
              backgroundColor:
                userDisplay["staff?"] != true
                  ? userCoa != null &&
                    userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                    ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                    : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                  : "white",
              marginHorizontal: "2.5%",
            }}
          >
            <ScrollView
              onTouchStart={() => {
                setScrollGlobal(false);
              }}
              onTouchEnd={() => {
                setScrollGlobal(true);
              }}
              onScrollEndDrag={() => {
                setScrollGlobal(true);
              }}
            >
              {displayProjectInProgress(
                userProject != null
                  ? userProject.filter(
                      (item) =>
                        item.cursus_ids[0] ==
                          userDisplay.cursus_users[Math.floor(selectedCursus)]
                            .cursus_id && item.status == "in_progress"
                    )
                  : null
              )}
            </ScrollView>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "95%",
              height: 60,
              backgroundColor:
                userDisplay["staff?"] != true
                  ? userCoa != null &&
                    userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                    ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                    : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                  : "white",
              marginHorizontal: "2.5%",
              marginTop: "5%",
              borderRadius: 15,
              borderBottomLeftRadius: openSkills ? 0 : 15,
              borderBottomRightRadius: openSkills ? 0 : 15,
            }}
          >
            <Text
              style={{
                marginLeft: "2%",
                fontSize: 25,
                fontWeight: "800",
              }}
            >
              Skills :
            </Text>
            {openSkills ? (
              <Icon
                style={{
                  marginRight: "2%",
                }}
                onPress={() => {
                  setopenSkills(!openSkills);
                }}
                name="arrow-up"
                size={30}
              />
            ) : (
              <Icon
                style={{
                  marginRight: "2%",
                }}
                onPress={() => {
                  setopenSkills(!openSkills);
                }}
                name="arrow-down"
                size={30}
              />
            )}
          </View>
          <View
            style={{
              width: "95%",
              height: openSkills ? 400 : 0,
              backgroundColor:
                userDisplay["staff?"] != true
                  ? userCoa != null &&
                    userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                    ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                    : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                  : "white",
              marginHorizontal: "2.5%",
            }}
          >
            <ScrollView
              onTouchStart={() => {
                setScrollGlobal(false);
              }}
              onTouchEnd={() => {
                setScrollGlobal(true);
              }}
              onScrollEndDrag={() => {
                setScrollGlobal(true);
              }}
            >
              {userDisplay != null &&
                userDisplay.cursus_users[Math.floor(selectedCursus)].skills.map(
                  (item) => {
                    return (
                      <View
                        key={item.name}
                        style={{
                          width: "90%",
                          height: 80,
                          backgroundColor: "#00000066",
                          marginHorizontal: "5%",
                          marginVertical: "1%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            color: "white",
                            marginLeft: "2%",
                          }}
                        >
                          {item.name}
                        </Text>
                        <View
                          style={{
                            width: "80%",
                            height: "40%",
                            backgroundColor: "#FFFFFF44",
                            marginRight: "2%",
                            marginTop: "2%",
                            borderRadius: 10,
                            display: "flex",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          <View
                            style={{
                              position: "absolute",
                              width: `${(item.level * 100) / 20}%`,
                              height: "100%",
                              backgroundColor: "red",
                            }}
                          ></View>
                          <Text
                            style={{
                              fontSize: 20,
                              color: "white",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            {Math.floor(item.level * 100) / 100}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ProfileScreen;
