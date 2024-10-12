import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { BackButton } from "@/components";
import Information from "./Information";
import { Colors } from "@/constants/Colors";
import Icon, { Icons } from "@/components/Icons";
import { useNavigation } from "expo-router";

type status = "pending" | "completed" | "canceled";
interface Todo {
  id: number;
  villaName: string;
  status: status;
  date: string;
  thumbnail: string;
  address: string;
  price: number;
}
const Container = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="h-full p-5 pb-24">
      <Animatable.View
        className="flex flex-row items-center"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex items-center justify-center flex-row">
          <Text className="text-3xl font-bold">Detail Booking</Text>
        </View>

        <TouchableOpacity
          className="bg-white h-[60px] w-[60px] m-5 flex justify-center items-center"
          style={{
            borderBlockColor: Colors.primary,
            borderRadius: 16,
            borderWidth: 1,
          }}
          onPress={() => {
            // contact with host
            navigation.navigate("Conversation");
          }}
        >
          {/* contact with host */}
          <Icon
            type={Icons.Feather}
            name={"phone-call"}
            color={Colors.primary}
            size={30}
          />
        </TouchableOpacity>
      </Animatable.View>
      <Information />
    </SafeAreaView>
  );
};

export default Container;
