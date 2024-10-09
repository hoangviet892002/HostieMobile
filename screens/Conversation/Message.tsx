import { View, Text } from "react-native";
import React from "react";

interface Message {
  message: string;
  time: string;
  isSender: boolean;
}
const Message: React.FC<Message> = ({ isSender, message, time }) => {
  return (
    <View
      style={{ alignItems: isSender ? "flex-end" : "flex-start", margin: 10 }}
    >
      <View
        style={{
          backgroundColor: isSender ? "#DCF8C6" : "#FFF",
          padding: 10,
          borderRadius: 10,
          maxWidth: "80%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 1,
          elevation: 2,
        }}
      >
        <Text style={{ color: isSender ? "#000" : "#000" }}>{message}</Text>
        <Text style={{ color: "#888", fontSize: 10, textAlign: "right" }}>
          {time}
        </Text>
      </View>
    </View>
  );
};

export default Message;
