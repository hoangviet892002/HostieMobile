import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BackButton, ImageCustom, Loading } from "@/components";
import { VillaType } from "@/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { useTranslation } from "react-i18next";

import Icon, { Icons } from "@/components/Icons";
import { router } from "expo-router";
import { getImages, getResidence } from "@/apis/residences";

type RouteParams = {
  params: {
    itemId: string;
  };
};

interface Residence {
  residence_id: string;
  residence_name: string;
  residence_type: string;
  residence_type_id: string;
  residence_address: string;
  province: string;
  district: string;
  ward: string;
  num_of_bathrooms: number;
  num_of_bedrooms: number;
  num_of_beds: number;
  max_guests: number;
  step: number;
  amenities: {
    id: number;
    name: string;
    icon: string;
    description: string;
  }[];

  phones: {
    id: number;
    phone: string;
  }[];
}

const { height, width } = Dimensions.get("window");
const VillaDetail = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { itemId } = route.params;
  const [villa, setVilla] = useState<Residence>({
    amenities: [],
    district: "",
    max_guests: 0,
    num_of_bathrooms: 0,
    num_of_bedrooms: 0,
    num_of_beds: 0,
    phones: [],
    province: "",
    residence_address: "",
    residence_id: "",
    residence_name: "",
    residence_type: "",
    residence_type_id: "",
    step: 0,
    ward: "",
  });
  const fetchVillaDetail = async (id: string) => {
    const res = await getResidence(id);
    if (res.success) {
      setVilla(res.data);
    }
  };
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ id: string; image: string }[]>([]);
  const fetchImages = async (id: string) => {
    const res = await getImages(id);
    if (res.success) {
      setImages(res.data.images);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchVillaDetail(itemId);
    fetchImages(itemId);
    setLoading(false);
  }, [itemId]);

  const renderUtilities = () => {
    return (
      <View className="flex flex-row flex-wrap">
        {villa.amenities.map((category, index) => (
          <View
            key={index}
            className="bg-white p-2 rounded-lg w-20 flex items-center justify-center m-4"
          >
            <Image
              source={{ uri: category.icon }}
              style={{ width: 35, height: 35 }}
            />
            <Text className="text-sm">{category.name}</Text>
          </View>
        ))}
      </View>
    );
  };
  const RenderPhoneContact = () => {
    return (
      <View className="flex ">
        <Text className="text-base font-semibold mt-4">{t("Contact")}</Text>
        {villa.phones.map((phone, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-2 rounded-lg flex items-center justify-center "
          >
            <Text className="text-sm">{phone.phone}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading loading={loading} />
      <Animatable.View
        className="flex flex-row items-center"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex ">
          <Text className="text-3xl font-bold ">{villa.residence_name}</Text>
        </View>
      </Animatable.View>
      <ImageCustom images={images.map((img) => img.image) || []} />

      <ScrollView style={{ padding: 16, margin: 20, flex: 1 }}>
        <Animatable.View delay={120} animation={"slideInUp"}>
          <Text className="text-3xl font-bold">{villa.residence_name}</Text>
          <Text className="text-sm text-gray-600">
            {villa.residence_address}, {villa.ward}, {villa.district},{" "}
            {villa.province}
          </Text>

          <View className=" bg-white p-2 rounded-lg w-20 flex items-center justify-center m-4">
            <Text className="text-sm" style={{ color: Colors.primary }}>
              {villa.residence_type}
            </Text>
          </View>
          <View className=" flex flex-row justify-between">
            <View className="flex flex-row justify-between items-center ">
              <View className="flex flex-col mt-4">
                <View className="flex flex-row justify-between">
                  <Text className="text-base">{t("Standard Guests")}: </Text>
                  <Text className="text-base font-bold">
                    {villa.num_of_bathrooms}
                  </Text>
                </View>
                <View className="flex flex-row">
                  <Text className="text-base">{t("Maximum Guests")}: </Text>
                  <Text className="text-base font-bold">
                    {villa.max_guests}
                  </Text>
                </View>
                <View className="flex flex-row">
                  <Text className="text-base">{t("Bedrooms")}: </Text>
                  <Text className="text-base font-bold">
                    {villa.num_of_bedrooms}
                  </Text>
                </View>
                <View className="flex flex-row">
                  <Text className="text-base">{t("Beds")}: </Text>
                  <Text className="text-base font-bold">
                    {villa.num_of_beds}
                  </Text>
                </View>

                <View className="flex flex-row">
                  <Text className="text-base">{t("Bathrooms")}: </Text>
                  <Text className="text-base font-bold">
                    {villa.num_of_bathrooms}
                  </Text>
                </View>
              </View>
            </View>
            <RenderPhoneContact />
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
              onPress={() => {
                router.push(`/CalendarBooking?ids=${villa.residence_id}`);
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
              className="p-2 rounded-3xl items-center justify-center h-[50px] mb-6 w-2/4"
              style={{ backgroundColor: Colors.primary }}
              onPress={() => {
                router.push(`/CalendarBooking?ids=${villa.residence_id}`);
              }}
            >
              <Text className="text-base text-white">{t("Booking.Book")}</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VillaDetail;
