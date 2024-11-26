import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HoldType } from "@/types";
import { useTranslation } from "react-i18next";
import { RouteProp, useRoute } from "@react-navigation/native";
import { acceptHoldApi, getHoldDetailApi } from "@/apis/booking";
import { Loading } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { parseStatusHold } from "@/utils/parseStatusHold";
import moment from "moment";

import { getStatusHoldStyle } from "@/constants/getStatusHoldStyle";
import { StatusHold } from "@/constants/enums/statusHoldEnums";
import useToast from "@/hooks/useToast";
import Icon, { Icons } from "@/components/Icons";
import { BackButton } from "@/components";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Colors } from "@/constants/Colors";
type RouteParams = {
  params: {
    id: string;
  };
};
const HoldDetail = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [Hold, setHold] = useState<HoldType | null>(null);
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id } = route.params;

  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
  const [visible, setVisible] = useState(false);
  const renderHoldItem = ({ item }: { item: HoldType }) => {
    const { color, icon, textColor } = getStatusHoldStyle(
      parseStatusHold(item)
    );

    return (
      <View className="flex items-center justify-center">
        <View className="bg-white p-6 rounded-xl w-11/12 shadow-lg">
          <Text className="text-2xl font-bold mb-6 text-center ">
            Chi tiết Hold
          </Text>

          {/* Image */}
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            className="w-full h-40 rounded-lg mb-4"
          />

          {/* Title and Status */}
          <View className="flex flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-gray-800">
              {item.residence_name}
            </Text>
            <View className="flex flex-row items-center">
              <Ionicons name={icon} size={20} color={color} />
              <Text className={`ml-1 font-medium ${textColor}`}>
                {item ? parseStatusHold(item) : ""}
              </Text>
            </View>
          </View>

          {item.reason_reject && (
            <View className="bg-red-100 p-2 rounded-md mb-4">
              <Text className="text-red-500">{item.reason_reject}</Text>
            </View>
          )}

          {/* Date Information */}
          <View className="flex flex-row justify-between items-center mb-2">
            <View className="flex flex-row items-center">
              <Ionicons name="calendar-outline" size={18} color="#4A5568" />
              <Text className="ml-1 text-gray-700">
                {item?.checkin} - {item?.checkout}
              </Text>
            </View>
            <View className="flex flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#4A5568" />
              <Text className="ml-1 text-gray-700">
                {moment(item?.created_at).fromNow()}
              </Text>
            </View>
          </View>

          {/* Seller Information */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              {t("Seller")}:
            </Text>
            <View className="flex flex-row items-center mt-2">
              <Image
                source={{
                  uri: Hold?.seller_avatar || "https://via.placeholder.com/150",
                }}
                className="w-12 h-12 rounded-full"
                accessibilityLabel="Seller Avatar"
              />
              <Text className="ml-3 text-gray-700 text-lg">
                {item?.seller_name}
              </Text>
            </View>
          </View>

          {/* Description */}
          {item?.description && (
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Mô tả:
              </Text>
              <Text className="text-gray-700 mt-2">{item?.description}</Text>
            </View>
          )}

          {/* Action Buttons */}

          {item && parseStatusHold(item) === StatusHold.WAIT_ACCEPT ? (
            <View className="w-full">
              <TouchableOpacity
                className=" bg-green-500 p-3 rounded-3xl flex flex-row justify-center items-center w-full mb-4"
                onPress={() => acceptBooking(true)}
                activeOpacity={0.8}
              >
                <Icon
                  type={Icons.AntDesign}
                  name="checkcircle"
                  size={20}
                  color="#fff"
                />
                <Text className="text-white text-center text-lg font-semibold ml-2">
                  Accept
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className=" bg-red-500 p-3 rounded-3xl flex-row justify-center items-center w-full"
                // onPress={() => acceptBooking(false)}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
              >
                <Icon
                  type={Icons.AntDesign}
                  name="closecircle"
                  size={20}
                  color="#fff"
                />
                <Text className="text-white text-center text-lg font-semibold ml-2">
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="absolute top-2 right-2"
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          {/* Formik with reason reject */}
          <View
            className="flex-1 justify-center items-center  bg-opacity-60"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Formik
              initialValues={{ reason: "" }}
              onSubmit={(values) => {
                acceptBooking(false, values.reason);
              }}
              validate={(values) => {
                const errors: any = {};
                if (!values.reason) {
                  errors.reason = "Required";
                }
                return errors;
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View className="bg-white p-4 w-11/12 rounded-lg">
                  <Text className="text-xl font-semibold text-gray-800 mb-4">
                    {t("Reason for reject")}
                  </Text>
                  <View className="flex flex-col items-center">
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: Colors.primary,
                        borderWidth: 2,
                        borderRadius: 25,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginVertical: 5,
                        width: "auto",
                      }}
                    >
                      <Icon
                        type={Icons.AntDesign}
                        // icon for reason
                        name="closecircle"
                        size={20}
                        color={Colors.primary}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          color: Colors.black,
                          paddingVertical: 8,
                        }}
                        placeholder={t("Reason for reject")}
                        onChangeText={handleChange("reason")}
                        onBlur={handleBlur("reason")}
                        value={values.reason}
                      />
                      {errors.reason && (
                        <Text style={{ color: "red" }}>{errors.reason}</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    className="bg-red-500 p-4 rounded-3xl ml-2 flex justify-center items-center my-3"
                    onPress={() => handleSubmit()}
                  >
                    <Text className="text-white">{t("Submit")}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </Modal>
      </View>
    );
  };
  const acceptBooking = async (accept: boolean, reason?: string) => {
    setLoading(true);
    const data: {
      hold_id: number | undefined;
      checkin: string | undefined;
      checkout: string | undefined;
      accept: boolean;
      reason_reject?: string;
    } = {
      hold_id: Hold?.id,
      checkin: Hold?.checkin,
      checkout: Hold?.checkout,
      accept: accept,
    };
    if (!accept && reason) {
      data["reason_reject"] = reason;
    }

    const res = await acceptHoldApi(data);
    showToast(res);
    if (res.success) {
      fetchHold();
    }
    setLoading(false);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <Loading loading={loading} />
      <Animatable.View
        className="flex flex-row items-center px-4"
        delay={120}
        animation="slideInDown"
      >
        <BackButton navigateTo="dashboard" />
        <View className="flex flex-row items-center ">
          <View className="flex ">
            <Text className="text-3xl font-bold ">Hold Detail</Text>
          </View>
        </View>
      </Animatable.View>

      {Hold && renderHoldItem({ item: Hold })}
    </SafeAreaView>
  );
};

export default HoldDetail;
