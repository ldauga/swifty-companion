import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { ShakeDiv } from "../Component/ShakeDiv";

function isPortrait() {
  const dim = Dimensions.get("screen");
  return dim.height >= dim.width;
}

// export class SplashScreen extends Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         shake: new Animated.Value(0),
//       };
//     }
  
//     startShake = () => {
//       this.state.shake.setValue(0);
//       Animated.timing(this.state.shake, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();
//     };
  
//     render() {
  
//       const shake = this.state.shake.interpolate({
//         inputRange: [0, 0.25, 0.5, 0.75, 1],
//         outputRange: [0, -5, 0, 5, 0],
//       });
  
//       return (
//         <Animated.View
//           style={[
//             { transform: [{ translateX: shake }]},
//           ]}
//         >
//           {this.props.children}
//         </Animated.View>
//       );
//     }
//   }

const HomePage = ({ navigation }) => {
  const [orientation, setOrientation] = useState(
    isPortrait() ? "PORTRAIT" : "LANDSCAPE"
  );

  const styles_portrait = StyleSheet.create({
    main_container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    info_container: {
      width: "100%",
      height: "70%",
      alignItems: "center",
    },
    img_container: {
      marginVertical: "10%",
      width: "80%",
      height: "30%",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    text_container: {
      width: "80%",
      display: "flex",
      alignItems: "center",
    },
    text: {
      fontSize: "30",
      textAlign: "center",
      color: "white",
    },
    text_input: {
      marginTop: "10%",
      paddingHorizontal: "5%",
      backgroundColor: "black",
      borderRadius: "10",
      fontSize: "25",
      padding: "2%",
      color: "white",
    },
  });

  const styles_landscape = StyleSheet.create({
    main_container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    info_container: {
      width: "40%",
      height: "80%",
      alignItems: "center",
    },
    img_container: {
      marginVertical: "10%",
      width: "30%",
      height: "60%",
      marginHorizontal: "10%",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    text_container: {
      width: "100%",
      display: "flex",
      alignItems: "center",
    },
    text: {
      fontSize: "30",
      textAlign: "center",
      color: "white",
    },
    text_input: {
      marginTop: "10%",
      paddingHorizontal: "5%",
      backgroundColor: "black",
      borderRadius: "10",
      fontSize: "25",
      padding: "2%",
      color: "white",
    },
  });

  const [textInputValue, setTextInputValue] = useState("ldauga");

  const shakeRef = useRef(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setOrientation(isPortrait() ? "PORTRAIT" : "LANDSCAPE");
      }
    );
    return () => subscription?.remove();
  });

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={
        orientation == "PORTRAIT"
          ? styles_portrait.container
          : styles_landscape.container
      }
    >
      <View
        style={
          orientation == "PORTRAIT"
            ? styles_portrait.main_container
            : styles_landscape.main_container
        }
        onTouchStart={() => {
          Keyboard.dismiss();
        }}
      >
        <View
          style={
            orientation == "PORTRAIT"
              ? styles_portrait.img_container
              : styles_landscape.img_container
          }
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png",
            }}
            style={
              orientation == "PORTRAIT"
                ? styles_portrait.image
                : styles_landscape.image
            }
          />
        </View>
        <View
          style={
            orientation == "PORTRAIT"
              ? styles_portrait.info_container
              : styles_landscape.info_container
          }
        >
          <View
            style={
              orientation == "PORTRAIT"
                ? styles_portrait.text_container
                : styles_landscape.text_container
            }
          >
            <Text
              style={
                orientation == "PORTRAIT"
                  ? styles_portrait.text
                  : styles_landscape.text
              }
            >
              Search 42 student's login to display his info !
            </Text>
          </View>
          <ShakeDiv ref={shakeRef}>
            <TextInput
              style={
                orientation == "PORTRAIT"
                  ? styles_portrait.text_input
                  : styles_landscape.text_input
              }
              placeholder="login"
              value={textInputValue}
              onChangeText={(value) => setTextInputValue(value)}
              onSubmitEditing={() => {
                if (textInputValue != "") {
                  navigation.navigate("Info Stud", { login: textInputValue });
                } else {
                  shakeRef.current.startShake();
                }
              }}
            />
          </ShakeDiv>
          <Button
            icon="magnify"
            mode="contained"
            style={{ marginTop: "20%" }}
            onPress={() => {
              if (textInputValue != "") {
                navigation.navigate("Info Stud", { login: textInputValue });
              } else {
                shakeRef.current.startShake();
              }
            }}
          >
            Search
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default HomePage;
