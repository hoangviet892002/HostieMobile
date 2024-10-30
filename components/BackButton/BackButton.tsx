import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Icon, { Icons } from "../Icons";
import { router } from "expo-router";

interface BackButtonProps {
  navigateTo?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ navigateTo }) => {
  return (
    <TouchableOpacity
      className="bg-white h-[60px] w-[60px] m-5 flex justify-center items-center"
      style={{
        borderBlockColor: Colors.primary,
        borderRadius: 16,
        borderWidth: 1,
      }}
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace(navigateTo);
        }
      }}
    >
      <Icon
        type={Icons.Feather}
        name={"arrow-left"}
        color={Colors.primary}
        size={30}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
