import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, EmptyData, Loading } from "@/components";
import * as Animatable from "react-native-animatable";
import { HoldType } from "@/types";
import { getHoldApi } from "@/apis/booking";
import { Ionicons } from "@expo/vector-icons";
import { parseDateDDMMYYYY } from "@/utils/parseDate";

const Hold = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [holds, setHolds] = useState<HoldType[]>([]);

  const fetchHold = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const response = await getHoldApi(pageNumber);
    if (response.success && response.data.result) {
      if (pageNumber === 1) {
        setHolds(response.data.result);
      } else {
        setHolds((prevHolds) => [...prevHolds, ...response.data.result]);
      }
      setTotalPage(response.data.pagination.total_pages);
    }

    if (pageNumber === 1) {
      setLoading(false);
    } else {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHold(page);
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

  const renderHoldItem = ({ item }: { item: HoldType }) => (
    <View className="bg-white p-5 mb-5 mx-4 rounded-2xl shadow-lg">
      <Image
        source={{ uri: "https://picsum.photos/200/300" }}
        className="w-full h-40 rounded-xl mb-4"
      />

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-semibold text-gray-800">
          {item.residence_name}
        </Text>
        <View className="flex-row items-center">
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
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">Check-in:</Text>{" "}
            {parseDateDDMMYYYY(item.checkin)}
          </Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">Check-out:</Text>{" "}
            {parseDateDDMMYYYY(item.checkout)}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="sunny-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">Số ngày:</Text> {item.total_days}
          </Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="moon-outline" size={20} color="#4A5568" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-medium">Số đêm:</Text> {item.total_nights}
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
    </View>
  );

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
            <Text className="text-3xl font-bold ">Hold</Text>
          </View>
        </View>
      </Animatable.View>

      <FlatList
        data={holds}
        renderItem={renderHoldItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => <EmptyData />}
      />
    </SafeAreaView>
  );
};

export default Hold;
