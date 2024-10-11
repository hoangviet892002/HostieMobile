import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { BackButton } from "@/components";

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
      </Animatable.View>
    </SafeAreaView>
  );
};

export default Container;
