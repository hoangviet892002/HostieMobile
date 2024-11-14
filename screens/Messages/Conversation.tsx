import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { ConversationType } from "@/types/ConversationType";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "@/redux/slices/authSlice";
import { messageActions } from "@/redux/slices/messageSlice";

const Conversation: React.FC<ConversationType> = (
  conversation: ConversationType
) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userID = useSelector(selectUserId);
  const partner = conversation.users.find((user) => user.id !== userID);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        dispatch(messageActions.loadUser(conversation.users));
        navigation.navigate("Conversation", {
          partner: partner,
          id: conversation.id,
        });
      }}
    >
      <Image
        source={{
          uri: partner?.avatar,
        }}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.username}>{partner?.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    marginLeft: 15,
    justifyContent: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Conversation;
