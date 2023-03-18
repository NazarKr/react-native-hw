import styled from "styled-components/native";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import {
  loginValidation,
  emailValidation,
  passwordValidation,
} from "../../shared/validation";

SplashScreen.preventAutoHideAsync();

const initialState = {
  login: "",
  email: "",
  password: "",
};

const RegistrationScreens = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [isFocus, setIsFocus] = useState({
    login: false,
    email: false,
    password: false,
  });
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
  });
  const [isSecureEntry, setIsSecureEntry] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  function keyboardHide() {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  }

  function submitForm() {
    if (
      loginValidation(state) &&
      passwordValidation(state) &&
      emailValidation(state)
    ) {
      console.log(state);
      setState(initialState);
    } else return;
  }


  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <ViewConteiner onLayout={onLayoutRootView}>
        <ImageBackgroundStyled
          source={require("../../assets/images/photo-bg2x.jpg")}
        >
          <ViewimageWrapper>
            <Image source={require("../../assets/images/frame.png")} />
            <ImageAddIcon
              source={require("../../assets/add.png")}
            />
          </ViewimageWrapper>

          <ViewWrapperForm>
            <View style={styles.form}>
              <View>
                <TextTitle>Registration</TextTitle>
              </View>
              <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
              >
                <View
                  style={{
                    paddingBottom:
                      isFocus.email || isFocus.password || isFocus.login
                        ? 32
                        : 0,
                  }}
                >
                  <TextInput
                    onFocus={() => {
                      setIsShowKeyboard(true);
                      setIsFocus({ ...isFocus, login: true });
                    }}
                    onBlur={() => {
                      setIsFocus({ ...isFocus, login: false });
                    }}
                    placeholderTextColor="#BDBDBD"
                    placeholder="Login"
                    value={state.login}
                    onChangeText={(value) => {
                      setState((prevState) => ({ ...prevState, login: value }));
                    }}
                    style={{
                      ...styles.input,
                      borderColor: isFocus.login ? `#FF6C00` : `#E8E8E8`,
                    }}
                  />
                  <TextInput
                    keyboardType="email-address"
                    onFocus={() => {
                      setIsShowKeyboard(true);
                      setIsFocus({ ...isFocus, email: true });
                    }}
                    onBlur={() => {
                      () => emailValidator();
                      setIsFocus({ ...isFocus, email: false });
                    }}
                    placeholder="email"
                    value={state.email}
                    onChangeText={(value) =>
                      setState((prevState) => ({ ...prevState, email: value }))
                    }
                    style={{
                      ...styles.input,
                      borderColor: isFocus.email ? `#FF6C00` : `#E8E8E8`,
                    }}
                  />
                  <View>
                    <TextInput
                      onFocus={() => {
                        setIsShowKeyboard(true);
                        setIsFocus({ ...isFocus, password: true });
                      }}
                      onBlur={() => {
                        setIsFocus({ ...isFocus, password: false });
                      }}
                      placeholder="password"
                      maxLength={10}
                      value={state.password}
                      onChangeText={(value) =>
                        setState((prevState) => ({
                          ...prevState,
                          password: value,
                        }))
                      }
                      keyboardType="numeric"
                      secureTextEntry={isSecureEntry}
                      style={{
                        ...styles.input,
                        borderColor: isFocus.password ? `#FF6C00` : `#E8E8E8`,
                      }}
                    />
                    <TouchableOpacityPassword
                      activeOpacity={0.65}
                      onPress={() => {
                        setIsSecureEntry((prevState) => !prevState);
                      }}
                    >
                      <Text>{isSecureEntry ? "Show" : "Hide"}</Text>
                    </TouchableOpacityPassword>
                  </View>
                </View>
              </KeyboardAvoidingView>
              {!isShowKeyboard && (
                <TouchableOpacityButton
                  activeOpacity={0.65}
                  onPress={submitForm}
                >
                  <TextButton>Sign in</TextButton>
                </TouchableOpacityButton>
              )}
            </View>
            {!isShowKeyboard && (
              <TouchableOpacity>
                <TextLink
                  onPress={() => navigation.navigate("Login")}
                >
                  Do you have an account? Log In
                </TextLink>
              </TouchableOpacity>
            )}
          </ViewWrapperForm>
        </ImageBackgroundStyled>
      </ViewConteiner>
    </TouchableWithoutFeedback>
  );
};
export default RegistrationScreens;

const ViewConteiner = styled.View`
  flex: 1;
`;

const ImageBackgroundStyled = styled.ImageBackground`
    position: relative;
    flex: 1;
    background-size: cover;
    justify-content: flex-end;
`;

const TextTitle = styled.Text`
    text-align: center;
    font-family: Roboto-Medium;
    font-size: 32px;
    line-height: 35px;
    /* letter-spacing: 0.01; */
    color: #212121;
    margin-bottom: 27px;
`;

const ViewimageWrapper = styled.View`
    left: 35%;
    top: 10%;
    z-index: 100;
    width: 120px;
    height: 120px;
    background-color: #F6F6F6;
    border-radius: 50px;
`;

const ImageAddIcon = styled.Image`
    position: absolute;
    left: 70%;
    top: 70%;
    width: 25px;
    height: 25px;
`;

const ViewWrapperForm = styled.View`
  padding-bottom: 45px;
  padding-top: 92px;
  background-color: #FFFFFF;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;

const TextLink = styled.Text`
  font-family: Roboto-Regular;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #1B4371;
`;

const TextButton = styled.Text`
    color: #FFFFFF;
    font-family: Roboto-Regular;
    font-size: 18px;
    font-weight: 600;
    line-height: 19px;
`;

const TouchableOpacityButton = styled.TouchableOpacity`
    background-color: #FF6C00;
    border-radius: 100px;
    height: 50px;
    margin-top: 40px;
    margin-bottom: 20px;
    justify-content: center;
    align-items: center;
`;

const TouchableOpacityPassword = styled.TouchableOpacity`
position: absolute;
    top: 50%;
    left: 80%;
    color: #1B4371;
    font-size: 14px;
    line-height: 19px;
`;

const ViewForm = styled.View`

`;
 

const styles = StyleSheet.create({
  input: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    color: "#212121",
  },
  form: {
    marginHorizontal: 16,
  },
});
