import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";

interface DatePickerProps {
  initialRange?: Date;
  onSuccess?: (select: Date) => void;
}
const DateTimePicker = (props: DatePickerProps) => {
  const { initialRange } = props;
  const [state, setState] = useState({
    selectedDate: initialRange,
    marked: {},
  });
  const onDayPress = (day: any) => {
    setState({
      selectedDate: new Date(day.dateString),
      marked: {
        [day.dateString]: {
          selected: true,
          selectedColor: "blue",
        },
      },
    });
  };

  return (
    <View className="bg-gray-100 p-2 rounded-lg">
      <Calendar
        className="bg-white rounded-lg w-[350px] h-[400px] shadow-md"
        current={state.selectedDate?.toISOString().split("T")[0]}
        onDayPress={onDayPress}
        markedDates={state.marked}
      />

      <TouchableOpacity
        className="bg-blue-500 p-2 rounded-3xl items-center justify-center"
        onPress={() => {
          if (state.selectedDate) {
            props.onSuccess?.(state.selectedDate);
          }
        }}
      >
        <Text>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DateTimePicker;
