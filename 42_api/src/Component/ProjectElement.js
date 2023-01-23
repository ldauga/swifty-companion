import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
// import { Icon } from "react-native-vector-icons/Icon";
import Icon from "react-native-vector-icons/FontAwesome";
const ProjectElement = (props) => {
  return (
    <View
      style={{
        width: "90%",
        height: 40,
        backgroundColor: "#00000066",
        marginHorizontal: "5%",
        marginVertical: "2%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", marginLeft: "5%" }}>
        {props.projectName}
      </Text>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '2%', width: '16%', justifyContent: 'space-between'}}>
        <Text style={{ color: props.validated ? 'green' : 'red'}}>
          {props.projectMark}
        </Text>
        {props.validated ? 
        <Icon name='check-circle' color={'green'} size={30} ></Icon> : props.status == undefined ?
        <Icon name='times-circle' color={'red'} size={30} ></Icon> : <Icon name='clock-o' color={'white'} size={30} ></Icon>
    }
      </View>
    </View>
  );
};

export default ProjectElement;
