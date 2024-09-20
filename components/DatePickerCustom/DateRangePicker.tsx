import React, { useEffect, useState } from "react";
import { View } from "react-native-animatable";
import { Calendar } from "react-native-calendars";
import { Skeleton } from "@rneui/themed";

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
    isFromPickedDate: false,
    isToPickedDate: false,
    markedDates: {},
    fromDate: "",
  });
  useEffect(() => {
    if (initialRange) {
      const fromDate = initialRange[0];
      const toDate = initialRange[1];
      setState({
        ...state,

        markedDates: {
          [fromDate.toISOString().split("T")[0]]: {
            startingDay: true,
            color: "#00adf5",
            textColor: "#ffffff",
          },
          [toDate.toISOString().split("T")[0]]: {
            endingDay: true,
            color: "#00adf5",
            textColor: "#ffffff",
          },
        },
        fromDate: fromDate.toISOString().split("T")[0],
      });
    }
  }, [initialRange]);

  return (
    <View>
      {state.isFromPickedDate && state.isToPickedDate ? (
        <Skeleton />
      ) : (
        <Calendar
          className="bg-white rounded-lg w-[350px] h-[400px] shadow-md"
          horizontal={true}
          hideArrows={false}
          theme={{
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#00adf5",
            selectedDotColor: "#ffffff",
            arrowColor: "#00adf5",
            monthTextColor: "#00adf5",
            textDayFontFamily: "monospace",
            textMonthFontFamily: "monospace",
            textDayHeaderFontFamily: "monospace",
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
          {...props}
          markingType="custom"
          current={state.fromDate}
          // markedDates={state.markedDates}
        />
      )}
    </View>
  );
};

export default DateRangePicker;
