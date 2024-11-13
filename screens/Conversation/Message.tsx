import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { MessageType } from "@/types/MessageType";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/slices/authSlice";
import moment from "moment";

const Message: React.FC<MessageType> = (message) => {
  const userID = useSelector(selectUserId);
  const isSender = message.sender_id === userID;
  const isFileMessage = message.files && message.files.length > 0;

  return (
    <View
      style={{
        flexDirection: isSender ? "row-reverse" : "row",
        alignItems: "flex-end",
        margin: 10,
      }}
    >
      {/* Avatar */}
      <Image
        source={{ uri: message.sender_avatar }}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          marginHorizontal: 5,
        }}
      />

      {/* Message Bubble */}
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
        {isFileMessage ? (
          <ScrollView horizontal>
            {message.files.map((file, index) => (
              <TouchableOpacity key={index} onPress={() => {}}>
                <Image
                  source={{ uri: file.file_name }}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 10,
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={{ color: isSender ? "#000" : "#000" }}>
            {message.message}
          </Text>
        )}

        <Text style={{ color: "#888", fontSize: 10, textAlign: "right" }}>
          {moment(message.created_at).fromNow()}
        </Text>
      </View>
    </View>
  );
};

export default Message;
