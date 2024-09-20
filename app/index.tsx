import banner from "@/assets/images/banner.jpg";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

const index = () => {
  return (
    <View className="flex-1">
      <ImageBackground source={banner} resizeMode="cover" className="flex-1">
        <SafeAreaView className="flex-1 p-3 justify-between ">
          <Animatable.View
            className="flex-1 pt-10 m-3"
            delay={120}
            animation="slideInDown"
          >
            <Text className="text-black text-5xl font-bold p-2">Doorways</Text>

            <Text className="bg-green-600 text-white font-bold text-5xl p-2 shadow-lg rounded-3xl">
              to Dream
            </Text>
            <Text className="text-black text-5xl font-bold p-2">Stays</Text>
          </Animatable.View>

          <Animatable.View
            className="flex flex-row justify-center items-center"
            delay={120}
            animation="slideInDown"
          >
            <Text className="text-white text-2xl font-bold p-2 w-2/3 ">
              Streamlines where reservation with a wide range hassle
            </Text>
            <TouchableOpacity
              className="bg-green-600 p-2 m-2 rounded-full h-20 w-20 flex justify-center items-center"
              onPress={() => {
                router.navigate("Authentication");
              }}
            >
              <Text className="text-white text-2xl font-bold">Start</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </ImageBackground>
      <StatusBar style="light" />
    </View>
  );
};

export default index;
