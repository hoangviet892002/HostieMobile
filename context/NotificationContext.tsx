import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "expo-router";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
interface NotificationContextProps {
  scheduleNotification: (
    title: string,
    body: string,
    seconds?: number
  ) => Promise<void>;
  notification: Notifications.Notification | null;
  expoPushToken: string | null;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const router = useRouter();
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const requestPermissions = async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
      } else {
        alert("Must use physical device for Push Notifications");
      }
    };

    requestPermissions();

    const subscription =
      Notifications.addNotificationReceivedListener(setNotification);

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        setTimeout(() => {
          router.replace(data.href);
        }, 500);
      });

    return () => {
      subscription.remove();
      responseListener.remove();
    };
  }, []);

  const scheduleNotification = async (
    title: string,
    body: string,
    data: any
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
      },
      trigger: null,
    });
    console.log("Notification scheduled");
  };

  return (
    <NotificationContext.Provider
      value={{ scheduleNotification, notification, expoPushToken }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
