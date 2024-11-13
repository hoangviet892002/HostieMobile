import { getCalendarApi } from "@/apis/residences";
import { BackButton, Loading, MonthNavigator } from "@/components";
import { Calendar } from "@/types";
import { parsePrice } from "@/utils/parsePrice";
import { RouteProp, useRoute } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DayInfo from "./DayInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/stores";
import { Colors } from "@/constants/Colors";
import { getStatusStyle } from "@/constants/getStatusStyle";
import { parseStatusBooking } from "@/utils/parseStatusBooking";
import Icon, { Icons } from "@/components/Icons";
import { parseStatusCalendar } from "@/utils/parseStatusCalendar";
import { getCalendarStyle } from "@/constants/getCalendarStyle";
type RouteParams = {
  params: {
    ids: string;
  };
};
const CalendarsBooking = () => {
  const [element, setElement] = useState<Calendar[]>([]);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const id = useSelector((state: RootState) => state.auth.userId);

  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { ids } = route.params;

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [isEmty, setIsEmty] = useState<boolean>(true);
  const date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Calculate how many days are in the month
  const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

  // Find out the first day of the month (0 is Sunday, 1 is Monday, etc.)
  const firstDayIndex = moment(`${year}-${month}-01`, "YYYY-MM-DD").day();

  // Create the grid of dates, including empty days for padding
  const calendarDays = Array(firstDayIndex).fill(null).concat(element);

  const [name, setName] = useState<string>("");

  const [isHost, setIsHost] = useState<boolean>(false);

  const getCalendar = async () => {
    setIsLoad(true);
    // for mat month MM
    const monthFormat = `${month < 10 ? "0" : ""}${month}`;
    const time = `${year}-${monthFormat}`;
    const response = await getCalendarApi(ids, time);
    setIsLoad(false);
    if (response.data.calendars) {
      setElement(response.data.calendars[0].calendar);
      setName(response.data.calendars[0].name);

      if (response.data.calendars[0].host_id === id) {
        setIsHost(true);
      }
      setIsEmty(false);
    } else {
      setIsEmty(true);
    }
  };
  useEffect(() => {
    getCalendar();
  }, [year, month, ids]);

  const [selectedDayForm, setSelectedDayForm] = useState<{
    checkin: string | null;
    checkout: string | null;
    residence_id: number | null;
  }>({
    checkin: null,
    checkout: null,
    residence_id: parseInt(ids),
  });

  const [selectedDay, setSelectedDay] = useState<Calendar | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = (item: Calendar) => {
    setIsLoad(true);
    setSelectedDay(item);
    setModalVisible(true);
    setIsLoad(false);
  };
  const handleSelectDay = (item: Calendar) => {
    const { checkin, checkout } = selectedDayForm;
    const selectedDate = moment(item.date);

    if (checkin && checkout) {
      const checkinDate = moment(checkin);
      const checkoutDate = moment(checkout);

      const diffToCheckin = Math.abs(selectedDate.diff(checkinDate, "days"));
      const diffToCheckout = Math.abs(selectedDate.diff(checkoutDate, "days"));

      if (diffToCheckin > diffToCheckout) {
        // Cập nhật checkin nếu item.date xa hơn với checkin
        if (selectedDate.isAfter(checkoutDate)) {
          // Nếu ngày mới sau checkout, hoán đổi checkin và checkout
          setSelectedDayForm({
            ...selectedDayForm,
            checkin: checkout,
            checkout: item.date,
          });
        } else {
          setSelectedDayForm({
            ...selectedDayForm,
            checkin: item.date,
          });
        }
      } else {
        if (selectedDate.isBefore(checkinDate)) {
          setSelectedDayForm({
            ...selectedDayForm,
            checkin: item.date,
            checkout: checkin,
          });
        } else {
          setSelectedDayForm({
            ...selectedDayForm,
            checkout: item.date,
          });
        }
      }
    } else if (checkin && !checkout) {
      if (selectedDate.isBefore(checkin)) {
        setSelectedDayForm({
          ...selectedDayForm,
          checkin: item.date,
        });
      } else {
        setSelectedDayForm({
          ...selectedDayForm,
          checkout: item.date,
        });
        setModalVisible(true);
      }
    } else {
      setSelectedDayForm({
        ...selectedDayForm,
        checkin: item.date,
        checkout: null,
      });
    }
    setModalVisible(false);
  };

  const Status = (item: Calendar) => {
    const status = parseStatusCalendar(item.background_color || "");
    const { color, icon, textColor } = getCalendarStyle(status);

    return (
      <View
        className={`flex-row items-center p-2 rounded shadow-md mb-2`}
        accessibilityLabel={`Status: ${status}`}
      >
        <Icon name={icon} size={20} color={color} type={Icons.Feather} />
        <Text className={`text-base font-medium`} style={{ color: color }}>
          {status}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Loading loading={isLoad} />
      <SafeAreaView>
        <ScrollView>
          <View className="flex flex-row items-center ">
            <BackButton />
            <View className="flex ">
              <Text className="text-3xl font-bold ">{name}</Text>
            </View>
          </View>
          {/* render month and year */}
          <MonthNavigator
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
          />

          {/* render day of week */}
          <View className="flex flex-row justify-between items-center">
            {date.map((item, index) => (
              <View
                key={index}
                className="items-center justify-center flex h-[50px] border border-gray-300"
                style={{
                  width: `${100 / 7}%`,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  paddingVertical: 5,
                  backgroundColor: "#f9fafb",
                }}
              >
                <Text className="text-gray-800 font-medium text-sm">
                  {item}
                </Text>
              </View>
            ))}
          </View>
          {!isEmty ? (
            <View className="flex flex-row flex-wrap">
              {calendarDays.map((item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      key={index}
                      className="items-center justify-center flex h-[90px] border border-gray-300"
                      style={{
                        width: `${100 / 7}%`,
                        borderColor: "#d1d5db",
                        borderWidth: 1,
                        backgroundColor: item?.background_color || "#f9fafb",
                        paddingVertical: 10,
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        item?.date && openModal(item);
                      }}
                    >
                      <View
                        className={`${
                          item?.date ? "bg-blue-400 rounded-full p-2" : ""
                        } flex items-center justify-center`}
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      >
                        <Text className="text-white font-bold">
                          {item?.date ? moment(item?.date).format("DD") : ""}
                        </Text>
                      </View>

                      {/* render price */}
                      <Text
                        className="text-gray-700 mt-2 font-semibold"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: item?.price?.length > 10 ? 12 : 14,
                          width: "90%",
                          textAlign: "center",
                        }}
                      >
                        {item?.price ? `${parsePrice(item?.price)} VND` : ""}
                      </Text>
                      <View
                        style={{
                          width:
                            item?.middle_point ||
                            item?.start_point ||
                            item?.end_point
                              ? "100%"
                              : 0,
                          height: 5,
                          position: "relative",
                        }}
                      >
                        {/* Colored bar depending on start, middle, or end point */}
                        <View
                          style={{
                            width: item?.middle_point ? "100%" : "50%",
                            height: "100%",
                            backgroundColor: Colors.primary,
                            position: "absolute",
                            left: item?.start_point ? "50%" : 0,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </>
                );
              })}
            </View>
          ) : (
            <Text className="text-center text-2xl font-bold">Empty</Text>
          )}
          {/* render calendar */}
          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
          >
            <View
              className="flex-1 justify-center items-center  bg-opacity-50"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View className="w-11/12  bg-white rounded-2xl p-5 shadow-lg">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-5">
                  <Text className="text-2xl font-bold text-gray-800">
                    {selectedDay?.date
                      ? moment(selectedDay?.date).format("DD/MM/YYYY")
                      : ""}
                  </Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Text className="text-lg font-bold text-red-500">
                      Close
                    </Text>
                  </Pressable>
                </View>

                <ScrollView className="mt-2">
                  {/* Thông tin giá */}
                  <View className="bg-gray-100 p-4 rounded-lg mb-5 items-center">
                    <Text className="text-2xl font-bold text-green-600">
                      {selectedDay?.price
                        ? `${parsePrice(selectedDay?.price)} VND`
                        : ""}
                    </Text>
                  </View>

                  {/* Status */}
                  <Text className="text-lg font-bold text-gray-800 mb-3">
                    Status:
                  </Text>
                  <Status {...(selectedDay as Calendar)} />

                  {/* Avatar */}
                  {selectedDay?.avatar_seller && (
                    <View className="flex-row items-center mt-5">
                      <Image
                        source={{ uri: selectedDay?.avatar_seller }}
                        className="w-15 h-15 rounded-full mr-3"
                        accessibilityLabel="Seller Avatar"
                      />
                      <Text className="text-lg font-bold text-gray-800">
                        {selectedDay?.seller_username}
                      </Text>
                    </View>
                  )}

                  {/* Button with disabled state */}
                  <View className="flex items-center justify-center mt-5">
                    <Pressable
                      className={`w-full flex items-center justify-center rounded-3xl h-14 my-2 ${
                        selectedDay?.is_booked ? "bg-gray-500" : "bg-blue-600"
                      } shadow-md`}
                      disabled={selectedDay?.is_booked}
                      onPress={() => handleSelectDay(selectedDay as Calendar)}
                      accessibilityLabel={
                        selectedDay?.is_booked ? "Booked" : "Book Now"
                      }
                    >
                      <Text className="text-white text-lg font-semibold">
                        Book
                      </Text>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
          {/* select Day */}
          <DayInfo
            RefreshCalendar={getCalendar}
            selectedDayForm={selectedDayForm}
            name={name}
            setSelectedDayForm={setSelectedDayForm}
            isHost={isHost}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CalendarsBooking;
