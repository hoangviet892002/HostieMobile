import { Animations } from "@/constants/Animations";
import { Colors } from "@/constants/Colors";
import { VillaType } from "@/types";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Icon, { Icons } from "../Icons";
import { useNavigation } from "@react-navigation/native";
interface VillaCardProps {
  villa: VillaType;
}

export const VillaCard: React.FC<VillaCardProps> = ({ villa }) => {
  const navigate = useNavigation<any>();
  const { t } = useTranslation();
  const randomAnimation =
    Animations[Math.floor(Math.random() * Animations.length)];
  return (
    <Animatable.View
      animation={randomAnimation}
      className="h-auto m-4 rounded-3xl flex justify-between bg-white shadow-2xl shadow-blue-900  overflow-hidden flex-col w-3/4"
    >
      <View className="flex">
        <Image
          source={{ uri: villa.thumbnail }}
          className="h-[200px] rounded-t-3xl"
        />
        <View className="absolute top-4 right-4 bg-white p-2 rounded-lg">
          <Icon
            type={Icons.Feather}
            name="bookmark"
            size={24}
            color={Colors.skyBlue}
          />
        </View>
        <View className="absolute bottom-4 right-4 bg-white p-2 rounded-lg">
          <Text className="text-sm" style={{ color: Colors.skyBlue }}>
            {villa.type}
          </Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-3xl font-bold">{villa.name}</Text>
        <Text className="text-sm text-gray-600">{villa.location}</Text>

        <View className="flex flex-row justify-between items-center mt-4">
          <View className="flex flex-col mt-4">
            <View className="flex flex-row justify-between">
              <Text className="text-xs">{t("Standard Guests")}: </Text>
              <Text className="text-xs font-bold">{villa.standardGuests}</Text>
            </View>
            <View className="flex flex-row">
              <Text className="text-xs">{t("Maximum Guests")}: </Text>
              <Text className="text-xs font-bold">{villa.maximumGuests}</Text>
            </View>
          </View>
          <View className="flex flex-wrap flex-row w-1/2">
            {villa.category.map((category, index) => (
              <Text key={index} className="text-xs  w-1/2 p-2">
                {category.name}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View className="p-4">
        <TouchableOpacity
          className="p-2 rounded-3xl items-center justify-center"
          style={{
            backgroundColor: Colors.primary,
            width: "100%",
            height: 50,
          }}
          onPress={() => {
            (navigate as any).navigate("VillaDetail", { itemId: villa.id });
          }}
        >
          <Text className="text-sm text-white">{t("Book Now")}</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};
