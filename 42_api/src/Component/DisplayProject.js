import React from "react";
import { Text, View, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ProjectElement from "../Component/ProjectElement";

export const displayProject = (project) => {
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
        No project finised...
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
            key={item.project.name}
          />
        );
      })}
    </>
  );
};

export const displayProjectInProgress = (project) => {
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
