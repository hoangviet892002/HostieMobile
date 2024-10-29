import {
  acceptBookingApi,
  getDetailBookingApi,
  hostReceiveApi,
  sellerCancelApi,
  sellerTransferApi,
} from "@/apis/booking";
import { BackButton, EmptyData, Loading } from "@/components";
import { Roles } from "@/constants/enums/roles";
import {
  ActionStatusBooking,
  StatusBooking,
} from "@/constants/enums/statusBookingEnums";
import { getStatusStyle } from "@/constants/getStatusStyle";
import { selectRole } from "@/redux/slices/authSlice";
import { BookingType, DetailBookingType } from "@/types";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import { parseStatusBooking } from "@/utils/parseStatusBooking";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

interface Data {
  booking: BookingType;
  details: DetailBookingType[];
}
type RouteParams = {
  params: {
    id: string;
  };
};
const BookingDetail = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>({} as Data);
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id } = route.params;
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const role = useSelector(selectRole);
  const [permission, setPermission] = useState<string[]>([]);
  const updatePermission = () => {
    let newPermissions: string[] = [];

    if (role === Roles.ROLE_HOST) {
      const status = parseStatusBooking(data.booking);

      if (status === StatusBooking.WAIT_ACCEPT) {
        newPermissions = [
          ActionStatusBooking.ACCEPT,
          ActionStatusBooking.REJECT,
        ];
      }
      if (status === StatusBooking.WAIT_RECEIVE) {
        newPermissions = [
          ...newPermissions,
          ActionStatusBooking.RECEIVE,
          ActionStatusBooking.NOT_RECEIVE,
        ];
      }
    } else if (role === Roles.ROLE_SELLER) {
      const status = parseStatusBooking(data.booking);
      if (status !== StatusBooking.CANCEL && status !== StatusBooking.REJECT) {
        newPermissions.push(ActionStatusBooking.CANCEL);
      }
      if (status === StatusBooking.WAIT_TRANSFER) {
        newPermissions.push(ActionStatusBooking.TRANSFER);
      }
    }

    setPermission(newPermissions);
  };
  useEffect(() => {
    if (data.booking) {
      const { icon, color, textColor } = getStatusStyle(
        parseStatusBooking(data.booking)
      );
      setIcon(icon);
      setColor(color);
      setTextColor(textColor);
      updatePermission();
    }
  }, [data.booking]);
  const fetchData = async () => {
    const response = await getDetailBookingApi(id);

    if (response.success && response.data) {
      setData(response.data);
    }
  };
  const action = [
    {
      title: ActionStatusBooking.ACCEPT,
      onPress: () => {
        const dataSolve = {
          id: id,
          accept: true,
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
        };

        console.log(dataSolve);
        const callApi = async () => {
          const response = await acceptBookingApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: response.msg,
            });
          }
        };
        callApi();
      },
      color: "bg-green-500",
    },
    {
      title: ActionStatusBooking.REJECT,
      onPress: () => {
        const dataSolve = {
          id: id,
          accept: false,
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
        };
        const callApi = async () => {
          const response = await acceptBookingApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: response.msg,
            });
          }
        };
        callApi();
      },
      color: "bg-red-500",
    },
    {
      title: ActionStatusBooking.TRANSFER,
      onPress: () => {
        const dataSolve = {
          id: id,
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
        };
        console.log(dataSolve);
        const callApi = async () => {
          const response = await sellerTransferApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: response.msg,
            });
          }
        };
        callApi();
      },
      color: "bg-yellow-500",
    },
    {
      title: ActionStatusBooking.RECEIVE,
      onPress: () => {
        const dataSolve = {
          id: id,
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
          is_received: true,
        };
        console.log(dataSolve);
        const callApi = async () => {
          const response = await hostReceiveApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: response.msg,
            });
          }
        };
        callApi();
      },
      color: "bg-blue-500",
    },
    {
      title: ActionStatusBooking.NOT_RECEIVE,
      onPress: () => {
        const dataSolve = {
          id: id,
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
          is_received: false,
        };
        console.log(dataSolve);
        const callApi = async () => {
          const response = await hostReceiveApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: response.msg,
            });
          }
        };
        callApi();
      },
      color: "bg-red-500",
    },
    {
      title: ActionStatusBooking.CANCEL,
      onPress: () => {
        const dataSolve = {
          id: id,
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
        };
        console.log(dataSolve);
        const callApi = async () => {
          const response = await sellerCancelApi(dataSolve);
          if (response.success) {
            console.log(response);
            fetchData();
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: response.msg,
            });
          }
        };
        callApi();
      },
      color: "bg-red-500",
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading loading={loading} />
      <Animatable.View
        className="flex flex-row items-center px-4"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex flex-row items-center ">
          <View className="flex ">
            <Text className="text-3xl font-bold ">Booking Detail</Text>
          </View>
        </View>
      </Animatable.View>
      {data.booking ? (
        <View className="bg-white p-5 mb-5 mx-4 rounded-2xl shadow-lg">
          {/* Hình ảnh đại diện */}
          <Image
            source={{ uri: "https://picsum.photos/200/300" }}
            className="w-full h-40 rounded-xl mb-4"
          />

          {/* Tiêu đề và trạng thái */}
          <View className="flex flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-semibold text-gray-800">
              {data.booking.residence_name}
            </Text>
            <View className="flex flex-row items-center">
              <Ionicons name={icon} size={24} color={color} />
              <Text className={`ml-2 font-medium ${textColor}`}>
                {parseStatusBooking(data.booking)}
              </Text>
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={20} color="#4A5568" />
              <Text className="ml-2 text-gray-700">
                <Text className="font-medium">Check-in:</Text>{" "}
                {moment(data.booking.checkin).format("DD-MM-YYYY")}
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={20} color="#4A5568" />
              <Text className="ml-2 text-gray-700">
                <Text className="font-medium">Check-out:</Text>{" "}
                {moment(data.booking.checkout).format("DD-MM-YYYY")}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Ionicons name="sunny-outline" size={20} color="#4A5568" />
              <Text className="ml-2 text-gray-700">
                <Text className="font-medium">Số ngày:</Text>{" "}
                {data.booking.total_days}
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="moon-outline" size={20} color="#4A5568" />
              <Text className="ml-2 text-gray-700">
                <Text className="font-medium">Số đêm:</Text>{" "}
                {data.booking.total_nights}
              </Text>
            </View>
          </View>

          {/* Mô tả */}
          {data.booking.description ? (
            <View className="mb-4">
              <Text className="text-gray-600">{data.booking.description}</Text>
            </View>
          ) : null}

          {/* Action button flow permistion */}
          <View className="flex flex-row justify-between items-center space-x-4 px-4 py-6">
            {permission.map((item) => {
              const actionItem = action.find((action) => action.title === item);
              return (
                <TouchableOpacity
                  key={item}
                  onPress={actionItem?.onPress}
                  className={`flex  items-center justify-center p-3 rounded-lg ${actionItem?.color} `}
                >
                  <Text className=" text-white font-semibold text-sm">
                    {actionItem?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <EmptyData />
      )}
    </SafeAreaView>
  );
};

export default BookingDetail;
