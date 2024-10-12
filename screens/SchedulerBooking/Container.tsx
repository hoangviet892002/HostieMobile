import { BackButton, Bookings } from "@/components";
import React, { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateRangePicker } from "@/components/DatePickerCustom";
import { Colors } from "@/constants/Colors";
import { parseDate } from "@/utils/parseDate";
import Icon, { Icons } from "@/components/Icons";
const Container = () => {
  const [state, setState] = useState({
    fromDate: new Date(),
    toDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
    modalVisible: false,
  });
  const RenderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setState({ ...state, modalVisible: false });
        }}
      >
        <Animatable.View
          className="flex items-center justify-center"
          animation="slideInDown"
        >
          <DateRangePicker
            initialRange={[state.fromDate, state.toDate]}
            onSuccess={(fromDate, toDate) => {
              setState({ ...state, fromDate, toDate, modalVisible: false });
            }}
          />
        </Animatable.View>
      </Modal>
    );
  };
  const DisplayDate = () => {
    return (
      <TouchableOpacity
        className="bg-white w-[450px] rounded-lg p-3 flex flex-row justify-center items-center"
        onPress={() => setState({ ...state, modalVisible: true })}
        style={{ borderBlockColor: Colors.primary, borderWidth: 1 }}
      >
        <Text>{parseDate(state.fromDate.toISOString())}</Text>
        <Text> - </Text>
        <Text>{parseDate(state.toDate.toISOString())}</Text>
        <Icon type={Icons.Feather} name="calendar" />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView className="h-full  pb-32">
      <Animatable.View
        className="flex flex-row items-center"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex items-center justify-center flex-row">
          <Text className="text-3xl font-bold">Scheduler Villa 1</Text>
        </View>
      </Animatable.View>
      <RenderModal />
      <DisplayDate />
      <Bookings />
    </SafeAreaView>
  );
};

export default Container;
