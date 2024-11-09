import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Drawer } from "expo-router/drawer";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { useCallback, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AccountInformation } from "@/types";
import { getMyInfoApi } from "@/apis/users";
import { DrawerItemList } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { selectRole } from "@/redux/slices/authSlice";
const DrawterElement = [
  {
    route: "DashBoard",
    label: "Dash Board",
    type: Icons.Feather,
    icon: "home",
    component: "tab1",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  {
    router: "Notification",
    label: "Notification",
    type: Icons.Feather,
    icon: "bell",
    component: "tab8",
    color: Colors.primary,
  },
  {
    router: "Package",
    label: "Package",
    type: Icons.Feather,
    icon: "package",
    component: "tab2",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  {
    router: "Booking",
    label: "Booking Out",
    type: Icons.Feather,
    icon: "calendar",
    component: "tab4",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  {
    router: "Hold Out",
    label: "Hold Out",
    type: Icons.Feather,
    icon: "bookmark",
    component: "tab5",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  {
    router: "Booking In",
    label: "Booking In",
    type: Icons.Feather,
    icon: "calendar",
    component: "tab6",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  {
    router: "Hold In",
    label: "Hold In",
    type: Icons.Feather,
    icon: "bookmark",
    component: "tab7",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  {
    router: "Bank Account",
    label: "Bank Account",
    type: Icons.Feather,
    icon: "credit-card",
    component: "tab9",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
];

function DashboardDrawer() {
  const role = useSelector(selectRole);
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
  const fetchMyInfo = async () => {
    const response = await getMyInfoApi();
    if (response) {
      SetAccount(response.result);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchMyInfo();
    }, [])
  );

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
                  <Text className="text-lg font-bold text-primary">
                    {Account.email}
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
              drawerLabel: "Exit",
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
                router.replace("/(tabs)");
              },
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default DashboardDrawer;
