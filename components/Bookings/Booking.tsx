import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Button } from "@rneui/base";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { getStatusStyle } from "@/constants/getStatusStyle";
import { parseStatusBooking } from "@/utils/parseStatusBooking";
import { Ionicons } from "@expo/vector-icons";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import { BookingType } from "@/types";

const Booking = (item: BookingType) => {
  const navigation = useNavigation();
  const { icon, color, textColor } = getStatusStyle(parseStatusBooking(item));
  return (
    <TouchableOpacity
      className="bg-white p-5 mb-5 mx-4 rounded-2xl shadow-lg"
      onPress={() => {
        navigation.navigate("BookingDetail", { id: item.id });
      }}
    >
      {/* Hình ảnh đại diện */}
      <Image
        source={{ uri: "https://picsum.photos/200/300" }}
        className="w-full h-40 rounded-xl mb-4"
      />

      {/* Tiêu đề và trạng thái */}
      <View className="flex flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-semibold text-gray-800">
          {item.residence_name}
        </Text>
        <View className="flex flex-row items-center">
          <Ionicons name={icon} size={24} color={color} />
          <Text className={`ml-2 font-medium ${textColor}`}>
            {parseStatusBooking(item)}
          </Text>
        </View>
      </View>

      {/* Thông tin chi tiết */}
      <View className="mb-4">
        <View className="flex flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">Check-in:</Text>{" "}
            {parseDateDDMMYYYY(item.checkin)}
          </Text>
        </View>
        <View className="flex flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">Check-out:</Text>{" "}
            {parseDateDDMMYYYY(item.checkout)}
          </Text>
        </View>
        <View className="flex flex-row items-center mb-2">
          <Ionicons name="moon-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">Số đêm:</Text> {item.total_night}
          </Text>
        </View>
        <View className="flex flex-row items-center mb-2">
          <Ionicons name="person-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">Tên khách hàng:</Text>{" "}
            {item.guest_name || "N/A"}
          </Text>
        </View>
        <View className="flex flex-row items-center mb-2">
          <Ionicons name="call-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">SĐT khách hàng:</Text>{" "}
            {item.guest_phone || "N/A"}
          </Text>
        </View>
      </View>

      {/* Địa chỉ */}
      {item.residence_address ? (
        <View className="flex flex-row items-start mb-4">
          <Ionicons name="location-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700 flex-1">
            {item.residence_address}
          </Text>
        </View>
      ) : null}

      {/* Tổng số tiền */}
      <View className="flex flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">Tổng tiền:</Text>
        <Text className="text-lg font-bold text-red-600">
          {item.total_amount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Booking;
