import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { BackButton } from "@/components";
import { RouteProp, useRoute } from "@react-navigation/native";
import { use } from "i18next";

/**
 * An Interface for the DateRangePicker component.
 *  */

type RouteParams = {
  params: {
    itemId: string;
  };
};
const CalendarDetail = () => {
  const [state, setState] = useState({
    markedDatesSystem: {},
    markedDates: {},
    fromDate: "",
    toDate: "",
  });
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { itemId } = route.params;
  useEffect(() => {
    setState({
      markedDatesSystem: {
        "2024-10-01": {
          startingDay: true,
          color: Colors.purple,
          textColor: "#ffffff",
        },
        "2024-10-02": { color: Colors.purple, textColor: "#ffffff" },
        "2024-10-03": { color: Colors.purple, textColor: "#ffffff" },
        "2024-10-04": { color: Colors.purple, textColor: "#ffffff" },
        "2024-10-05": { color: Colors.purple, textColor: "#ffffff" },
        "2024-10-06": {
          color: Colors.purple,
          textColor: "#ffffff",
          endingDay: true,
        },
      },
      markedDates: {},
      fromDate: "",
      toDate: "",
    });
  }, []);

  const onDayPress = (day: any) => {
    const { fromDate, toDate } = state;

    if (!fromDate || (fromDate && toDate)) {
      // not clear range have color different from primary
      // clear range have color primary

      setState({
        markedDates: {
          [day.dateString]: {
            startingDay: true,
            color: Colors.primary,
            textColor: "#ffffff",
          },
        },
        markedDatesSystem: {
          ...state.markedDatesSystem,
        },

        fromDate: day.dateString,
        toDate: "",
      });
    } else {
      if (new Date(fromDate) > new Date(day.dateString)) {
        setState({
          markedDatesSystem: {
            ...state.markedDatesSystem,
          },

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
        markedDatesSystem: {
          ...state.markedDatesSystem,
        },
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
  const onMonthChange = (month: any) => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animatable.View
        className="flex flex-row items-center"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex ">
          <Text className="text-3xl font-bold ">Villa</Text>
        </View>
      </Animatable.View>
      <View className="bg-gray-100 p-2 rounded-lg flex justify-center items-center">
        <Calendar
          className="bg-white rounded-lg w-[350px] h-[400px] shadow-md"
          horizontal={true}
          hideArrows={false}
          markingType={"period"}
          markedDates={{
            ...state.markedDatesSystem,
            ...state.markedDates,
          }}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
        />
      </View>
    </SafeAreaView>
  );
};

export default CalendarDetail;
