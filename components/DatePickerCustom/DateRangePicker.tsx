import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import { Calendar } from "react-native-calendars";

/**
 * An Interface for the DateRangePicker component.
 *  */
interface DateRangePickerProps {
  initialRange?: Date[];
  onSuccess?: (fromDate: Date, toDate: Date) => void;
}
const DateRangePicker = (props: DateRangePickerProps) => {
  const { initialRange } = props;
  const [state, setState] = useState({
    markedDates: {},
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    if (initialRange) {
      const [fromDate, toDate] = initialRange;
      setState({
        markedDates: {
          ...middleDates(
            fromDate.toISOString().split("T")[0],
            toDate.toISOString().split("T")[0]
          ),
          [fromDate.toISOString().split("T")[0]]: {
            startingDay: true,
            color: Colors.primary,
            textColor: "#ffffff",
          },
          [toDate.toISOString().split("T")[0]]: {
            endingDay: true,
            color: Colors.primary,
            textColor: "#ffffff",
          },
        },
        fromDate: fromDate.toISOString().split("T")[0],
        toDate: toDate.toISOString().split("T")[0],
      });
    }
  }, [initialRange]);

  const onDayPress = (day: any) => {
    const { fromDate, toDate } = state;
    if (!fromDate || (fromDate && toDate)) {
      setState({
        markedDates: {
          [day.dateString]: {
            startingDay: true,
            color: Colors.primary,
            textColor: "#ffffff",
          },
        },
        fromDate: day.dateString,
        toDate: "",
      });
    } else {
      if (new Date(fromDate) > new Date(day.dateString)) {
        setState({
          markedDates: {
            [day.dateString]: {
              startingDay: true,
              color: Colors.primary,
              textColor: "#ffffff",
            },
          },
          fromDate: day.dateString,
          toDate: "",
        });
        return;
      }
      if (fromDate === day.dateString) {
        return;
      }
      const dates = middleDates(fromDate, day.dateString);
      setState({
        markedDates: {
          ...state.markedDates,
          ...dates,
          [day.dateString]: {
            endingDay: true,
            color: Colors.primary,
            textColor: "#ffffff",
          },
        },
        fromDate,
        toDate: day.dateString,
      });
    }
  };

  const middleDates = (fromDate: string, toDate: string) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const dates: { [key: string]: { color: string; textColor: string } } = {};
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + 1);
    while (currentDate <= end) {
      dates[currentDate.toISOString().split("T")[0]] = {
        color: Colors.primary,
        textColor: "#ffffff",
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  return (
    <View className="bg-gray-100 p-2 rounded-lg">
      <Calendar
        className="bg-white rounded-lg w-[350px] h-[400px] shadow-md"
        horizontal={true}
        hideArrows={false}
        markingType={"period"}
        markedDates={initialRange ? state.markedDates : {}}
        onDayPress={onDayPress}
      />
      <TouchableOpacity
        className="m-2 p-3 rounded-lg flex items-center justify-center bg-blue-500"
        onPress={() => {
          props.onSuccess?.(new Date(state.fromDate), new Date(state.toDate));
        }}
      >
        <Text className="text-white">Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DateRangePicker;
