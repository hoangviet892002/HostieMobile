import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BackButton, ImageCustom } from "@/components";
import { VillaType } from "@/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { useTranslation } from "react-i18next";

import Icon, { Icons } from "@/components/Icons";
import { router } from "expo-router";

type RouteParams = {
  params: {
    itemId: string;
  };
};

const { height, width } = Dimensions.get("window");
const VillaDetail = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { itemId } = route.params;
  const villa: VillaType = {
    id: "1",
    name: "Villa 1",
    location: "Location 1",
    thumbnail: "https://picsum.photos/200/300",
    type: "Type 1",
    standardGuests: 1,
    maximumGuests: 2,
    category: [
      { id: "1", name: "align-center" },
      { id: "2", name: "align-left" },
      { id: "1", name: "align-center" },
      { id: "2", name: "align-left" },
      { id: "1", name: "align-center" },
      { id: "2", name: "align-left" },
      { id: "1", name: "align-center" },
      { id: "2", name: "align-left" },
    ],
    images: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
    ],
    description:
      " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullatincidunt, nisl eget vestibulum ultricies, mi nunc ultricies erat, eget fermentum nunc nisl ut justo. Integer sit amet purus eget mauris.",
  };

  const renderUtilities = () => {
    return (
      <View className="flex flex-row flex-wrap">
        {villa.category.map((category, index) => (
          <View
            key={index}
            className="bg-white p-2 rounded-lg w-20 flex items-center justify-center m-4"
          >
            <Icon
              type={Icons.Feather}
              name={category.name}
              size={35}
              color={Colors.primary}
            />
          </View>
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animatable.View
        className="flex flex-row items-center"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex ">
          <Text className="text-3xl font-bold ">{villa.name}</Text>
        </View>
      </Animatable.View>
      <ImageCustom images={villa.images || []} />

      <ScrollView style={{ padding: 16, margin: 20, flex: 1 }}>
        <Animatable.View delay={120} animation={"slideInUp"}>
          <Text className="text-3xl font-bold">{villa.name}</Text>
          <Text className="text-sm text-gray-600">{villa.location}</Text>
          <View className=" bg-white p-2 rounded-lg w-20 flex items-center justify-center m-4">
            <Text className="text-sm" style={{ color: Colors.primary }}>
              {villa.type}
            </Text>
          </View>
          <View className="flex flex-row justify-between items-center ">
            <View className="flex flex-col mt-4">
              <View className="flex flex-row justify-between">
                <Text className="text-base">{t("Standard Guests")}: </Text>
                <Text className="text-base font-bold">
                  {villa.standardGuests}
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className="text-base">{t("Maximum Guests")}: </Text>
                <Text className="text-base font-bold">
                  {villa.maximumGuests}
                </Text>
              </View>
            </View>
          </View>
          <View className="my-4">
            <Text className="text-base font-semibold">{t("Description")}</Text>
            <Text className="text-base text-gray-600">{villa.description}</Text>
          </View>
          <View>
            <Text className="text-base font-semibold">{t("Utilities")}</Text>
            {renderUtilities()}
          </View>
          <View className="flex flex-row mt-5 justify-between">
            <TouchableOpacity
              className=" bg-white flex justify-center items-center h-[50px] mb-6 w-[50px] "
              style={{
                borderBlockColor: Colors.primary,
                borderRadius: 16,
                borderWidth: 1,
              }}
            >
              <Icon
                type={Icons.Feather}
                name={"bookmark"}
                size={35}
                color={Colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="p-2 rounded-3xl items-center justify-center h-[50px] mb-6 w-3/4"
              style={{ backgroundColor: Colors.primary }}
              onPress={() => {
                router.push("/CalendarDetail");
              }}
            >
              <Text className="text-base text-white">{t("Book Now")}</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VillaDetail;
