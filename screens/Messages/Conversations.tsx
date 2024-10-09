import { View, Text, ScrollView } from "react-native";
import React from "react";
import Conversation from "./Conversation";
interface Conversation {
  name: string;
  message: string;
  image: string;
  lastime: string;
}
const Conversations = () => {
  const Conversations: Conversation[] = [
    {
      name: "John Doe",
      message: "Hello",
      image: "https://picsum.photos/200/300",
      lastime: "2m ago",
    },
    {
      name: "Jane Doe",
      message: "Hi",
      image: "https://randomuser.me/api/portraits",
      lastime: "1m ago",
    },
    {
      name: "John Doe",
      message: "Hello",
      image: "https://randomuser.me/api/portraits",
      lastime: "2m ago",
    },
    {
      name: "Jane Doe",
      message: "Hi",
      image: "https://randomuser.me/api/portraits",
      lastime: "1m ago",
    },
    {
      name: "John Doe",
      message: "Hello",
      image: "https://randomuser.me/api/portraits",
      lastime: "2m ago",
    },
    {
      name: "Jane Doe",
      message: "Hi",
      image: "https://randomuser.me/api/portraits",
      lastime: "1m ago",
    },
    {
      name: "John Doe",
      message: "Hello",
      image: "https://randomuser.me/api/portraits",
      lastime: "2m ago",
    },
    {
      name: "Jane Doe",
      message: "Hi",
      image: "https://randomuser.me/api/portraits",
      lastime: "1m ago",
    },
    {
      name: "John Doe",
      message: "Hello",
      image: "https://picsum.photos/200/300",
      lastime: "2m ago",
    },
    {
      name: "Jane Doe",
      message: "Hi",
      image: "https://randomuser.me/api/portraits",
      lastime: "1m ago",
    },
    {
      name: "John Doe",
      message: "Hello",
      image: "https://randomuser.me/api/portraits",
      lastime: "2m ago",
    },
    {
      name: "Jane Doe",
      message: "Hi",
      image: "https://randomuser.me/api/portraits",
      lastime: "1m ago",
    },
    {
      name: "John Doe",
      message: "Hello",
      image: "https://randomuser.me/api/portraits",
      lastime: "2m ago",
    },
    {
      name: "Jane Doe",
      message: "Hi",
      image: "https://randomuser.me/api/portraits",
      lastime: "1m ago",
    },
    {
      name: "John Doe",
      message: "Hello",
      image: "https://randomuser.me/api/portraits",
      lastime: "2m ago",
    },
    {
      name: "Jane Doe",
      message: "Hi",
      image: "https://randomuser.me/api/portraits",
      lastime: "1m ago",
    },
  ];

  return (
    <ScrollView className="">
      {Conversations.map((item, index) => (
        <Conversation
          key={index}
          name={item.name}
          message={item.message}
          image={item.image}
          lastime={item.lastime}
        />
      ))}
    </ScrollView>
  );
};

export default Conversations;
