import { View, Text, ScrollView, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { BackButton } from "@/components";
import { Colors } from "@/constants/Colors";
import Icon, { Icons } from "@/components/Icons";
import Conversations from "./Conversations";

const Messages = () => {
  //Render search bar

  const RenderSearch = () => {
    return (
      <View className="flex flex-row items-center bg-gray-200 rounded-full p-2 m-4">
        <Icon
          name="search"
          type={Icons.Feather}
          size={20}
          color={Colors.primary}
        />
        <TextInput
          placeholder="Search messages"
          className="ml-2 flex-1"
          placeholderTextColor={Colors.gray}
        />
      </View>
    );
  };
  return (
    <SafeAreaView className="h-full pb-24">
      <Animatable.View
        className="flex flex-row items-center justify-center h-[50px]"
        delay={120}
        animation="slideInDown"
      >
        <View className="flex ">
          <Text className="text-3xl font-bold ">Messages</Text>
        </View>
      </Animatable.View>

      <RenderSearch />
      <Conversations />
    </SafeAreaView>
  );
};

export default Messages;
