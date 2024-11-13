import { getMyInfoApi } from "@/apis/users";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { authActions } from "@/redux/slices/authSlice";
import { AccountInformation } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerItemList } from "@react-navigation/drawer";
import { router, Tabs, useFocusEffect } from "expo-router";
import Drawer from "expo-router/drawer";
import { useCallback, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const DrawterElement = [
  // Home
  {
    route: "Home",
    label: "Home",
    type: Icons.Feather,
    icon: "home",
    component: "tag1",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  // chat
  {
    route: "Chat",
    label: "Chat",
    type: Icons.Feather,
    icon: "message-square",
    component: "tag2",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  // Mangage Villa
  {
    route: "Villa",
    label: "Villa",
    type: Icons.Feather,
    icon: "home",
    component: "tag3",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  // profile
  {
    route: "Profile",
    label: "Profile",
    type: Icons.Feather,
    icon: "user",
    component: "tag4",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
];
interface TabButtonProps {
  item: any;
  onPress: any;
  accessibilityState: any;
}

export default function TabLayout() {
  const dispatch = useDispatch();
  const [Account, SetAccount] = useState<AccountInformation>({
    email: "",
    username: "",
    bankAccounts: [],
    firstName: "",
    lastName: "",
    middleName: "",
    phones: [],
    point: 0,
    socials: [],
    urlAvatar: "",
  });
  function CustomHeader({ props, label }: { props: any; label: string }) {
    return (
      <View className="flex flex-row items-center justify-between p-4">
        <TouchableOpacity
          onPress={() => props.navigation.toggleDrawer()}
          className="w-6"
        >
          <Icon
            type={Icons.Feather}
            name="menu"
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">{label}</Text>
        <View className="w-6" />
      </View>
    );
  }
  const fetchMyInfo = async () => {
    const response = await getMyInfoApi();
    console.log(response);
    if (response) {
      SetAccount(response.result);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchMyInfo();
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerPosition: "left",
            drawerType: "slide",
            drawerStyle: {
              width: 240,
            },
            header: (props) => (
              <CustomHeader
                props={props}
                label={
                  DrawterElement.find(
                    (item) => item.component === props.route.name
                  )?.label || ""
                }
              />
            ),
          }}
          drawerContent={(props) => {
            return (
              <SafeAreaView>
                <View className="flex flex-col items-center justify-center p-4">
                  <Image
                    className="h-[130px] w-[130px] rounded-full"
                    source={{ uri: Account.urlAvatar }}
                  />
                  <Text className="text-lg font-bold text-primary">
                    {Account.firstName} {Account.middleName} {Account.lastName}
                  </Text>
                </View>
                <DrawerItemList {...props} />
              </SafeAreaView>
            );
          }}
        >
          {DrawterElement.map((item, index) => (
            <Drawer.Screen
              key={index}
              name={item.component}
              options={{
                headerTitle: item.label,
                drawerLabel: item.label,
                drawerIcon: ({ color }) => (
                  <Icon
                    type={item.type}
                    name={item.icon}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
          ))}

          {/* exit  */}
          <Drawer.Screen
            name="logout"
            options={{
              drawerLabel: "Logout",
              drawerIcon: ({ color }) => (
                <Icon
                  type={Icons.Feather}
                  name="log-out"
                  size={24}
                  color={color}
                />
              ),
              headerShown: false,
              drawerItemStyle: { marginTop: "auto" },
            }}
            listeners={{
              drawerItemPress: (e) => {
                e.preventDefault();
                AsyncStorage.removeItem("session");
                dispatch(authActions.logout());
                router.replace("/Authentication");
              },
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
