import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { HoldType } from "@/types";
import useToast from "@/hooks/useToast";
import { router } from "expo-router";
import { useEffect } from "react";
import { getHoldDetailApi } from "@/apis/booking";
import { useRoute, RouteProp } from "@react-navigation/native";

type RouteParams = {
  params: {
    id: string;
  };
};

const HoldSuccessScreen = () => {
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id } = route.params;
  const { t } = useTranslation();
  const [hold, setHold] = useState<null | HoldType>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();
  const fetchHold = async () => {
    setLoading(true);
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return;
    }
    const res = await getHoldDetailApi(id);

    if (res.success) {
      setHold(res.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchHold();
  }, [id]);

  return (
    <View className="flex-1 bg-gray-50 p-6">
      {/* Success Icon and Message */}
      <View className="items-center mt-10">
        <View className="bg-green-100 p-4 rounded-full">
          <MaterialIcons name="check-circle" size={60} color="#34D399" />
        </View>
        <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
          {t("Thanks, your booking has been confirmed.")}
        </Text>
      </View>

      {/* Doctor and Booking Details */}
      <View className="bg-white rounded-xl shadow-md mt-8 p-4">
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/50" }} // Replace with actual image URL
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-lg font-semibold text-gray-800">
              {hold?.residence_name}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex flex-row justify-between items-center">
          {/* Date  */}
          <View className="flex-row items-center">
            <MaterialIcons name="event" size={20} color="#4A5568" />
            <Text className="ml-2 text-base text-gray-700">
              {hold?.checkin}
            </Text>
          </View>
          <MaterialIcons name="arrow-forward" size={24} color="#A0AEC0" />
          <View className="flex-row items-center">
            <MaterialIcons name="event" size={20} color="#4A5568" />
            <Text className="ml-2 text-base text-gray-700">
              {hold?.checkout}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-xl mt-6 items-center"
        onPress={() => {
          router.replace("/(tabs)");
        }}
      >
        <Text className="text-white text-lg font-semibold">
          + {t("Add booking")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HoldSuccessScreen;
