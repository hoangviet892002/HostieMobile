import { View, Text, ActivityIndicator, FlatList } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { NotificationType } from "@/types";
import { getNotificationApi } from "@/apis/notification";
import { Colors } from "@/constants/Colors";
import { EmptyData, Loading } from "@/components";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import Icon, { Icons } from "@/components/Icons";

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const fetchNotifications = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const res = await getNotificationApi(pageNumber);

      if (res.success) {
        if (pageNumber === 1) {
          setNotifications(res.data.notifications);
          setTotalPage(res.data.total_pages);
          return;
        }
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...res.data.notifications,
        ]);
        setTotalPage(res.data.total_pages);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      if (pageNumber === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      fetchNotifications(page + 1);
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

  useFocusEffect(
    useCallback(() => {
      setPage(1);

      fetchNotifications(1);
    }, [])
  );

  const renderItem = ({ item }: { item: NotificationType }) => {
    return (
      <View className="flex-row justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-sm">
        {/* Icon and Title */}
        <View className="flex-row items-center">
          <View className="mr-3">
            {/* Placeholder for icon */}
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                item.status === 1
                  ? "bg-green-100"
                  : item.status === 2
                  ? "bg-red-100"
                  : "bg-yellow-100"
              }`}
            >
              <View
                className={`${
                  item.is_read ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {item.is_read ? (
                  <Icon
                    type={Icons.Feather}
                    name="check"
                    size={20}
                    color={Colors.primary}
                  />
                ) : (
                  <Icon
                    type={Icons.Feather}
                    name="alert-circle"
                    size={20}
                    color={Colors.primary}
                  />
                )}
              </View>
            </View>
          </View>
          <View>
            <Text className="text-gray-900 font-semibold">
              {item.event_code}
            </Text>
            <Text className="text-gray-500 text-sm">
              {item.entity_details.description}
            </Text>
          </View>
        </View>

        {/* Timestamp */}
        <Text className="text-gray-400 text-xs">
          {moment(item.created_at).fromNow()}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <Loading loading={loading} />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => <EmptyData />}
      />
    </View>
  );
};

export default Notifications;
