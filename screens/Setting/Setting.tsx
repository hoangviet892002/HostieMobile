import { getMyInfoApi } from "@/apis/users";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { Roles } from "@/constants/enums/roles";
import {
  authActions,
  selectIsAuthenticated,
  selectRole,
} from "@/redux/slices/authSlice";
import {
  languageActions,
  selectCurrentLanguage,
} from "@/redux/slices/languageSlice";
import { AccountInformation } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
interface menu {
  title: string;
  icon: string;
  handle: () => void;
}
const Setting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const navigation = useNavigation();
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

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        navigation.navigate("Authentication");
      }
    }, [isAuthenticated])
  );

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

  const handleChangeLanguage = () => {
    dispatch(languageActions.changeLanguage());
  };

  const optionMenu: menu[] = [
    {
      title: t("Booking"),
      icon: "calendar",
      handle: () => {
        navigation.navigate("Booking");
      },
    },
    {
      title: t("Hold"),
      icon: "bookmark",
      handle: () => {
        navigation.navigate("Hold");
      },
    },
    {
      title: t("Change Password"),
      icon: "lock",
      handle: () => {},
    },
    {
      title: t("Change Language"),
      icon: "globe",
      handle: handleChangeLanguage,
    },
    {
      title: t("Change Theme"),
      icon: "sun",
      handle: () => {},
    },
    {
      title: t("Dashboard"),
      icon: "home",
      handle: () => {
        navigation.navigate("dashboard");
      },
    },
    {
      title: t("Logout"),
      icon: "log-out",
      handle: () => {
        AsyncStorage.removeItem("session");
        dispatch(authActions.logout());
      },
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView
        className=" m-[50px] my-6 "
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
        showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
      >
        <View className="flex flex-row">
          <Image
            source={{
              uri:
                Account.urlAvatar ||
                "https://www.w3schools.com/w3images/avatar6.png",
            }}
            className="h-[100px] w-[100px] rounded-full"
          />
          <View className="flex justify-center ml-8  ">
            <Text className="text-lg font-semibold text-gray-500">
              {Account.firstName} {Account.middleName} {Account.lastName}
            </Text>

            <Text className="text-lg font-semibold text-gray-500">{role}</Text>
          </View>
        </View>

        <View className="flex justify-center my-8">
          {Account.phones.map((phone, index) => (
            <View key={index} className="flex flex-row my-4">
              <Icon
                type={Icons.Feather}
                name="phone"
                size={24}
                color={Colors.primary}
              />
              <Text className="text-lg font-semibold text-gray-500 mx-7">
                {phone.phone}
              </Text>
            </View>
          ))}
          <View className="flex flex-row my-4">
            <Icon
              type={Icons.Feather}
              name="mail"
              size={24}
              color={Colors.primary}
            />
            <Text className="text-lg font-semibold text-gray-500 mx-7">
              {Account.email}
            </Text>
          </View>
        </View>
        {role === Roles.ROLE_HOST && (
          <View className="flex flex-row mb-4">
            <TouchableOpacity
              className="flex w-1/2 justify-center items-center border border-gray-300 p-4 rounded-l-xl"
              onPress={() => {
                navigation.navigate("BookingForHost");
              }}
            >
              <Text className="text-lg font-semibold">Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex w-1/2 justify-center items-center border border-gray-300 p-4 rounded-r-xl"
              onPress={() => {
                navigation.navigate("HoldForHost");
              }}
            >
              <Text className="text-lg font-semibold">Hold</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView className="flex flex- mb-9">
          {optionMenu.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex flex-row justify-between items-center border-b border-gray-300 p-4"
              onPress={item.handle}
            >
              <View className="flex flex-row items-center">
                <Icon
                  type={Icons.Feather}
                  name={item.icon}
                  size={24}
                  color={item.icon === "log-out" ? Colors.red : Colors.primary}
                />
                <Text className="text-lg font-semibold mx-4">{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
