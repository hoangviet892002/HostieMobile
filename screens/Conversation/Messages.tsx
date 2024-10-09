import { View, Text } from "react-native";
import React from "react";
import Message from "./Message";

interface IMessage {
  message: string;
  time: string;
  isSender: boolean;
}
const Messages = () => {
  const Messages: IMessage[] = [
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
    {
      isSender: true,
      message: "Hello",
      time: "2m ago",
    },
    {
      isSender: false,
      message: "Hi there!",
      time: "1m ago",
    },
  ];
  return (
    <View className="flex justify-around">
      {Messages.map((message, index) => (
        <Message
          key={index}
          message={message.message}
          time={message.time}
          isSender={message.isSender}
        />
      ))}
    </View>
  );
};

export default Messages;
