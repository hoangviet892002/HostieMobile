import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "@/redux/stores";
import "@/resources/translate";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="Authentication" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="VillaDetail" options={{ headerShown: false }} />
        <Stack.Screen name="CalendarDetail" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
