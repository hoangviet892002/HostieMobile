import { Text, View } from "react-native";
import React, { Component } from "react";
import Home from "@/screens/Home";

const tabComponents = () => {
  return (
    <View className="h-full bg-purple-400 flex justify-center items-center">
      <Home />
    </View>
  );
};
export default tabComponents;
