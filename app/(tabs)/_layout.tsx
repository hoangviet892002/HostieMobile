import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import * as Animatable from "react-native-animatable";

const TabArr = [
  {
    route: "Home",
    label: "Home",
    type: Icons.Feather,
    icon: "home",
    component: "[tab1]",
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  {
    route: "Search",
    label: "Search",
    type: Icons.Feather,
    icon: "search",
    component: "Tab2",
    color: Colors.green,
    alphaClr: Colors.greenAlpha,
  },
  {
    route: "Add",
    label: "Add New",
    type: Icons.Feather,
    icon: "plus-square",
    component: "Tab3",
    color: Colors.red,
    alphaClr: Colors.redAlpha,
  },
  {
    route: "Account",
    label: "Account",
    type: Icons.FontAwesome,
    icon: "user-circle-o",
    component: "Tab4",
    color: Colors.purple,
    alphaClr: Colors.purpleAlpha,
  },
];
interface TabButtonProps {
  item: any;
  onPress: any;
  accessibilityState: any;
}
const TabButton = (props: TabButtonProps) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
      (viewRef.current as any).animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      (textViewRef.current as any).animate({
        0: { scale: 0 },
        1: { scale: 1 },
      });
    } else {
      (viewRef.current as any).animate({ 0: { scale: 1 }, 1: { scale: 0 } });
      (textViewRef.current as any).animate({
        0: { scale: 1 },
        1: { scale: 0 },
      });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      className="items-center justify-center h-[60px] "
      style={[{ flex: focused ? 1 : 0.65 }]}
    >
      <View>
        <Animatable.View
          ref={viewRef}
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: item.color, borderRadius: 16 },
          ]}
        />
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              padding: 8,
              borderRadius: 16,
            },
            { backgroundColor: focused ? null : item.alphaClr },
          ]}
        >
          <Icon
            type={item.type}
            name={item.icon}
            color={focused ? Colors.white : Colors.primary}
          />
          <Animatable.View ref={textViewRef}>
            {focused && (
              <Text
                style={{
                  color: Colors.white,
                  paddingHorizontal: 8,
                }}
              >
                {item.label}
              </Text>
            )}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          margin: 16,
          borderRadius: 16,
        },
      }}
    >
      {TabArr.map((tab, index) => {
        return (
          <Tabs.Screen
            key={index}
            name={tab.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton item={tab} {...props} />,
              tabBarLabel: tab.label,
            }}
          />
        );
      })}
    </Tabs>
  );
}
