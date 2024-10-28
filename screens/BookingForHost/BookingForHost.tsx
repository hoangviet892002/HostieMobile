import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, Loading } from "@/components";
import * as Animatable from "react-native-animatable";
import moment from "moment";
import { BookingType } from "@/types";
import { getBooksForHostApi } from "@/apis/booking";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import EmptyData from "@/components/EmptyData";
import { parseStatusBooking } from "@/utils/parseStatusBooking";
import { getStatusStyle } from "@/constants/getStatusStyle";

const BookingForHost = () => {
  const [books, setBooks] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchBooks = async (pageNumber = 1) => {
    if (pageNumber === 1 && !refreshing) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getBooksForHostApi(pageNumber);
      if (response.success && response.data.result) {
        if (pageNumber === 1) {
          setBooks(response.data.result);
        } else {
          setBooks((prevBooks) => [...prevBooks, ...response.data.result]);
        }
        setTotalPage(response.data.pagination.total_pages);
      }
    } catch (error) {
    } finally {
      if (pageNumber === 1 && !refreshing) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
      if (refreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchBooks(1);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return <EmptyData />;
  };

  const renderBookItem = ({ item }: { item: BookingType }) => {
    const { icon, color, textColor } = getStatusStyle(parseStatusBooking(item));
    return (
      <TouchableOpacity
        className="bg-white p-5 mb-5 mx-4 rounded-2xl shadow-lg"
        onPress={() => {}}
      >
        {/* Hình ảnh đại diện */}
        <Image
          source={{ uri: "https://picsum.photos/200/300" }} // Thay
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

        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={20} color="#4A5568" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-medium">Check-in:</Text>{" "}
              {moment(item.checkin).format("DD-MM-YYYY")}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={20} color="#4A5568" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-medium">Check-out:</Text>{" "}
              {moment(item.checkout).format("DD-MM-YYYY")}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="sunny-outline" size={20} color="#4A5568" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-medium">Số ngày:</Text> {item.total_day}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="moon-outline" size={20} color="#4A5568" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-medium">Số đêm:</Text> {item.total_night}
            </Text>
          </View>
        </View>

        {/* Mô tả */}
        {item.description ? (
          <View className="mb-4">
            <Text className="text-gray-600">{item.description}</Text>
          </View>
        ) : null}

        {/* Nút hành động */}
        <View className="flex-row justify-end">
          <View className="bg-blue-500 px-4 py-2 rounded-full">
            <Text className="text-white font-medium">Xem chi tiết</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading loading={loading} />
      <Animatable.View
        className="flex flex-row items-center px-4"
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
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={
          books.length === 0 && !loading
            ? { flex: 1 }
            : { paddingHorizontal: 16, paddingVertical: 8 }
        }
      />
    </SafeAreaView>
  );
};

export default BookingForHost;
