import { Stack } from "expo-router";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/stores";
import "@/resources/translate";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/redux/actions/socketActions";

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
      <AppWrapper />
    </Provider>
  );
}
