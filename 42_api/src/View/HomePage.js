import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Button } from "react-native-paper";
import { ShakeDiv } from "../Component/ShakeDiv";

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

export default HomePage;