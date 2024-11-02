import { getBookingApi } from "@/apis/booking";
import { BackButton, EmptyData, Loading } from "@/components";
import { getStatusStyle } from "@/constants/getStatusStyle";
import useToast from "@/hooks/useToast";
import { BookingType } from "@/types";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import { parseStatusBooking } from "@/utils/parseStatusBooking";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const Booking = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [books, setBooks] = useState<BookingType[]>([]);
  const navigation = useNavigation();
  const { showToast } = useToast();
  const fetchBook = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getBookingApi(pageNumber);
      if (response.success && response.data.result) {
        if (pageNumber === 1) {
          setBooks(response.data.result);
        } else {
          setBooks((prevBooks) => [...prevBooks, ...response.data.result]);
        }
        setTotalPage(response.data.pagination.total_pages);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Failed to fetch bookings:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch bookings.",
      });
    } finally {
      if (pageNumber === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBook();
    }, [])
  );
  useEffect(() => {
    fetchBook(page);
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
