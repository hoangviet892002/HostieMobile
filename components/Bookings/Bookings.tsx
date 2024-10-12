import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "../DateTimePicker";
import { parseDate } from "@/utils/parseDate";
import * as Animatable from "react-native-animatable";
import Booking from "./Booking";

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

const Bookings = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      villaName: "Villa 1",
      status: "pending",
      date: "2022-09-10",
      thumbnail: "https://picsum.photos/200/300",
      address: "Jl. Raya Kuta",
      price: 100,
    },
    {
      id: 2,
      villaName: "Villa 2",
      status: "completed",
      date: "2022-09-10",
      thumbnail: "https://picsum.photos/200/300",
      address: "Jl. Raya Kuta",
      price: 100,
    },
    {
      id: 3,
      villaName: "Villa 3",
      status: "canceled",
      date: "2022-09-10",
      thumbnail: "https://picsum.photos/200/300",
      address: "Jl. Raya Kuta",
      price: 100,
    },
    {
      id: 4,
      villaName: "Villa 4",
      status: "pending",
      date: "2022-09-10",
      thumbnail: "https://picsum.photos/200/300",
      address: "Jl. Raya Kuta",
      price: 100,
    },
    {
      id: 5,
      villaName: "Villa 5",
      status: "pending",
      date: "2022-09-10",
      thumbnail: "https://picsum.photos/200/300",
      address: "Jl. Raya Kuta",
      price: 100,
    },
  ]);

  return (
    <Animatable.View delay={120} animation={"fadeInDown"}>
      <ScrollView>
        {todos.map((todo) => (
          <Booking todo={todo} key={todo.id} />
        ))}
      </ScrollView>
    </Animatable.View>
  );
};

export default Bookings;
