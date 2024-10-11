import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "@/redux/stores";
import "@/resources/translate";
export default function RootLayout() {
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
  ];
  return (
    <Provider store={store}>
      <Stack>
        {element.map((item, index) => (
          <Stack.Screen
            key={index}
            name={item.name}
            options={{ headerShown: false }}
          />
        ))}
      </Stack>
    </Provider>
  );
}
