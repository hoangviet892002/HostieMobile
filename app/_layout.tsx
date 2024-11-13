import { Stack } from "expo-router";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/stores";
import "@/resources/translate";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";
import { SocketProvider } from "@/context/SocketProvider";
import {
  NotificationProvider,
  useNotification,
} from "@/context/NotificationContext";
import useSocketListener from "@/hooks/useListen";
import { eventConfig } from "@/configs/eventConfig";
import { navigationRef } from "@/utils/navigationRef";
import { refreshTokenApi } from "@/apis/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJWT } from "@/utils/decodeJWT";
import { authActions } from "@/redux/slices/authSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreAllLogs(true);
// 1 minute
const TOKEN_REFRESH_INTERVAL = 1 * 60 * 1000;
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
    {
      name: "BookingDetail",
    },
    {
      name: "DashBoard",
    },
    {
      name: "dashboard",
    },
    {
      name: "HoldDetail",
    },
  ];

  const { scheduleNotification } = useNotification();

  const socketEvents = {
    holdRequest: useSocketListener("host.receive_hold_request"),
    bookingRequest: useSocketListener("host.receive_booking_request"),
    sellerTransfer: useSocketListener("host.receive_seller_transfered"),
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
          notification.message(eventData),
          notification.navigateTo(eventData)
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
    socketEvents.RecieveChangeCalendar,
  ]);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const refreshToken = async () => {
      if (!isMounted) return;

      const session = await AsyncStorage.getItem("session");
      if (session) {
        const sessionData = JSON.parse(session);
        const response = await refreshTokenApi(sessionData.token);
        if (response.result) {
          await AsyncStorage.setItem(
            "session",
            JSON.stringify(response.result)
          );

          const decodedToken = decodeJWT(response.result.token);
          console.log(response.result.token);
          console.log(decodedToken);

          dispatch(authActions.login(decodedToken));
        } else {
          await AsyncStorage.removeItem("session");
          dispatch(authActions.logout());
          navigationRef.current?.navigate("Authentication");
        }
      }
      setLoading(false);

      // Schedule the next token refresh
      if (isMounted) {
        timeoutId = setTimeout(refreshToken, TOKEN_REFRESH_INTERVAL);
      }
    };

    // Start the token refresh cycle immediately
    refreshToken();

    return () => {
      // Cleanup function to clear the timeout and prevent memory leaks
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

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
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppWrapper />
          </GestureHandlerRootView>
        </NotificationProvider>
      </SocketProvider>
      <Toast />
    </Provider>
  );
}
