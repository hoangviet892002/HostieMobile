import { View, Text } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

const ProgessBar = ({ step }: { step: number }) => {
  const stepBar = [1, 2, 3, 4, 5];
  return (
    <View className="flex flex-row items-center justify-center">
      {stepBar.map((item, index) => (
        <React.Fragment key={item}>
          {/* Điểm */}
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: step >= item ? Colors.primary : "gray",
              borderRadius: 10,
            }}
          />
          {/* Đường nối giữa các điểm, không hiển thị ở điểm cuối cùng */}
          {index < stepBar.length - 1 && (
            <View
              style={{
                width: 40, // Chiều dài của đường nối
                height: 2, // Độ dày của đường nối
                backgroundColor: step > item ? Colors.primary : "gray",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default ProgessBar;
