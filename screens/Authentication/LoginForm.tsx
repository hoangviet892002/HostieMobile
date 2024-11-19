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
import Icon, { Icons } from "@/components/Icons";
import { Loading } from "@/components";

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<SignInRequest>({
    username: "host",
    password: "host",
  });

  const handleChange = (key: string, value: string) => {
    setLoginForm({ ...loginForm, [key]: value });
  };
  const onSubmit = async () => {
    setLoading(true);
    AsyncStorage.removeItem("session");
    const response = await signInApi(loginForm);
    if (response.result) {
      await AsyncStorage.setItem("session", JSON.stringify(response.result));

      const decodedToken = decodeJWT(response.result.token);
      console.log(response.result.token);

      // ROLE_SELLER
      // ROLE_HOST
      //ROLE_HOUSEKEEPER
      console.log(decodedToken);

      dispatch(authActions.login(decodedToken));
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.message,
        position: "top",
      });
    }
    setLoading(false);
  };

  return (
    <View>
      {/* <Loading loading={loading} /> */}
      <Animatable.View delay={120} animation="slideInDown" className="w-full">
        <View className="py-3">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderColor: Colors.primary,
              borderWidth: 2,
              borderRadius: 25,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginVertical: 5,
              width: wp(80),
            }}
          >
            <Icon
              type={Icons.AntDesign}
              name="user"
              size={20}
              color={Colors.primary}
            />

            <TextInput
              style={{
                flex: 1,
                marginLeft: 10,
                color: Colors.black,
                paddingVertical: 8,
              }}
              placeholder="Username"
              placeholderTextColor={Colors.primary}
              value={loginForm.username}
              onChangeText={(text) => handleChange("username", text)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderColor: Colors.primary,
              borderWidth: 2,
              borderRadius: 25,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginVertical: 5,
              width: wp(80),
            }}
          >
            <Icon
              type={Icons.AntDesign}
              name="lock"
              size={20}
              color={Colors.primary}
            />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 10,
                color: Colors.black,
                paddingVertical: 8,
              }}
              placeholder="Password"
              placeholderTextColor={Colors.primary}
              value={loginForm.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
                {passwordVisible ? (
                  <>
                    <Icon
                      type={Icons.Feather}
                      name="eye-off"
                      size={20}
                      color={Colors.primary}
                    />
                  </>
                ) : (
                  <>
                    <Icon
                      type={Icons.Feather}
                      name="eye"
                      size={20}
                      color={Colors.primary}
                    />
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
      <Animatable.View delay={120} animation="slideInDown">
        <TouchableOpacity
          className="flex justify-center items-center py-3 rounded-3xl"
          style={{ width: wp(80), backgroundColor: Colors.primary }}
          onPress={() => {
            onSubmit();
          }}
        >
          <Text className="text-white text-2xl font-bold">
            {" "}
            {!loading ? t("Login") : t("Loading")}{" "}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default LoginForm;
