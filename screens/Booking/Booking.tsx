import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, EmptyData, Loading } from "@/components";
import * as Animatable from "react-native-animatable";
import { BookingType } from "@/types";
import { getBookingApi } from "@/apis/booking";
import { Ionicons } from "@expo/vector-icons";
import { parseDateDDMMYYYY } from "@/utils/parseDate";

const Booking = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [books, setBooks] = useState<BookingType[]>([]);
  const fetchBook = async (pageNumber = 1) => {
    setLoading(true);
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const response = await getBookingApi(page);
    if (response.success && response.data.result) {
      setBooks((prevBooks) => [...prevBooks, ...response.data.result]);

      setTotalPage(response.data.pagination.total_pages);
    }
    setLoading(false);
    if (pageNumber === 1) {
      setLoading(false);
    } else {
      setLoadingMore(false);
    }
  };
  useEffect(() => {
    fetchBook();
  }, [page]);
  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderItem = ({ item }: { item: BookingType }) => {
    return (
      <View className="bg-white p-5 mb-5 mx-4 rounded-2xl shadow-lg">
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
            <Ionicons
              name={item.is_host_accept ? "checkmark-circle" : "time-outline"}
              size={24}
              color={item.is_host_accept ? "#38A169" : "#ECC94B"}
            />
            <Text
              className={`ml-2 font-medium ${
                item.is_host_accept ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {item.is_host_accept ? "Đã chấp nhận" : "Đang chờ"}
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

        {/* Nút hành động */}
        <View className="flex flex-row justify-end">
          <View className="bg-blue-500 px-4 py-2 rounded-full">
            <Text className="text-white font-medium">Xem chi tiết</Text>
          </View>
        </View>
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
        <View className="flex flex-row items-center ">
          <View className="flex ">
            <Text className="text-3xl font-bold ">Booking</Text>
          </View>
        </View>
      </Animatable.View>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => <EmptyData />}
      />
    </SafeAreaView>
  );
};

export default Booking;
