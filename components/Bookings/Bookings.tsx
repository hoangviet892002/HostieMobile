import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "../DateTimePicker";
import { parseDate } from "@/utils/parseDate";
import * as Animatable from "react-native-animatable";
import Booking from "./Booking";
import { BookingType } from "@/types";
import useToast from "@/hooks/useToast";
import { getBookForHouseKeeperApi } from "@/apis/booking";

const Bookings = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getBookForHouseKeeperApi(page);
      if (response.success && response.data.result) {
        if (page === 1) {
          setBookings(response.data.result);
        } else {
          setBookings((prevBookings) => [
            ...prevBookings,
            ...response.data.result,
          ]);
        }
        setTotalPage(response.data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Animatable.View delay={120} animation={"fadeInDown"}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Booking {...item} />}
      />
    </Animatable.View>
  );
};

export default Bookings;
