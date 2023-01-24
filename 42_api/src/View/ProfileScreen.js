import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import axios, { all } from "axios";
import Svg, { Polygon, SvgUri } from "react-native-svg";
import { UID, SECRET } from "@env";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import ProjectElement from "../Component/ProjectElement";

function isPortrait() {
  const dim = Dimensions.get("screen");
  return dim.height >= dim.width;
}

const displayProject = (project) => {
  if (project == null) return <></>;

  const tmp = project;

  return (
    <>
      {tmp.map((item) => {
        return (
          <ProjectElement
            projectName={item.project.name}
            projectMark={item.final_mark}
            validated={item["validated?"]}
            key={item.project.name}
          />
        );
      })}
    </>
  );
};

const displayProjectInProgress = (project) => {
  if (project == null) return <></>;

  const tmp = project;

  if (!tmp.length)
    return (
      <View
        style={{
          width: 300,
          height: 175,
          backgroundColor: "#00000044",
          marginLeft: "auto",
          marginRight: "auto",
          borderWidth: 5,
          borderColor: "black",
          borderRadius: 15,
          borderStyle: "dashed",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="window-close-o" size={80}></Icon>
        <Text style={{ fontSize: 20, fontWeight: "900", marginTop: "5%" }}>
          No project in progress...
        </Text>
      </View>
    );

  return (
    <>
      {tmp.map((item) => {
        return (
          <ProjectElement
            projectName={item.project.name}
            projectMark={item.final_mark}
            validated={item["validated?"]}
            status={"in_progress"}
            key={item.project.name}
          />
        );
      })}
    </>
  );
};

const ProfileScreen = ({ navigation, route }) => {
  const [orientation, setOrientation] = useState(
    isPortrait() ? "PORTRAIT" : "LANDSCAPE"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openProject, setopenProject] = useState(false);
  const [openProjectInProgress, setopenProjectInProgress] = useState(false);
  const [openSkills, setopenSkills] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userDisplay, setUserDisplay] = useState(null);
  const [userProject, setUserProject] = useState(null);
  const [selectedCursus, setSelectedCursus] = useState("");

  const [userCoa, setUserCoa] = useState(null);

  const styles_portrait = StyleSheet.create({
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
      borderRadius: "10",
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
      borderRadius: "10",
      marginTop: "5%",
      marginHorizontal: "5%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
  });

  useEffect(() => {
    if (accessToken == "") {
      const timeoutId = setTimeout(() => {
        axios
          .post(
            "https://api.intra.42.fr/oauth/token",
            `grant_type=client_credentials&client_id=${UID}&client_secret=${SECRET}`
          )
          .then((response) => {
            setAccessToken(response.data.access_token);
            clearTimeout(timeoutId);
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            setError(true);
          });
      }, 1000);
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
          if (Object.keys(response.data) == ["data"]) {
            setUserDisplay(response.data.data);
            setUserProject(response.data.data.projects_users);
          } else {
            setUserDisplay(response.data);
            setUserProject(response.data.projects_users);
          }
        })
        .catch((err) => {
          setError(true);
        });
    } else if (
      (userCoa == null &&
        userDisplay.cursus_users != undefined &&
        userDisplay.cursus_users[0].has_coalition) ||
      (userCoa == null &&
        userDisplay.data.cursus_users != undefined &&
        userDisplay.data.cursus_users[0].has_coalition)
    ) {
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
          setUserCoa(response.data);

          const timeout_id = setTimeout(() => {
            setLoading(false);
            clearInterval(timeout_id);
          }, 1000);
        })
        .catch((err) => {
          setError(true);
        });
    }
  }, [accessToken, userDisplay]);

  useEffect(() => {
    if (userDisplay != null) {
      setSelectedCursus((userDisplay.cursus_users.length - 1).toString());
    }
  }, [loading]);

  useEffect(() => {
    if (userDisplay != null) {
    }
  }, [selectedCursus]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setOrientation(isPortrait() ? "PORTRAIT" : "LANDSCAPE");
      }
    );
    return () => subscription?.remove();
  });

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
          size={"100%"}
          color="white"
        ></Icon>
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
        >{`Searching for ${route.params.login} profile`}</Text>
      </View>
    );

  return (
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
        {userCoa != null ? (
          <Image
            source={{
              uri:
                userCoa != null &&
                userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                  ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].cover_url
                  : userCoa[Math.floor(selectedCursus) ? 0 : 1].cover_url,
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
              <Text style={{ fontSize: "20" }}>{`Login: `}</Text>
              <Text
                style={{ fontSize: "20", fontWeight: "900", color: "black" }}
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
                    fill={
                      userCoa != null &&
                      userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                        ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                        : userCoa[Math.floor(selectedCursus) ? 0 : 1].color
                    }
                    width={50}
                    height={75}
                  >
                    <Polygon points="0,0 50,0 50,50 25,75 0,50"></Polygon>
                  </Svg>
                  <SvgUri
                    style={{ position: "absolute" }}
                    uri={
                      userCoa != null &&
                      userCoa[Math.floor(selectedCursus) ? 0 : 1].image_url ==
                        undefined
                        ? ""
                        : userCoa[Math.floor(selectedCursus) ? 0 : 1].image_url
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
              backgroundColor:
                userCoa != null &&
                userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                  ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                  : userCoa[Math.floor(selectedCursus) ? 0 : 1].color,
              position: "absolute",
              zIndex: -1,
            }}
          ></View>
        </View>
      </View>
      <ScrollView
        style={{ maxHeight: orientation == "PORTRAIT" ? "60%" : "100%" }}
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
              userCoa != null &&
              userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                : userCoa[Math.floor(selectedCursus) ? 0 : 1].color,
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
            // height: 400,
            height: openProject ? 200 : 0,
            backgroundColor:
              userCoa != null &&
              userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                : userCoa[Math.floor(selectedCursus) ? 0 : 1].color,
            marginHorizontal: "2.5%",
          }}
        >
          <ScrollView style={{}}>
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
              userCoa != null &&
              userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                : userCoa[Math.floor(selectedCursus) ? 0 : 1].color,
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
            // height: 400,
            height: openProjectInProgress ? 200 : 0,
            backgroundColor:
              userCoa != null &&
              userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                : userCoa[Math.floor(selectedCursus) ? 0 : 1].color,
            marginHorizontal: "2.5%",
          }}
        >
          <ScrollView style={{}}>
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
              userCoa != null &&
              userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                : userCoa[Math.floor(selectedCursus) ? 0 : 1].color,
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
            // height: 400,
            height: openSkills ? 400 : 0,
            backgroundColor:
              userCoa != null &&
              userCoa[Math.floor(selectedCursus) ? 0 : 1] == undefined
                ? userCoa.data[Math.floor(selectedCursus) ? 0 : 1].color
                : userCoa[Math.floor(selectedCursus) ? 0 : 1].color,
            marginHorizontal: "2.5%",
          }}
        >
          <ScrollView>
            {userDisplay != null &&
              userDisplay.cursus_users[Math.floor(selectedCursus)].skills.map(
                (item) => {
                  return (
                    <View
                      style={{
                        width: "90%",
                        height: 80,
                        backgroundColor: "#00000066",
                        marginHorizontal: "5%",
                        marginVertical: "1%",
                        display: "flex",
                        // flexDirection: "row",
                        alignItems: "center",
                        // justifyContent: "space-between",
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
  );
};

export default ProfileScreen;
