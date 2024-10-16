import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

import { BackButton, DateRangePicker, ImageCustom } from "@/components";
import { VillaType } from "@/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { useTranslation } from "react-i18next";

import Icon, { Icons } from "@/components/Icons";
import { router } from "expo-router";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { deleteResidenc, getImages, getResidence } from "@/apis/residences";
import { parseDate } from "@/utils/parseDate";
import { holdBookingApi } from "@/apis/booking";
import Toast from "react-native-toast-message";

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
const HostDetailVilla = () => {
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
    getResidence(id).then((res) => {
      if (res.success) {
        setVilla(res.data);
      }
    });
  };
  const [images, setImages] = useState<{ id: string; image: string }[]>([]);
  const fetchImages = async (id: string) => {
    getImages(id).then((res) => {
      if (res.success) {
        setImages(res.data.images);
      }
    });
  };
  useEffect(() => {
    fetchVillaDetail(itemId);
    fetchImages(itemId);
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
          </View>
        ))}
      </View>
    );
  };

  const [modalVisible, setModalVisible] = useState(false);

  const RenderModal = () => {
    const [modalVisibleDateRange, setModalVisibleDateRange] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

    const [endDate, setEndDate] = useState(
      new Date(new Date().getTime() + 48 * 60 * 60 * 1000)
    );

    const solveApi = async () => {
      const data = {
        residence_id: parseInt(itemId),
        checkin: startDate.toISOString(),
        checkout: endDate.toISOString(),
      };
      const res = await holdBookingApi(data);
      if (res.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res.msg,
        });
        setModalVisible(!modalVisible);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.msg,
        });
      }
    };
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: width - 40,
              height: height / 2,
              borderRadius: 20,
              padding: 20,
            }}
          >
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                }}
                onPress={() => setModalVisibleDateRange(true)}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Select Date Range
                </Text>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDateRange}
                onRequestClose={() => {
                  setModalVisibleDateRange(!modalVisibleDateRange);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    className=" flex justify-center items-center"
                    style={{
                      backgroundColor: "white",
                      width: width - 40,
                      height: height / 2,
                      borderRadius: 20,
                      padding: 20,
                    }}
                  >
                    <DateRangePicker
                      initialRange={[startDate, endDate]}
                      onSuccess={(fromDate, toDate) => {
                        setStartDate(fromDate);
                        setEndDate(toDate);
                        setModalVisibleDateRange(!modalVisibleDateRange);
                      }}
                    />
                  </View>
                </View>
              </Modal>

              <View className="p-4 bg-white shadow-md rounded-lg">
                <Text className="text-gray-600 font-semibold mb-2">
                  Start Date:
                </Text>
                <Text className="text-lg text-gray-900">
                  {parseDate(startDate.toISOString())}
                </Text>

                <Text className="text-gray-600 font-semibold mt-4 mb-2">
                  End Date:
                </Text>
                <Text className="text-lg text-gray-900">
                  {parseDate(endDate.toISOString())}
                </Text>
              </View>
            </View>

            {/* submit button */}
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={() => {
                solveApi();
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>OK!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const handleDelete = async () => {
    const data = {
      id: itemId,
    };
    const res = await deleteResidenc(data);
    if (res.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.msg,
      });
      router.back();
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.msg,
      });
    }
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
                <Text className="text-base font-bold">{villa.max_guests}</Text>
              </View>
              <View className="flex flex-row">
                <Text className="text-base">{t("Bedrooms")}: </Text>
                <Text className="text-base font-bold">
                  {villa.num_of_bedrooms}
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className="text-base">{t("Beds")}: </Text>
                <Text className="text-base font-bold">{villa.num_of_beds}</Text>
              </View>

              <View className="flex flex-row">
                <Text className="text-base">{t("Bathrooms")}: </Text>
                <Text className="text-base font-bold">
                  {villa.num_of_bathrooms}
                </Text>
              </View>
            </View>
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
              onPress={() => setModalVisible(true)}
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
                router.push(`/AddVilla?villa=${JSON.stringify(villa)}`);
              }}
            >
              <Text className="text-base text-white">{t("Update")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 rounded-3xl items-center justify-center h-[50px] mb-6 w-1/4"
              style={{ backgroundColor: Colors.red }}
              onPress={handleDelete}
            >
              <Text className="text-base text-white">{t("Delete")}</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
        <RenderModal />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HostDetailVilla;
