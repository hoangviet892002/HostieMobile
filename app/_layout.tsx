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
import { eventConfig } from "@/configs/eventConfig";

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
    {
      name: "Hold",
    },
    {
      name: "Booking",
    },
  ];

  const { scheduleNotification } = useNotification();

  const socketEvents = {
    holdRequest: useSocketListener("host.receive_hold_request"),
    bookingRequest: useSocketListener("host.receive_booking_request"),
    sellerTransfer: useSocketListener("host.receive_seller_transfer"),
    holdAcceptReject: useSocketListener("seller.receive_hold_accepted_reject"),
    bookingAcceptReject: useSocketListener(
      "seller.receive_booking_accepted_reject"
    ),
    hostReceiveTransfer: useSocketListener("seller.host_receive_transfer"),
    hostNotReceiveTransfer: useSocketListener(
      "seller.host_not_receive_transfer"
    ),
    RecieveChangeCalendar: useSocketListener("common.receive_change_calendar"),
  };

  useEffect(() => {
    eventConfig.forEach(({ key, log, notification }) => {
      const eventData = socketEvents[key as keyof typeof socketEvents];
      if (eventData) {
        scheduleNotification(
          notification.title,
          notification.message(eventData)
        );
      }
    });
  }, [
    socketEvents.holdRequest,
    socketEvents.bookingRequest,
    socketEvents.sellerTransfer,
    socketEvents.holdAcceptReject,
    socketEvents.bookingAcceptReject,
    socketEvents.hostReceiveTransfer,
    socketEvents.hostNotReceiveTransfer,
  ]);

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
