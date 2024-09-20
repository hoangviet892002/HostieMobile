import { DateRangePicker } from "@/components/DatePickerCustom";
import React, { useState } from "react";
import { Text, View } from "react-native";

const Home = () => {
  const [state, setState] = useState({
    // today
    fromDate: new Date(),
    // tomorrow
    toDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });
  return (
    <View>
      <Text>Home</Text>
      <Text>From: {state.fromDate.toISOString().split("T")[0]}</Text>
      <Text>To: {state.toDate.toISOString().split("T")[0]}</Text>
      <DateRangePicker
        initialRange={[state.fromDate, state.toDate]}
        onSuccess={(fromDate, toDate) => {
          setState({ ...state, fromDate, toDate });
        }}
      />
    </View>
  );
};

export default Home;
