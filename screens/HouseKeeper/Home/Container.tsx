import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoList from "./TodoList";

const Container = () => {
  return (
    <SafeAreaView className="h-full p-5 pb-24">
      <TodoList />
    </SafeAreaView>
  );
};

export default Container;
