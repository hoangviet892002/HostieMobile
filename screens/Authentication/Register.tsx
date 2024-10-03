import React from "react";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { CheckBox } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
const Register = () => {
  const { t } = useTranslation();
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [checked, setChecked] = useState(false);
  const handleChange = (key: string, value: string) => {
    setRegisterForm({ ...registerForm, [key]: value });
  };
  const toggleCheckbox = () => {
    setChecked(!checked);
  };
  return (
    <View>
      <Animatable.View delay={120} animation="slideInDown" className="w-full">
        <View className="py-3">
          <TextInput
            className="bg-white p-2 rounded-3xl border-2 border-black py-2 my-2"
            value={registerForm.fullName}
            placeholder={t("Full Name")}
            onChangeText={(text) => handleChange("fullName", text)}
          />

          <TextInput
            className="bg-white p-2 rounded-3xl border-2 border-black py-2 my-2"
            value={registerForm.email}
            placeholder={t("Email")}
            onChangeText={(text) => handleChange("email", text)}
          />

          <TextInput
            secureTextEntry={true}
            className="bg-white p-2 rounded-3xl border-2 border-black py-2 my-2"
            value={registerForm.password}
            placeholder={t("Password")}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TextInput
            secureTextEntry={true}
            className="bg-white p-2 rounded-3xl border-2 border-black py-2 my-2"
            value={registerForm.confirmPassword}
            placeholder={t("Confirm Password")}
            onChangeText={(text) => handleChange("confirmPassword", text)}
          />
        </View>
        <View className="py-4">
          <CheckBox
            title={t("I agree to Terms and Privacy Policy")}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={checked}
            onPress={toggleCheckbox}
            containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
          />
        </View>
      </Animatable.View>
      <Animatable.View delay={120} animation="slideInDown">
        <TouchableOpacity
          className="bg-black p-2 rounded-3xl items-center justify-center"
          style={{ width: wp(80) }}
          onPress={() => {
            router.navigate("(tabs)");
          }}
        >
          <Text className="text-white text-2xl font-bold">{t("Register")}</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default Register;
