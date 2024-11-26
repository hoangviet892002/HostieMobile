import { bookingApi, getHoldApi, getPrice } from "@/apis/booking";
import { getCusomtersApi, postCustomer } from "@/apis/customer";
import { BackButton, EmptyData, Loading } from "@/components";
import { Colors } from "@/constants/Colors";
import { getStatusHoldStyle } from "@/constants/getStatusHoldStyle";
import useToast from "@/hooks/useToast";
import { Customer, HoldType } from "@/types";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import { parseStatusHold } from "@/utils/parseStatusHold";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

const Hold = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [holds, setHolds] = useState<HoldType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [hold, setHold] = useState<HoldType | null>(null);

  const { t } = useTranslation();
  const [price, setPrice] = useState(0);
  const fetchPrice = async () => {
    const data = {
      residence_ids: [hold?.residence_id],
      checkin: parseDateDDMMYYYY(hold?.checkin),
      checkout: parseDateDDMMYYYY(hold?.checkout),
    };

    const response = await getPrice(data);
    if (response.success) {
      setPrice(response.data[0].total_price);
    }
  };
  useEffect(() => {
    if (hold) {
      fetchPrice();
    }
  }, [hold]);
  const fetchHold = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const response = await getHoldApi(pageNumber);
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

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
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

  const RenderModal = () => {
    const [guest_phone, setPhone] = useState("");
    const [guest_name, setName] = useState("");
    const [guest_id, setId] = useState("");
    const [guest_count, setCount] = useState(1);
    const [note, setNote] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    useEffect(() => {
      setLoading(true);
      const fetchCustomers = async () => {
        const response = await getCusomtersApi();

        if (response.success) {
          setCustomers(response.data.data);
        }
      };
      fetchCustomers();
      setLoading(false);
    }, []);
    useEffect(() => {
      const selectedCustomer = customers.find(
        (c) => c.id === selectedCustomerId
      );
      if (selectedCustomer) {
        setName(selectedCustomer.name);
        setPhone(selectedCustomer.phone);
        setId(selectedCustomer.id);
      } else {
        setName("");
        setPhone("");
        setId("");
      }
    }, [selectedCustomerId]);
    const renderCustomerItem = ({
      item,
      setSelectedCustomerId,
      setDropdownVisible,
    }) => (
      <TouchableOpacity
        onPress={() => {
          setSelectedCustomerId(item.id);
          setDropdownVisible(false);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2, // For Android shadow
          borderRadius: 8,
          marginHorizontal: 10,
          marginVertical: 5,
        }}
        activeOpacity={0.7}
        accessibilityLabel={`Select customer ${item.name}`}
      >
        {/* Customer Icon */}
        <Ionicons
          name="person-circle-outline"
          size={40}
          color="#4F8EF7"
          style={{ marginRight: 15 }}
        />

        {/* Customer Details */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            {item.phone}
          </Text>
        </View>

        {/* Chevron Icon */}
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#ccc"
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
    );

    return (
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          className="flex-1 justify-center items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 20,
              width: "90%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 10,
            }}
          >
            {/* Header */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {t("Fill Information")}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#666",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {t("Please fill the information below")}
            </Text>

            <Formik
              initialValues={{ guest_phone, guest_name, guest_count, note }}
              onSubmit={() => {
                const data = {
                  guest_id: guest_id,
                  guest_count: guest_count,
                  note: note,
                };
                handleBooking(data);
                setModalVisible(false);
              }}
              validate={() => {
                const errors: any = {};
                if (!guest_phone) {
                  errors.guest_phone = t("Required");
                }
                if (!/^\d{10}$/.test(guest_phone)) {
                  errors.guest_phone = t("Invalid phone number");
                }
                if (!guest_name) {
                  errors.guest_name = t("Required");
                }
                if (!guest_count) {
                  errors.guest_count = t("Required");
                }
                return errors;
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <ScrollView>
                  {/* Select Customer */}
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "#4a4a4a",
                        marginBottom: 5,
                      }}
                    >
                      {t("Select Customer")}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setDropdownVisible(!dropdownVisible)}
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: 15,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ced4da",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: guest_name ? "#000" : "#6c757d",
                        }}
                      >
                        {guest_name
                          ? `${guest_name} (${guest_phone})`
                          : t("Select Customer")}
                      </Text>
                    </TouchableOpacity>
                    {errors.guest_name && (
                      <Text style={{ color: "red", marginTop: 5 }}>
                        {errors.guest_name}
                      </Text>
                    )}
                  </View>
                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={dropdownVisible}
                    onRequestClose={() => {
                      setDropdownVisible(!dropdownVisible);
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
                          width: "90%",
                          backgroundColor: "#f8f9fa",
                          padding: 25,
                          borderRadius: 15,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 5,
                        }}
                      >
                        {/* Add new customer */}

                        <Formik
                          initialValues={{ phone: "", name: "" }}
                          onSubmit={(values) => {
                            const newCustomer: Customer = {
                              phone: values.phone,
                              name: values.name,
                            };
                            const addCustomer = async () => {
                              const response = await postCustomer(newCustomer);
                              if (response.success) {
                                setCustomers([...customers, response.data]);
                              } else {
                                showToast(response);
                              }
                            };
                            addCustomer();
                            setDropdownVisible(false);
                          }}
                          validate={(values) => {
                            const errors: any = {};
                            if (!values.phone) {
                              errors.phone = "Required";
                            }
                            // check format phone
                            if (!/^\d{10}$/.test(values.phone)) {
                              errors.phone = "Invalid phone number";
                            }
                            if (!values.name) {
                              errors.name = "Required";
                            }
                            return errors;
                          }}
                        >
                          {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                          }) => (
                            <>
                              <Text className="text-lg font-bold">
                                {t("Phone")}
                              </Text>
                              <TextInput
                                className="bg-white p-2 rounded-lg border-2 py-2 my-2"
                                style={{ borderColor: Colors.primary }}
                                value={values.phone}
                                placeholder={t("Phone")}
                                onChangeText={handleChange("phone")}
                              />
                              {errors.phone && (
                                <Text style={{ color: "red" }}>
                                  {errors.phone}
                                </Text>
                              )}
                              <Text className="text-lg font-bold">
                                {" "}
                                {t("Name")}
                              </Text>
                              <TextInput
                                className="bg-white p-2 rounded-lg border-2 py-2 my-2"
                                style={{ borderColor: Colors.primary }}
                                value={values.name}
                                placeholder={t("Name")}
                                onChangeText={handleChange("name")}
                              />
                              {errors.name && (
                                <Text style={{ color: "red" }}>
                                  {errors.name}
                                </Text>
                              )}
                              <Pressable
                                onPress={() => handleSubmit()}
                                className="flex-row justify-center items-center p-4 rounded-3xl m-2"
                                style={{
                                  backgroundColor: "#007bff",

                                  shadowColor: "#000",
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.2,
                                  shadowRadius: 5,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "white",
                                    fontSize: 16,
                                    fontWeight: "600",
                                  }}
                                >
                                  {t("Add Customer")}
                                </Text>
                              </Pressable>
                            </>
                          )}
                        </Formik>
                        <FlatList
                          data={customers}
                          renderItem={(item) =>
                            renderCustomerItem({
                              item: item.item,
                              setSelectedCustomerId,
                              setDropdownVisible,
                            })
                          }
                          keyExtractor={(item) => item.id}
                        />
                      </View>
                    </View>
                  </Modal>

                  {/* Guest Count */}
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginBottom: 5,
                      }}
                    >
                      {t("Guest Count")}
                    </Text>
                    <TextInput
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: 10,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ced4da",
                      }}
                      value={guest_count.toString()}
                      placeholder={t("Guest Count")}
                      keyboardType="numeric"
                      onChangeText={(text) => setCount(parseInt(text))}
                    />
                    {errors.guest_count && (
                      <Text style={{ color: "red", marginTop: 5 }}>
                        {errors.guest_count}
                      </Text>
                    )}
                  </View>

                  {/* Note */}
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginBottom: 5,
                      }}
                    >
                      {t("Note")}
                    </Text>
                    <TextInput
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: 10,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ced4da",
                      }}
                      value={note}
                      placeholder={t("Note")}
                      onChangeText={(text) => setNote(text)}
                    />
                  </View>

                  {/* Buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                      style={{
                        backgroundColor: "#007bff",
                        paddingVertical: 15,
                        paddingHorizontal: 30,
                        borderRadius: 10,
                        flex: 1,
                        marginRight: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        {t("Submit")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={{
                        backgroundColor: "#dc3545",
                        paddingVertical: 15,
                        paddingHorizontal: 30,
                        borderRadius: 10,
                        flex: 1,
                        marginLeft: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        {t("Close")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    );
  };

  const handleBooking = async (data: any) => {
    setLoading(true);
    const dataSolve = {
      paid_amount: price,
      residence_id: hold?.residence_id,
      checkin: parseDateDDMMYYYY(hold?.checkin),
      checkout: parseDateDDMMYYYY(hold?.checkout),
      guest_id: data.guest_id,
      guest_count: data.guest_count,
      note: data.note,
      hold_residence_id: hold?.id,
    };
    const response = await bookingApi(dataSolve);
    showToast(response);
    if (response.success) {
      fetchHold();
    }

    setLoading(false);
  };

  const renderHoldItem = ({ item }: { item: HoldType }) => {
    const { color, icon, textColor } = getStatusHoldStyle(
      parseStatusHold(item)
    );
    return (
      <View className="bg-white p-5 mb-5 mx-4 rounded-2xl shadow-lg">
        <Image
          source={{ uri: "https://picsum.photos/200/300" }}
          className="w-full h-40 rounded-xl mb-4"
        />

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-semibold text-gray-800">
            {item.residence_name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name={icon} size={24} color={color} />
            <Text className={`ml-2 font-medium text-${textColor}`}>
              {parseStatusHold(item)}
            </Text>
          </View>
        </View>
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={20} color="#4A5568" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-medium">Check-in:</Text>
              {parseDateDDMMYYYY(item.checkin)}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={20} color="#4A5568" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-medium">Check-out:</Text>
              {parseDateDDMMYYYY(item.checkout)}
            </Text>
          </View>
        </View>

        {/* Mô tả */}
        {item.description ? (
          <View className="mb-4">
            <Text className="text-gray-600">{item.description}</Text>
          </View>
        ) : null}

        {/* Nút hành động */}
        {item.is_host_accept && (
          <View className="flex-row justify-end">
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-full"
              onPress={() => {
                setHold(item);
                setModalVisible(true);
              }}
            >
              <Text className="text-white font-medium">
                {t("Fill Information")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading loading={loading} />

      <FlatList
        data={holds}
        renderItem={renderHoldItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => <EmptyData />}
      />
      <RenderModal />
    </SafeAreaView>
  );
};

export default Hold;
