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
  ScrollView,
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
        <View
          className="justify-center items-center bg-opacity-50 flex-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View className="bg-white p-6 rounded-xl w-11/12 shadow-lg">
            <Text className="text-2xl font-bold mb-6 text-center text-gray-800">
              Chi tiết Booking
            </Text>

            {/* Image */}
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              className="w-full h-40 rounded-lg mb-4"
            />

            {/* Title and Status */}
            <View className="flex flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold text-gray-800">
                {holdDetail?.residence_name}
              </Text>
              <View className="flex flex-row items-center">
                <Ionicons
                  name={
                    holdDetail?.is_host_accept
                      ? "checkmark-circle"
                      : "time-outline"
                  }
                  size={20}
                  color={holdDetail?.is_host_accept ? "#38A169" : "#ECC94B"}
                />
                <Text
                  className={`ml-1 font-medium ${
                    holdDetail?.is_host_accept
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {holdDetail?.is_host_accept ? "Đã chấp nhận" : "Chờ duyệt"}
                </Text>
              </View>
            </View>

            {/* Date Information */}
            <View className="flex flex-row justify-between items-center mb-2">
              <View className="flex flex-row items-center">
                <Ionicons name="calendar-outline" size={18} color="#4A5568" />
                <Text className="ml-1 text-gray-700">
                  {moment(holdDetail?.checkin).format("DD-MM-YYYY")} -{" "}
                  {moment(holdDetail?.checkout).format("DD-MM-YYYY")}
                </Text>
              </View>
              <View className="flex flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#4A5568" />
                <Text className="ml-1 text-gray-700">
                  {moment(holdDetail?.created_at).fromNow()}
                </Text>
              </View>
            </View>

            {/* Number of nights and days */}
            <View className="flex flex-row justify-between items-center mb-2">
              <View className="flex flex-row items-center">
                <Ionicons name="moon-outline" size={18} color="#4A5568" />
                <Text className="ml-1 text-gray-700">
                  {holdDetail?.total_nights} đêm
                </Text>
              </View>
              <View className="flex flex-row items-center">
                <Ionicons name="sunny-outline" size={18} color="#4A5568" />
                <Text className="ml-1 text-gray-700">
                  {holdDetail?.total_days} ngày
                </Text>
              </View>
            </View>
            {/* Seller Information */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Người bán:
              </Text>
              <View className="flex flex-row items-center mt-2">
                <Image
                  source={{
                    uri:
                      holdDetail?.seller_avatar ||
                      "https://via.placeholder.com/150",
                  }}
                  className="w-12 h-12 rounded-full"
                  accessibilityLabel="Seller Avatar"
                />
                <Text className="ml-3 text-gray-700 text-lg">
                  {holdDetail?.seller_name}
                </Text>
              </View>
            </View>

            {/* Description */}
            {holdDetail?.description && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                  Mô tả:
                </Text>
                <Text className="text-gray-700 mt-2">
                  {holdDetail?.description}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="mb-4">
              {!holdDetail?.is_host_accept ? (
                <TouchableOpacity
                  className="bg-green-600 p-3 rounded-lg mb-3"
                  onPress={acceptBooking}
                  activeOpacity={0.8}
                  accessibilityLabel="Chấp nhận Booking"
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Chấp nhận
                  </Text>
                </TouchableOpacity>
              ) : (
                // <TouchableOpacity
                //   className="bg-red-600 p-3 rounded-lg mb-3"
                //   onPress={() => {}}
                //   activeOpacity={0.8}
                //   accessibilityLabel="Hủy Booking"
                // >
                //   <Text className="text-white text-center text-lg font-semibold">
                //     Hủy
                //   </Text>
                // </TouchableOpacity>
                <></>
              )}

              <TouchableOpacity
                className="bg-gray-600 p-3 rounded-lg"
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
                accessibilityLabel="Đóng Modal"
              >
                <Text className="text-white text-center text-lg font-semibold">
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
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
            {moment(item.checkin).format("DD-MM-YYYY")} -{" "}
            {moment(item.checkout).format("DD-MM-YYYY")}
          </Text>
        </View>
        <View className="flex flex-row items-center">
          <Ionicons name="time-outline" size={18} color="#4A5568" />
          <Text className="ml-1 text-gray-700">
            {moment(item.created_at).fromNow()}
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

      {/* name and image person seller */}
      <View className="flex flex-row items-center mb-2">
        <Image
          source={{
            uri: item.seller_avatar || "https://via.placeholder.com/150",
          }}
          className="w-10 h-10 rounded-full"
        />
        <Text className="ml-2 font-medium text-gray-700">
          {item.seller_name}
        </Text>
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
