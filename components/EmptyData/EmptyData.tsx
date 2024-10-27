import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmptyData = () => {
  return (
    <View className="flex-1 justify-center items-center mt-10">
      {/* Biểu tượng trống */}
      <Ionicons name="document-outline" size={64} color="#A0AEC0" />
      {/* Thông báo */}
      <Text className="text-gray-500 text-lg mt-4">No data</Text>
    </View>
  );
};

export default EmptyData;
