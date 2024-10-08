import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { VillaType } from "@/types";
import { VillaManageCard } from "@/components";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { router, useNavigation } from "expo-router";

const Managers = () => {
  const { t } = useTranslation();
  const navigate = useNavigation<any>();

  const villas: VillaType[] = [
    {
      category: [],
      description:
        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullatincidunt, nisl eget vestibulum ultricies, mi nunc ultricies erat, eget fermentum nunc nisl ut justo. Integer sit amet purus eget mauris.",
      id: "1",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
      location: "Location 1",
      maximumGuests: 2,
      name: "Villa 1",
      standardGuests: 1,
      thumbnail: "https://picsum.photos/200/300",
      type: "Type 1",
    },
    {
      category: [],
      description:
        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullatincidunt, nisl eget vestibulum ultricies, mi nunc ultricies erat, eget fermentum nunc nisl ut justo. Integer sit amet purus eget mauris.",
      id: "2",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
      location: "Location 2",
      maximumGuests: 2,
      name: "Villa 2",
      standardGuests: 1,
      thumbnail: "https://picsum.photos/200/300",
      type: "Type 2",
    },
    {
      category: [],
      description:
        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullatincidunt, nisl eget vestibulum ultricies, mi nunc ultricies erat, eget fermentum nunc nisl ut justo. Integer sit amet purus eget mauris.",
      id: "3",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
      location: "Location 3",
      maximumGuests: 2,
      name: "Villa 3",
      standardGuests: 1,
      thumbnail: "https://picsum.photos/200/300",
      type: "Type 3",
    },
  ];

  return (
    <SafeAreaView>
      <View className="flex items-center flex-row justify-center ">
        <Text className="text-3xl font-bold ">{t("Managers")}</Text>
        <TouchableOpacity
          className="p-2 rounded-lg h-[50px] w-[100px] items-center justify-center m-2"
          style={{ backgroundColor: Colors.primary }}
          onPress={() => {
            navigate.navigate("AddVilla");
          }}
        >
          <Text className="text-white font-semibold">{t("Add Villa")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="m-4">
        <View className="flex justify-center items-center pb-32">
          {villas.map((villa) => (
            <VillaManageCard key={villa.id} villa={villa} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Managers;
