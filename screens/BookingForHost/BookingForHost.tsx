import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { BookingType } from "@/types";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, Loading } from "@/components";
import * as Animatable from "react-native-animatable";
import moment from "moment";
import { getBooksForHostApi } from "@/apis/booking";
const BookingForHost = () => {
  const [books, setBooks] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchBook = async () => {
    setLoading(true);
    const response = await getBooksForHostApi(page);
    if (response.success) {
      setBooks((prevHolds) => [...prevHolds, ...response.data.result]);

      setTotalPage(response.data.pagination.total_pages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBook();
  }, [page]);
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

      <ScrollView className="p-4 mb-4">
        {books.map((book, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white shadow-md rounded-lg p-4 mb-4"
          >
            <View className="flex flex-row justify-between">
              <View>
                <Text className="text-lg font-bold">
                  {moment(book.checkin).format("DD-MM-YYYY")}
                </Text>
                <Text className="text-gray-600">
                  {moment(book.checkout).format("DD-MM-YYYY")}
                </Text>
              </View>
              <View>
                <Text className="text-lg font-semibold">
                  {book.total_day} days
                </Text>
                <Text className="text-gray-600">{book.total_night} nights</Text>
              </View>
              <View>
                <Text
                  className={`font-semibold ${
                    book.is_host_accept ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {book.is_host_accept ? "Accepted" : "Pending"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {/* Load more button */}
        <View className="flex justify-center items-center mb-5">
          <TouchableOpacity
            className="bg-primary p-2 rounded-lg"
            style={{ backgroundColor: Colors.primary }}
            onPress={() => {
              if (page < totalPage) {
                setPage((prevPage) => prevPage + 1);
              }
            }}
          >
            <Text className="text-white">Load more</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingForHost;
