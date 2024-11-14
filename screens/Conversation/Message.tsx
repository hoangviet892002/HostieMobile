import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { MessageType } from "@/types/MessageType";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/slices/authSlice";
import moment from "moment";
import { selectUser } from "@/redux/slices/messageSlice";

const Message: React.FC<MessageType> = (message) => {
  const userID = useSelector(selectUserId);
  const isSender = message.sender_id === userID;
  const user = useSelector(selectUser);
  const isFileMessage = message.files && message.files.length > 0;
  const receiver = user.find((u) => u.id !== message.sender_id);
  const sender = user.find((u) => u.id === message.sender_id);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View
      style={{
        flexDirection: isSender ? "row-reverse" : "row",
        alignItems: "flex-end",
        margin: 10,
      }}
    >
      {/* Avatar */}
      {!isSender && (
        <Image
          source={{ uri: sender?.avatar }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            marginRight: 10,
          }}
        />
      )}

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
        {isFileMessage && (
          <ScrollView horizontal>
            {message.files.map((file, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleImagePress(
                    "https://hostie-image.s3.ap-southeast-2.amazonaws.com/chat/" +
                      file.file_name
                  );
                }}
              >
                <Image
                  source={{
                    uri:
                      "https://hostie-image.s3.ap-southeast-2.amazonaws.com/chat/" +
                      file.file_name,
                  }}
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
        )}
        <Text style={{ color: isSender ? "#000" : "#000" }}>
          {message.message}
        </Text>

        <Text style={{ color: "#888", fontSize: 10, textAlign: "right" }}>
          {moment(message.created_at).fromNow()}
        </Text>
      </View>
      {selectedImage && (
        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.8)",
            }}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 40, right: 20 }}
              onPress={handleCloseModal}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Close</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "90%", height: "70%", borderRadius: 10 }}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Message;
