import { Image, ScrollView, Text, View } from "react-native";

import { BackButton } from "@/components";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import Messages from "./Messages";
import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Conversation = () => {
  const receiver = {
    name: "John Doe",
    image: "https://picsum.photos/200/300",
    lastime: "2m ago",
  };
  const RenderInput = () => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
      if (message.trim()) {
        setMessage("");
      }
    };

    return (
      <View className="flex flex-row items-center p-2 border-t border-gray-200">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          className="flex-1 p-2 bg-gray-100 rounded-full"
        />
        <TouchableOpacity onPress={handleSend} className="ml-2">
          <Ionicons name="send" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <Animatable.View
        className="flex flex-row items-center"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex items-center justify-center flex-row">
          <Image
            source={{ uri: receiver.image }}
            className="h-[60px] w-[60px] mx- rounded-full"
            style={{ borderWidth: 2, borderColor: Colors.primary }}
          />
          <Text className="text-3xl font-bold ">{receiver.name}</Text>
        </View>
      </Animatable.View>
      <View className="h-[700px]">
        <ScrollView>
          <Messages />
        </ScrollView>
      </View>
      {RenderInput()}
    </SafeAreaView>
  );
};

export default Conversation;
