import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AccountInformation } from "@/types";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "react-native";
import Icon, { Icons } from "@/components/Icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  languageActions,
  selectCurrentLanguage,
} from "@/redux/slices/languageSlice";

interface menu {
  title: string;
  icon: string;
  handle: () => void;
}
const Setting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const Account: AccountInformation = {
    name: "John Doe",
    email: "sdad",
    phone: "123456789",
    avatar: "https://picsum.photos/200/300",
    type: "Admin",
  };
  const moreInfo = {
    wallet: 1000,
    house: 5,
  };
  const handleChangeLanguage = () => {
    dispatch(languageActions.changeLanguage());
  };

  const optionMenu: menu[] = [
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
      title: t("Logout"),
      icon: "log-out",
      handle: () => {},
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView className=" m-[50px] ">
        <View className="flex flex-row">
          <Image
            source={{ uri: Account.avatar }}
            className="h-[100px] w-[100px] rounded-full"
          />
          <View className="flex justify-center ml-8  ">
            <Text
              className="font-semibold text-3xl"
              style={{ color: Colors.primary }}
            >
              {Account.name}
            </Text>

            <Text className="text-lg font-semibold text-gray-500">
              {Account.type}
            </Text>
          </View>
        </View>

        <View className="flex justify-center my-8">
          <View className="flex flex-row">
            <Icon
              type={Icons.Feather}
              name="phone"
              size={24}
              color={Colors.primary}
            />

            <Text className="text-lg font-semibold text-gray-500 mx-7">
              {Account.phone}
            </Text>
          </View>
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
        <View className="flex flex-row">
          <View className="flex w-1/2 justify-center items-center border border-gray-300 p-4 rounded-l-xl">
            <Text className="text-3xl font-semibold mx-2">
              {moreInfo.wallet}
            </Text>
            <Text className="text-lg font-semibold">{t("Wallet")}</Text>
          </View>
          <View className="flex w-1/2 justify-center items-center border border-gray-300 p-4 rounded-r-xl">
            <Text className="text-3xl font-semibold mx-2">
              {moreInfo.house}
            </Text>
            <Text className="text-lg font-semibold">{t("House")}</Text>
          </View>
        </View>
        <View className="flex flex-col mt-8">
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;