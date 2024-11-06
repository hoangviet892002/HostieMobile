import { Bookings, DateTimePicker } from "@/components";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { parseDate } from "@/utils/parseDate";

const Container = () => {
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
    <SafeAreaView className="h-full p-5 pb-24">
      {/*  select date */}
      {/* <TouchableOpacity
        className="bg-blue-500 p-2 rounded-3xl items-center justify-center h-12"
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{parseDate(date.toISOString())}</Text>
      </TouchableOpacity> */}
      {RenderModalDatePick()}
      {/*  select date */}
      <Bookings />
    </SafeAreaView>
  );
};

export default Container;
