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
import { Colors } from "@/constants/Colors";
import { decodeJWT } from "@/utils/decodeJWT";

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loginForm, setLoginForm] = useState<SignInRequest>({
    username: "host",
    password: "host",
  });

  const handleChange = (key: string, value: string) => {
    setLoginForm({ ...loginForm, [key]: value });
  };
  const onSubmit = async () => {
    const response = await signInApi(loginForm);
    if (response.result) {
      await AsyncStorage.setItem("session", JSON.stringify(response.result));

      const decodedToken = decodeJWT(response.result.token);

      // ROLE_SELLER
      // ROLE_HOST
      console.log(decodedToken);

      dispatch(authActions.login(decodedToken));
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.message,
        position: "top",
      });
      router.push("/housekeeper");
    }
  };

  return (
    <View>
      <Animatable.View delay={120} animation="slideInDown" className="w-full">
        <View className="py-3">
          <View>
            <Text className="text-lg font-bold"> {t("User name")} </Text>
            <TextInput
              className="bg-white p-2 rounded-lg border-2 py-2 my-2"
              style={{ width: wp(80), borderColor: Colors.primary }}
              value={loginForm.username}
              placeholder="User name"
              onChangeText={(text) => handleChange("username", text)}
            />
          </View>

          <View>
            <Text className="text-lg font-bold"> {t("Password")} </Text>
            <TextInput
              secureTextEntry={true}
              className="bg-white p-2 rounded-lg border-2  py-2 my-2"
              style={{
                width: wp(80),
                borderColor: Colors.primary,
              }}
              value={loginForm.password}
              placeholder={t("Password")}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>
        </View>
      </Animatable.View>
      <Animatable.View delay={120} animation="slideInDown">
        <TouchableOpacity
          className="bg-black p-2 rounded-lg items-center justify-center"
          style={{ width: wp(80), backgroundColor: Colors.primary }}
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
