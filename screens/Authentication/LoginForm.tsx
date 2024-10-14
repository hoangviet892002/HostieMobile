import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { SignInRequest } from "@/types";
import { signInApi } from "@/apis/users";
import Toast from "react-native-toast-message";
import { statusCode } from "@/constants/StatusCode";
import { useDispatch } from "react-redux";
import { authActions } from "@/redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loginForm, setLoginForm] = useState<SignInRequest>({
    username: "host",
    password: "host",
  });
  // set userEffect  redux state

  const handleChange = (key: string, value: string) => {
    setLoginForm({ ...loginForm, [key]: value });
  };
  const onSubmit = async () => {
    const response = await signInApi(loginForm);
    if (response.result) {
      // set async storage
      await AsyncStorage.setItem("session", JSON.stringify(response.result));
      dispatch(authActions.login());
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.message,
        position: "top",
      });
    }
  };

  return (
    <View>
      <Animatable.View delay={120} animation="slideInDown" className="w-full">
        <View className="py-3">
          <TextInput
            className="bg-white p-2 rounded-3xl border-2 border-black py-2 my-2"
            value={loginForm.username}
            placeholder="User name"
            onChangeText={(text) => handleChange("username", text)}
          />

          <TextInput
            secureTextEntry={true}
            className="bg-white p-2 rounded-3xl border-2 border-black py-2 my-2"
            value={loginForm.password}
            placeholder={t("Password")}
            onChangeText={(text) => handleChange("password", text)}
          />
        </View>
      </Animatable.View>
      <Animatable.View delay={120} animation="slideInDown">
        <TouchableOpacity
          className="bg-black p-2 rounded-3xl items-center justify-center"
          style={{ width: wp(80) }}
          onPress={() => {
            onSubmit();
          }}
        >
          <Text className="text-white text-2xl font-bold"> {t("Login")} </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default LoginForm;
