import React, { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon, { Icons } from "@/components/Icons";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  authActions,
  selectIsAuthenticated,
  selectRole,
} from "@/redux/slices/authSlice";
import {
  languageActions,
  selectCurrentLanguage,
} from "@/redux/slices/languageSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { getMyInfoApi } from "@/apis/users";
import { AccountInformation } from "@/types";

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
      title: t("Dashboard"),
      icon: "home",
      handle: () => {
        navigation.navigate("dashboard");
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
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        className="m-6"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* User Info */}
        <View
          className="flex flex-row items-center p-5 bg-white rounded-lg shadow-lg mb-6 "
          style={{
            elevation: 5,
          }}
        >
          <Image
            source={{
              uri:
                Account.urlAvatar ||
                "https://www.w3schools.com/w3images/avatar6.png",
            }}
            className="h-24 w-24 rounded-full"
          />
          <View className="ml-6">
            <Text className="text-xl font-bold text-gray-800">
              {Account.firstName} {Account.middleName} {Account.lastName}
            </Text>
            <Text className="text-lg text-gray-500 mt-1">{role}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View className="p-5 bg-white rounded-lg shadow-lg mb-6">
          {Account.phones.map((phone, index) => (
            <View key={index} className="flex flex-row items-center mb-4">
              <Icon
                type={Icons.Feather}
                name="phone"
                size={24}
                color="#007aff"
              />
              <Text className="text-lg font-semibold text-gray-700 ml-4">
                {phone.phone}
              </Text>
            </View>
          ))}
          <View className="flex flex-row items-center">
            <Icon type={Icons.Feather} name="mail" size={24} color="#007aff" />
            <Text className="text-lg font-semibold text-gray-700 ml-4">
              {Account.email}
            </Text>
          </View>
        </View>

        {/* Options Menu */}
        <View className="bg-white rounded-lg shadow-lg p-3">
          {optionMenu.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`flex flex-row justify-between items-center border-b border-gray-200 p-4 ${
                item.icon === "log-out" ? "border-b-0" : ""
              }`}
              onPress={item.handle}
            >
              <View className="flex flex-row justify-between w-full">
                <View className="flex flex-row items-center">
                  <Icon
                    type={Icons.Feather}
                    name={item.icon}
                    size={24}
                    color={item.icon === "log-out" ? "#e74c3c" : "#007aff"}
                  />
                  <Text className="text-lg font-semibold text-gray-800 ml-4">
                    {item.title}
                  </Text>
                </View>

                <Icon
                  type={Icons.Feather}
                  name="chevron-right"
                  size={24}
                  color="#007aff"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
