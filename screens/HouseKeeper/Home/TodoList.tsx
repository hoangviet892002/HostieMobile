import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import React, { useState } from "react";
import { DateTimePicker } from "@/components";
import { parseDate } from "@/utils/parseDate";
import * as Animatable from "react-native-animatable";
import TodoCard from "./Todo";

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

const TodoList = () => {
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const RenderModalDatePick = () => {
    return (
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Animatable.View
          className="flex items-center justify-center"
          animation="slideInDown"
        >
          <DateTimePicker
            initialRange={date}
            onSuccess={(select) => {
              setDate(select);
              setShowDatePicker(false);
            }}
          />
        </Animatable.View>
      </Modal>
    );
  };
  return (
    <Animatable.View delay={120} animation={"fadeInDown"}>
      {/*  select date */}
      <TouchableOpacity
        className="bg-blue-500 p-2 rounded-3xl items-center justify-center h-12"
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{parseDate(date.toISOString())}</Text>
      </TouchableOpacity>
      {RenderModalDatePick()}
      {/*  select date */}

      <ScrollView>
        {todos.map((todo) => (
          <TodoCard todo={todo} key={todo.id} />
        ))}
      </ScrollView>
    </Animatable.View>
  );
};

export default TodoList;
