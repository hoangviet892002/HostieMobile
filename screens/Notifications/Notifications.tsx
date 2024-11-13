// src/screens/Notifications.tsx
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

  const renderItem = ({ item }: { item: NotificationType }) => {
    const isBooking = item.entity_type_code === "bookings";
    const eventCode = item.event_code as
      | EventBookNotification
      | EventHoldNotification;
    const details = item.entity_details as
      | BookDetailNotification
      | HoldDetailNotification;

    const getTitle = () => {
      if (isBooking) {
        switch (eventCode) {
          case EventBookNotification.Created:
            return t("Booking.Created");
          case EventBookNotification.Updated:
            return t("Booking.Updated");
          case EventBookNotification.Cancelled:
            return t("Booking.Cancelled");
          case EventBookNotification.HostAccepted:
            return t("Booking.HostAccepted");
          case EventBookNotification.HostRejected:
            return t("Booking.HostRejected");
          case EventBookNotification.SellerTransferred:
            return t("Booking.SellerTransferred");
          case EventBookNotification.HostReceived:
            return t("Booking.HostReceived");
          case EventBookNotification.HostDontReceived:
            return t("Booking.HostDontReceived");
          case EventBookNotification.CustomerCheckin:
            return t("Booking.CustomerCheckin");
          case EventBookNotification.CustomerCheckout:
            return t("Booking.CustomerCheckout");
          default:
            return t("Booking.Notification");
        }
      } else {
        switch (eventCode) {
          case EventHoldNotification.Created:
            return t("Hold.Created");
          case EventHoldNotification.HostAccepted:
            return t("Hold.HostAccepted");
          case EventHoldNotification.HostRejected:
            return t("Hold.HostRejected");
          case EventHoldNotification.Cancelled:
            return t("Hold.Cancelled");
          default:
            return t("Hold.Notification");
        }
      }
    };

    const getDescription = () => {
      if (isBooking) {
        const book = details as BookDetailNotification;
        return `${t("Booking.ID")}: ${book.id}\n${t("Booking.Checkin")}: ${
          book.checkin
        }\n${t("Booking.Checkout")}: ${book.checkout}`;
      } else {
        const hold = details as HoldDetailNotification;
        return `${t("Hold.ID")}: ${hold.id}\n${t("Hold.Checkin")}: ${
          hold.checkin
        }\n${t("Hold.Checkout")}: ${hold.checkout}`;
      }
    };

    const getIcon = () => {
      if (isBooking) {
        switch (eventCode) {
          case EventBookNotification.Created:
            return {
              type: Icons.AntDesign,
              name: "calendar",
              color: Colors.primary,
            };
          case EventBookNotification.Cancelled:
            return {
              type: Icons.AntDesign,
              name: "closecircle",
              color: Colors.error,
            };
          case EventBookNotification.HostAccepted:
            return {
              type: Icons.AntDesign,
              name: "checkcircle",
              color: Colors.success,
            };
          case EventBookNotification.HostRejected:
            return {
              type: Icons.AntDesign,
              name: "closecircle",
              color: Colors.error,
            };
          // Add more cases as needed
          default:
            return {
              type: Icons.AntDesign,
              name: "notification",
              color: Colors.gray,
            };
        }
      } else {
        switch (eventCode) {
          case EventHoldNotification.Created:
            return {
              type: Icons.AntDesign,
              name: "book",
              color: Colors.primary,
            };
          case EventHoldNotification.Cancelled:
            return {
              type: Icons.AntDesign,
              name: "closecircle",
              color: Colors.error,
            };
          case EventHoldNotification.HostAccepted:
            return {
              type: Icons.AntDesign,
              name: "checkcircle",
              color: Colors.success,
            };
          case EventHoldNotification.HostRejected:
            return {
              type: Icons.AntDesign,
              name: "closecircle",
              color: Colors.error,
            };
          // Add more cases as needed
          default:
            return {
              type: Icons.AntDesign,
              name: "notification",
              color: Colors.gray,
            };
        }
      }
    };

    return (
      <TouchableOpacity className="flex-row items-start p-4 border-b border-gray-200 bg-white">
        <Icon
          type={getIcon().type}
          name={getIcon().name}
          size={24}
          color={getIcon().color}
        />
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {getTitle()}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">{getDescription()}</Text>
          <Text className="text-xs text-gray-400 mt-2">
            {moment(item.created_at).fromNow()}
          </Text>
          {!item.is_read && (
            <View className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full" />
          )}
        </View>
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
