import { acceptHoldApi, getHoldsForHostApi } from "@/apis/booking";
import { BackButton, Loading } from "@/components";
import { Colors } from "@/constants/Colors";
import { HoldType } from "@/types";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Modal } from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
const HoldForHost = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [holds, setHolds] = useState<HoldType[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [holdDetail, setHoldDetail] = useState<HoldType | null>(null);
  const fetchHold = async () => {
    setLoading(true);
    const response = await getHoldsForHostApi(page);
    if (response.success) {
      setHolds((prevHolds) => [...prevHolds, ...response.data.result]);

      setTotalPage(response.data.pagination.total_pages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHold();
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
            hold.is_host_accept = true;
          }
          return hold;
        })
      );
    }
    setLoading(false);
    setModalVisible(false);

    // Accept booking
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
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 15,
              width: "85%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              Booking Details
            </Text>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Check-in:</Text>
              <Text>{moment(holdDetail?.checkin).format("DD-MM-YYYY")}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Check-out:</Text>
              <Text>{moment(holdDetail?.checkout).format("DD-MM-YYYY")}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Total Days:</Text>
              <Text>{holdDetail?.total_days}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Total Nights:</Text>
              <Text>{holdDetail?.total_nights}</Text>
            </View>

            {!holdDetail?.is_host_accept ? (
              <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 12,
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    acceptBooking();
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                padding: 12,
                borderRadius: 8,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text
                style={{ color: "white", textAlign: "center", fontSize: 16 }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
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

      <ScrollView className="p-4 mb-4">
        {holds.map((hold, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white shadow-md rounded-lg p-4 mb-4"
            onPress={() => {
              setHoldDetail(hold);
              setModalVisible(true);
            }}
          >
            <View className="flex flex-row justify-between">
              <View>
                <Text className="text-lg font-bold">
                  {moment(hold.checkin).format("DD-MM-YYYY")}
                </Text>
                <Text className="text-gray-600">
                  {moment(hold.checkout).format("DD-MM-YYYY")}
                </Text>
              </View>
              <View>
                <Text className="text-lg font-semibold">
                  {hold.total_days} days
                </Text>
                <Text className="text-gray-600">
                  {hold.total_nights} nights
                </Text>
              </View>
              <View>
                <Text
                  className={`font-semibold ${
                    hold.is_host_accept ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {hold.is_host_accept ? "Accepted" : "Pending"}
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
      <RenderModal />
    </SafeAreaView>
  );
};

export default HoldForHost;
