import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router, useNavigation } from "expo-router";

interface ConversationProps {
  name: string;
  message: string;
  image: string;
  lastime: string;
}
const Conversation: React.FC<ConversationProps> = ({
  image,
  lastime,
  message,
  name,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Conversation");
      }}
    >
      <View className="flex flex-row items-center p-2">
        <View className="flex items-center justify-center">
          <Image source={{ uri: image }} className="w-20 h-20 rounded-full" />
        </View>
        <View className="flex flex-1 ml-4">
          <Text className="text-lg font-bold">{name}</Text>
          <Text className="text-gray-500">{message}</Text>
        </View>
        <View className="flex items-center">
          <Text className="text-sm text-gray-500">{lastime}</Text>
        </View>
      </View>
      <View className="bg-gray-200 h-0.5" />
    </TouchableOpacity>
  );
};

export default Conversation;
