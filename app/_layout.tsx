import { Stack } from "expo-router";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/stores";
import "@/resources/translate";
import { useEffect, useState } from "react";

import { LogBox } from "react-native";
import Toast from "react-native-toast-message";
import { SocketProvider } from "@/context/SocketProvider";
import {
  NotificationProvider,
  useNotification,
} from "@/context/NotificationContext";
import useSocketListener from "@/hooks/useListen";

LogBox.ignoreAllLogs(true);

const AppWrapper = () => {
  const element = [
    {
      name: "Authentication",
    },
    {
      name: "index",
    },
    {
      name: "(tabs)",
    },
    {
      name: "VillaDetail",
    },
    {
      name: "CalendarDetail",
    },
    {
      name: "AddVilla",
    },
    {
      name: "Conversation",
    },
    {
      name: "housekeeper",
    },
    {
      name: "ViewDetailBookingHouseKeepper",
    },
    {
      name: "SchedulerBooking",
    },
    {
      name: "HostVillaDetail",
    },
    {
      name: "CalendarBooking",
    },
    {
      name: "BlockResidence",
    },
    {
      name: "HoldForHost",
    },
    {
      name: "BookingForHost",
    },
  ];
  const { scheduleNotification } = useNotification();
  const eventData = useSocketListener("host.receive_hold_request");
  useEffect(() => {
    if (eventData) {
      console.log("eventData", eventData);
      scheduleNotification(
        "Hold request",
        "You have a hold request from residence: " + eventData.residence_id
      );
      // Handle the event data here
    }
  }, [eventData]);
  return (
    <Stack>
      {element.map((item, index) => (
        <Stack.Screen
          key={index}
          name={item.name}
          options={{ headerShown: false }}
        />
      ))}
    </Stack>
  );
};
export default function RootLayout() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <NotificationProvider>
          <AppWrapper />
        </NotificationProvider>
      </SocketProvider>
      <Toast />
    </Provider>
  );
}
