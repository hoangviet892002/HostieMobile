// src/screens/Notifications.tsx
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { NotificationType } from "@/types";
import { getNotificationApi } from "@/apis/notification";
import { Colors } from "@/constants/Colors";
import { EmptyData, Loading } from "@/components";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import Icon, { Icons } from "@/components/Icons";
import {
  EventBookNotification,
  EventHoldNotification,
} from "@/constants/enums/eventNotification";
import {
  BookDetailNotification,
  HoldDetailNotification,
} from "@/types/NotificationType";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import { useTranslation } from "react-i18next";
import { parseLogsEvent } from "@/utils/parseLogsEvent";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/slices/authSlice";

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { t } = useTranslation();

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

  const userId = useSelector(selectUserId);

  const renderItem = ({ item }: { item: NotificationType }) => {
    const isBooking = item.entity_type_code === "bookings";
    const eventCode = item.event_code as
      | EventBookNotification
      | EventHoldNotification;
    const details = item.entity_details as
      | BookDetailNotification
      | HoldDetailNotification;

    const {
      checkin,
      checkout,
      seller_name,
      seller_avatar,
      host_name,
      host_avatar,
      residence_name,
    } = details;

    const getTitle = () => {
      return parseLogsEvent(eventCode);
    };
    const name = () => {
      if (parseInt(userId) === details.seller_id) {
        return host_name;
      } else {
        return seller_name;
      }
    };

    const avatar = () => {
      if (parseInt(userId) === details.seller_id) {
        return host_avatar;
      } else {
        return seller_avatar;
      }
    };
    const getIconBackgroundColor = () => {
      return Colors.white;
    };

    const getIcon = () => {
      switch (eventCode) {
        case EventBookNotification.Created:
          return {
            type: Icons.Feather,

            name: "bookmark",
            color: Colors.primary,
          };
        case EventBookNotification.Updated:
          return {
            type: Icons.Feather,
            name: "edit",
            color: Colors.warning,
          };
        case EventBookNotification.Cancelled:
          return {
            type: Icons.Feather,
            name: "x-circle",
            color: Colors.error,
          };
        case EventBookNotification.HostAccepted:
          return {
            type: Icons.Feather,
            name: "check-circle",
            color: Colors.success,
          };
        case EventBookNotification.HostRejected:
          return {
            type: Icons.Feather,
            name: "x-circle",
            color: Colors.error,
          };
        case EventBookNotification.SellerTransferred:
          return {
            type: Icons.Feather,
            name: "dollar-sign",
            color: Colors.success,
          };
        case EventBookNotification.HostReceived:
          return {
            type: Icons.Feather,
            name: "check-circle",
            color: Colors.success,
          };
        case EventBookNotification.HostDontReceived:
          return {
            type: Icons.Feather,
            name: "x-circle",
            color: Colors.error,
          };
        case EventBookNotification.CustomerCheckin:
          return {
            type: Icons.Feather,
            name: "log-in",
            color: Colors.primary,
          };
        case EventBookNotification.CustomerCheckout:
          return {
            type: Icons.Feather,
            name: "log-out",
            color: Colors.primary,
          };
        case EventHoldNotification.Created:
          return {
            type: Icons.Feather,
            name: "bookmark",
            color: Colors.primary,
          };
        case EventHoldNotification.HostAccepted:
          return {
            type: Icons.Feather,
            name: "check-circle",
            color: Colors.success,
          };
        case EventHoldNotification.HostRejected:
          return {
            type: Icons.Feather,
            name: "x-circle",
            color: Colors.error,
          };
        case EventHoldNotification.Cancelled:
          return {
            type: Icons.Feather,
            name: "x-circle",
            color: Colors.error,
          };
        default:
          return {
            type: Icons.Feather,
            name: "bell",
            color: Colors.gray,
          };
      }
    };
    const isBoooking = item.entity_type_code === "bookings";
    const isHold = item.entity_type_code === "hold";
    const handleNavigate = () => {
      if (isBoooking) {
        router.push(`/BookingDetail?id=${details.id}`);
      }
      if (isHold) {
        if (
          eventCode === EventHoldNotification.HostAccepted ||
          eventCode === EventHoldNotification.HostRejected
        ) {
          router.push(`/dashboard/tab5`);
          return;
        }
        router.push(`/HoldDetail?id=${details.id}`);
      }
    };

    return (
      <TouchableOpacity
        className="flex-row items-center p-4 border-b border-gray-200"
        style={{
          backgroundColor: item.is_read ? "#fff" : "#e6f7ff",
        }}
        onPress={handleNavigate}
      >
        <View>
          <Image
            source={{ uri: avatar() }}
            className="w-20 h-20 rounded-full"
          />
          {/* absolute icon */}
          <View
            className="absolute bottom-0 right-0 rounded-full p-2"
            style={{
              backgroundColor: getIconBackgroundColor(),

              borderColor: getIcon().color,
              borderWidth: 1,
            }}
          >
            <Icon {...getIcon()} />
          </View>
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-base font-semibold">
            {name()}: {t(getTitle())}
          </Text>
          <Text className="text-sm text-gray-500">
            {isBooking
              ? `${parseDateDDMMYYYY(checkin)} - ${parseDateDDMMYYYY(checkout)}`
              : `${parseDateDDMMYYYY(checkin)} - ${parseDateDDMMYYYY(
                  checkout
                )}`}
          </Text>
          <Text className="text-sm text-gray-500">{`${residence_name}`}</Text>
        </View>

        <Text className="text-xs text-gray-500">
          {moment(item.created_at).fromNow()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
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
