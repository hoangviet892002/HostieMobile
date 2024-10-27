import { acceptHoldApi, getHoldsForHostApi } from "@/apis/booking";
import { BackButton, EmptyData, Loading } from "@/components";
import { Colors } from "@/constants/Colors";
import { HoldType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

const HoldForHost = () => {
  const [loading, setLoading] = useState(false);
  const [holds, setHolds] = useState<HoldType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [loadingMore, setLoadingMore] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [holdDetail, setHoldDetail] = useState<HoldType | null>(null);

  const fetchHold = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const response = await getHoldsForHostApi(pageNumber);
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

  const acceptBooking = async () => {
    setLoading(true);
    const data = {
      hold_id: holdDetail?.id,
      checkin: moment(holdDetail?.checkin).format("DD-MM-YYYY"),
      checkout: moment(holdDetail?.checkout).format("DD-MM-YYYY"),
      accept: true,
    };

    const res = await acceptHoldApi(data);
    if (res.success) {
      setHolds((prevHolds) =>
        prevHolds.map((hold) => {
          if (hold.id === holdDetail?.id) {
            return { ...hold, is_host_accept: true };
          }
          return hold;
        })
      );
    }
    setLoading(false);
    setModalVisible(false);
  };

  const RenderModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-5 rounded-xl w-11/12 shadow-lg">
            <Text className="text-2xl font-bold mb-4 text-center">
              Chi tiết Booking
            </Text>

            <View className="mb-3">
              <Text className="font-bold">Check-in:</Text>
              <Text>{moment(holdDetail?.checkin).format("DD-MM-YYYY")}</Text>
            </View>

            <View className="mb-3">
              <Text className="font-bold">Check-out:</Text>
              <Text>{moment(holdDetail?.checkout).format("DD-MM-YYYY")}</Text>
            </View>

            <View className="mb-3">
              <Text className="font-bold">Tổng số ngày:</Text>
              <Text>{holdDetail?.total_days}</Text>
            </View>

            <View className="mb-3">
              <Text className="font-bold">Tổng số đêm:</Text>
              <Text>{holdDetail?.total_nights}</Text>
            </View>

            {!holdDetail?.is_host_accept ? (
              <View className="mb-3">
                <TouchableOpacity
                  className="bg-green-500 p-3 rounded-lg"
                  onPress={acceptBooking}
                >
                  <Text className="text-white text-center text-lg">
                    Chấp nhận
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="mb-3">
                <TouchableOpacity
                  className="bg-red-500 p-3 rounded-lg"
                  onPress={() => {}}
                >
                  <Text className="text-white text-center text-lg">Hủy</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              className="bg-gray-500 p-3 rounded-lg"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center text-lg">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderHoldItem = ({ item }: { item: HoldType }) => (
    <TouchableOpacity
      className="bg-white shadow-md rounded-xl p-4 mb-4"
      onPress={() => {
        setHoldDetail(item);
        setModalVisible(true);
      }}
    >
      <Image
        source={{ uri: "https://via.placeholder.com/150" }}
        className="w-full h-40 rounded-lg mb-4"
      />

      {/* Tiêu đề và trạng thái */}
      <View className="flex flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-gray-800">
          {item.residence_name}
        </Text>
        <View className="flex flex-row items-center">
          <Ionicons
            name={item.is_host_accept ? "checkmark-circle" : "time-outline"}
            size={20}
            color={item.is_host_accept ? "#38A169" : "#ECC94B"}
          />
          <Text
            className={`ml-1 font-medium ${
              item.is_host_accept ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {item.is_host_accept ? "Đã chấp nhận" : "Chờ duyệt"}
          </Text>
        </View>
      </View>

      {/* Thông tin ngày tháng */}
      <View className="flex flex-row justify-between items-center mb-2">
        <View className="flex flex-row items-center">
          <Ionicons name="calendar-outline" size={18} color="#4A5568" />
          <Text className="ml-1 text-gray-700">
            {moment(item.checkin).format("DD-MM-YYYY")}
          </Text>
        </View>
        <Text className="text-gray-500">đến</Text>
        <View className="flex flex-row items-center">
          <Ionicons name="calendar-outline" size={18} color="#4A5568" />
          <Text className="ml-1 text-gray-700">
            {moment(item.checkout).format("DD-MM-YYYY")}
          </Text>
        </View>
      </View>

      {/* Số đêm và số ngày */}
      <View className="flex flex-row justify-between items-center mb-2">
        <View className="flex flex-row items-center">
          <Ionicons name="moon-outline" size={18} color="#4A5568" />
          <Text className="ml-1 text-gray-700">{item.total_nights} đêm</Text>
        </View>
        <View className="flex flex-row items-center">
          <Ionicons name="sunny-outline" size={18} color="#4A5568" />
          <Text className="ml-1 text-gray-700">{item.total_days} ngày</Text>
        </View>
      </View>

      {/* Mô tả */}
      {item.description ? (
        <View className="mt-2">
          <Text className="text-gray-600">{item.description}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (page < totalPage) {
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

  return (
    <SafeAreaView className="flex-1">
      <Loading loading={loading} />
      <Animatable.View
        className="flex flex-row items-center px-4"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex flex-row items-center">
          <Text className="text-3xl font-bold">Danh sách Hold</Text>
        </View>
      </Animatable.View>

      <FlatList
        data={holds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHoldItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => <EmptyData />}
      />

      <RenderModal />
    </SafeAreaView>
  );
};

export default HoldForHost;
