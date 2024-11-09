import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Drawer } from "expo-router/drawer";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";
const DrawterElement = [
  {
    route: "DashBoard",
    label: "DashBoard",
    type: Icons.Feather,
    icon: "home",
    component: "tab1",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
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
];

function DashboardDrawer() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
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
  );
}

export default DashboardDrawer;
