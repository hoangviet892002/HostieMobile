import React from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import GoogleLoge from "@/assets/images/ThirdService/Google.png";
import { useTranslation } from "react-i18next";

const LoginWithGoogle = () => {
  const { t } = useTranslation();
  return (
    <Animatable.View
      delay={120}
      animation="slideInDown"
      className="w-full my-10"
    >
      <View className="flex items-center my-4 flex-row">
        <View className="flex-grow border-t border-blue-500 " />
        <Text className="mx-2 ">{t("Or Login with")}</Text>
        <View className="flex-grow border-t border-blue-500" />
      </View>

      <TouchableOpacity
        className=" flex flex-row bg-white p-4 rounded-3xl items-center justify-center border border-black"
        style={{ width: "100%" }}
      >
        <Image source={GoogleLoge} style={{ width: 30, height: 30 }} />
        <Text className="text-black text-xl font-bold mx-2">
          {t("Login with Google")}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default LoginWithGoogle;
