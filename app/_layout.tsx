import { Stack } from "expo-router";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/stores";
import "@/resources/translate";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/redux/actions/socketActions";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";
import { SocketProvider } from "@/context/SocketProvider";

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
  ];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(connectSocket());

    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);
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
        <AppWrapper />
      </SocketProvider>
      <Toast />
    </Provider>
  );
}
