import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { BackButton } from "@/components";
import { useTranslation } from "react-i18next";
import { RequestType } from "@/types/RequestType";
import {
  approveRequestApi,
  getHousekeeperRequestsApi,
  rejectRequestApi,
} from "@/apis/housekeeper";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const HouseKeeperRequest = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [Requests, setRequests] = useState<RequestType[]>([]);
  const fetchRequests = async (pageNumber: number, isRefresh: boolean) => {
    setLoading(true);
    const res = await getHousekeeperRequestsApi(pageNumber);
    if (res.code === 1000) {
      if (isRefresh) {
        setRequests(res.result);
      } else {
        setRequests([...Requests, ...res.result]);
      }

      setTotalPage(res.totalPages);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchRequests(page, false);
  }, []);
  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      fetchRequests(page + 1, false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };
  const handleRejectAccept = async (
    isAccept: boolean,
    houseKeeperId: number,
    residenceId: number
  ) => {
    if (isAccept) {
      const res = await approveRequestApi({ houseKeeperId, residenceId });
      if (res.code === 1000) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.message,
        });
      }
      // Accept
    } else {
      const res = await rejectRequestApi({ houseKeeperId, residenceId });
      if (res.code === 1000) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.message,
        });
      }
    }
    // refresh
    fetchRequests(0, true);
  };

  const RequestItem = ({ request }: { request: RequestType }) => {
    const getStatusInfo = (status: number) => {
      switch (status) {
        case 0:
          return {
            color: "text-red-500",
            icon: "times-circle",
            label: "Rejected",
          };
        case 1:
          return {
            color: "text-yellow-500",
            icon: "clock-o",
            label: "Pending",
          };
        case 2:
          return {
            color: "text-green-500",
            icon: "check-circle",
            label: "Approved",
          };
        default:
          return {
            color: "text-gray-500",
            icon: "question-circle",
            label: "Unknown",
          };
      }
    };

    const statusInfo = getStatusInfo(request.status);
    const renderRightActions = () => {
      return (
        <View className="flex-row">
          <TouchableOpacity
            className="bg-green-500 justify-center items-center w-24"
            onPress={() => {
              handleRejectAccept(
                true,
                request.houseKeeperId,
                request.residenceId
              );
            }}
          >
            <FontAwesome name="check" size={24} color="#fff" />
            <Text className="text-white text-sm mt-1">Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 justify-center items-center w-24"
            onPress={() => {
              handleRejectAccept(
                false,
                request.houseKeeperId,
                request.residenceId
              );
            }}
          >
            <FontAwesome name="times" size={24} color="#fff" />
            <Text className="text-white text-sm mt-1">Reject</Text>
          </TouchableOpacity>
        </View>
      );
    };
    const canSwipe = request.status === 1;
    return (
      <Swipeable
        renderRightActions={canSwipe ? renderRightActions : undefined}
        overshootRight={false}
      >
        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200"
          onPress={() => {}}
          accessibilityRole="button"
        >
          <View className="flex-row items-center">
            <FontAwesome
              name="user-circle"
              size={40}
              color="#6c5ce7"
              className="mr-4"
            />
            <View>
              <Text className="text-lg font-bold text-gray-800">
                {request.housekeeperEmail}
              </Text>
              <Text className="text-sm text-gray-500">
                {request.housekeeperName}
              </Text>
              <Text className="text-sm text-gray-400">
                {request.residenceName}
              </Text>
            </View>
          </View>

          {/* Trạng Thái Yêu Cầu */}
          <View className="flex-row items-center">
            <Text className={`text-sm font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animatable.View
        className="flex flex-row items-center px-4"
        delay={120}
        animation="slideInDown"
      >
        <BackButton navigateTo="dashboard" />
        <View className="flex flex-row items-center ">
          <View className="flex ">
            <Text className="text-3xl font-bold ">{t(" Request")}</Text>
          </View>
        </View>
      </Animatable.View>
      <FlatList
        data={Requests}
        renderItem={({ item }) => <RequestItem request={item} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshing={isRefreshing}
        onRefresh={() => {
          fetchRequests(0, true);
        }}
      />
    </SafeAreaView>
  );
};

export default HouseKeeperRequest;
