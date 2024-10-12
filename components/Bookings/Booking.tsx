import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Button } from "@rneui/base";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";

interface TodoProps {
  todo: Todo;
}

type status = "pending" | "completed" | "canceled";
interface Todo {
  id: number;
  villaName: string;
  status: status;
  date: string;
  thumbnail: string;
  address: string;
  price: number;
}

const Booking = (TodoProps: TodoProps) => {
  const navigation = useNavigation();
  const { todo } = TodoProps;
  const RenderStatus = () => {
    let backgroundColor;
    switch (todo.status) {
      case "pending":
        backgroundColor = Colors.yellow;
        break;
      case "completed":
        backgroundColor = Colors.green;
        break;
      case "canceled":
        backgroundColor = Colors.red;
        break;
      default:
        backgroundColor = Colors.yellow;
    }

    return (
      <View
        style={{
          backgroundColor,
          padding: 5,
          borderRadius: 5,
        }}
        className="rounded-lg p-2"
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{todo.status}</Text>
      </View>
    );
  };
  return (
    <View
      style={{
        padding: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <Image
        style={{ width: "100%", height: 200, borderRadius: 10 }}
        source={{ uri: todo.thumbnail }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
        {todo.villaName}
      </Text>
      <Text style={{ fontSize: 16, color: "#666", marginTop: 5 }}>
        {todo.address}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <View>
          <Text style={{ fontSize: 16, color: "#666" }}>Date: {todo.date}</Text>
          <Text style={{ fontSize: 16, color: "#666" }}>{todo.price} VND</Text>
        </View>
        <RenderStatus />
      </View>

      <TouchableOpacity
        className="bg-gray-200 p-4 rounded-md mt-4 border border-gray-400"
        style={{
          backgroundColor: Colors.primary,
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
          borderBlockColor: "#ddd",
        }}
        onPress={() => {
          navigation.navigate("ViewDetailBookingHouseKeepper", { id: todo.id });
        }}
      >
        <Text style={{ textAlign: "center" }}>View Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Booking;
