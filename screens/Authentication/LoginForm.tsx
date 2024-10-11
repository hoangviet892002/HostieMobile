import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (key: string, value: string) => {
    setLoginForm({ ...loginForm, [key]: value });
  };
  return (
    <View>
      <Animatable.View delay={120} animation="slideInDown" className="w-full">
        <View className="py-3">
          <TextInput
            className="bg-white p-2 rounded-3xl border-2 border-black py-2 my-2"
            value={loginForm.email}
            placeholder="Email"
            onChangeText={(text) => handleChange("email", text)}
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
            router.navigate("/housekeeper");
          }}
        >
          <Text className="text-white text-2xl font-bold"> {t("Login")} </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default LoginForm;
