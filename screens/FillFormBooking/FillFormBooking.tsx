import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import * as Animatable from "react-native-animatable";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { CustomerType } from "@/types";
import { deleteCustomerApi, getCusomtersApi } from "@/apis/customer";
import useToast from "@/hooks/useToast";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { DeleteConfirmationModal } from "@/components";
import { useSelector } from "react-redux";
import { selectFilter } from "@/redux/slices/filterSlice";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import { bookingApi, getPrice, holdBookingApi } from "@/apis/booking";
import { Formik } from "formik";
import { Colors } from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon, { Icons } from "@/components/Icons";
import { parsePrice } from "@/utils/parsePrice";
import { router } from "expo-router";
type RouteParams = {
  params: {
    itemId: string;
  };
};

interface BillDetail {
  date: string;
  price: number;
}

const FillFormBooking = () => {
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { itemId } = route.params;
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const { showToast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState(0);
  const [commission_rate, setCommissionRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const pickDate = useSelector(selectFilter);
  const [priceBill, setPriceBill] = useState<BillDetail[]>([]);
  const [options, setOptions] = useState<string>("book");

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const response = await getCusomtersApi();
      if (response.success) {
        setCustomers(response.data.data);
      } else {
        showToast(response);
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const handleSelectCustomer = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setDropdownVisible(false);
  };

  const handleDeleteCustomer = async (id: number) => {
    const response = await deleteCustomerApi(id);
    if (response.success) {
      const newCustomers = customers.filter((c) => c.id !== id);
      setCustomers(newCustomers);
      showToast(response);
    } else {
      showToast(response);
    }
  };

  const handleConfirmDelete = (id: number) => {
    handleDeleteCustomer(id);
    setVisible(false);
  };

  const fetchPrice = async () => {
    setLoading(true);
    const data = {
      checkin: parseDateDDMMYYYY(pickDate.start_date.toISOString()),
      checkout: parseDateDDMMYYYY(pickDate.end_date.toISOString()),
      residence_ids: [parseInt(itemId)],
    };
    const response = await getPrice(data);
    if (response.success) {
      setPrice(response.data[0].total_price);
      setCommissionRate(response.data[0].commission_rate);
      setPriceBill(response.data[0].price_details);
    } else {
      showToast(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  const [visibleDetail, setVisibleDetail] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animatable.View
        style={{ flexDirection: "row", alignItems: "center" }}
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Booking</Text>
        </View>
      </Animatable.View>
      <ScrollView style={{ flex: 1 }}>
        {/* Schedule */}
        <View className="bg-white px-4 py-4 mx-4 my-2 rounded-xl shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            {t("Schedule")}
          </Text>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <MaterialIcons name="event" size={20} color="#4A5568" />
              <Text className="ml-2 text-base text-gray-700">
                {parseDateDDMMYYYY(pickDate.start_date.toISOString())}
              </Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color="#A0AEC0" />
            <View className="flex-row items-center">
              <MaterialIcons name="event" size={20} color="#4A5568" />
              <Text className="ml-2 text-base text-gray-700">
                {parseDateDDMMYYYY(pickDate.end_date.toISOString())}
              </Text>
            </View>
          </View>
        </View>
        {/* Bill detail flatlist */}

        {/* Price */}
        <TouchableOpacity
          className="bg-white px-4 py-4 mx-4 my-2 rounded-xl shadow-md"
          onPress={() => setVisibleDetail(true)}
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">
              {t("Price")}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-blue-600 ml-1">
                {parsePrice(price)} VND
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Modal visible={visibleDetail} transparent>
          <View
            className="flex flex-1 justify-center items-center bg-opacity-50 "
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View className="bg-white p-5 rounded-2xl shadow-lg w-11/12">
              <Text className="text-2xl font-semibold mb-5">Detail</Text>

              <ScrollView className="max-h-96">
                <FlatList
                  className="w-full m-2"
                  data={priceBill}
                  renderItem={({ item, index }) => (
                    <View>
                      <View
                        key={index}
                        className="flex flex-row justify-between items-center border-b border-gray-200 py-3 w-11/12"
                      >
                        <View className="flex flex-row items-center">
                          <Icon
                            type={Icons.Feather}
                            name="calendar"
                            size={20}
                            color={Colors.primary}
                          />
                          <Text className="text-gray-700 text-base">
                            {parseDateDDMMYYYY(item.date)}
                          </Text>
                        </View>
                        <Text className="text-gray-700 text-base font-medium">
                          {item.price} VND
                        </Text>
                      </View>

                      <View className="flex flex-row justify-between items-center border-b border-gray-200 py-3 w-11/12">
                        <View className="flex flex-row items-center">
                          <Icon
                            type={Icons.Feather}
                            name="percent"
                            size={20}
                            color={Colors.primary}
                          />
                          <Text className="text-gray-700 text-base">
                            {t("Commission Rate")}
                          </Text>
                        </View>
                        <Text className="text-gray-700 text-base font-medium">
                          {commission_rate}%
                        </Text>
                      </View>

                      <View className="flex flex-row justify-between items-center border-b border-gray-200 py-3 w-11/12">
                        <View className="flex flex-row items-center">
                          <Icon
                            type={Icons.Feather}
                            name="dollar-sign"
                            size={20}
                            color={Colors.primary}
                          />
                          <Text className="text-gray-700 text-base">
                            {t("Commission")}
                          </Text>
                        </View>
                        <Text className="text-gray-700 text-base font-medium">
                          {parsePrice((item.price * commission_rate) / 100)} VND
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </ScrollView>

              <View className="">
                <TouchableOpacity
                  onPress={() => setVisibleDetail(false)}
                  className="flex items-center justify-center p-4 rounded-3xl w-full bg-red-500 "
                >
                  <Text className=" text-white font-semibold text-base">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Customer Selection */}

        {/* Modal for Customer List */}
        <Modal visible={dropdownVisible} animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={customers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCustomer(item)}
                  onLongPress={() => {
                    setSelectedCustomer(item);
                    setVisible(true);
                  }}
                  delayLongPress={1000}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={40}
                    color="#4F8EF7"
                    style={{ marginRight: 15 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontSize: 18, fontWeight: "600", color: "#333" }}
                    >
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
                      {item.phone}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                padding: 16,
                backgroundColor: "#4F8EF7",
                alignItems: "center",
              }}
              onPress={() => setDropdownVisible(false)}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Đóng</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          visible={visible}
          onConfirm={() => handleConfirmDelete(selectedCustomer?.id)}
          onCancel={() => setVisible(false)}
        />

        {/* Formik Form */}

        {options === "book" ? (
          <View
            style={{ backgroundColor: "white" }}
            className="bg-white px-4 py-4 mx-4 my-2 rounded-xl shadow-md"
          >
            <Formik
              enableReinitialize
              initialValues={{
                residence_id: parseInt(itemId),
                checkin: parseDateDDMMYYYY(pickDate.start_date.toISOString()),
                checkout: parseDateDDMMYYYY(pickDate.end_date.toISOString()),
                customer_id: selectedCustomer ? selectedCustomer.id : null,
                guest_count: 1,
                note: "",
              }}
              onSubmit={(values) => {
                const solveApi = async () => {
                  const data = {
                    residence_id: parseInt(itemId),
                    checkin: parseDateDDMMYYYY(
                      pickDate.start_date.toISOString()
                    ),
                    checkout: parseDateDDMMYYYY(
                      pickDate.end_date.toISOString()
                    ),
                    guest_id: values.customer_id,
                    guest_count: values.guest_count,
                    note: values.note,
                  };

                  const response = await bookingApi(data);

                  showToast(response);

                  if (response.success) {
                    const data = response.data;
                    // biuld json data to push book success

                    router.replace(`BookSuccessScreen?idBooking=${data.id}`);
                  }
                };
                solveApi();
              }}
              validate={(values) => {
                const errors: any = {};
                if (!values.customer_id) {
                  errors.customer_id = t("Required");
                }
                if (!values.guest_count) {
                  errors.guest_count = t("Required");
                }

                // guest count must be greater than 0
                if (values.guest_count <= 0) {
                  errors.guest_count = t("Must be > 0");
                }
                return errors;
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 8,
                    }}
                  >
                    {t("Booking Information")}
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderColor: Colors.primary,
                      borderWidth: 2,
                      borderRadius: 25,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginVertical: 5,
                      width: "auto",
                    }}
                    onPress={() => setDropdownVisible(true)}
                  >
                    <Icon
                      type={Icons.Feather}
                      name="user"
                      size={20}
                      color={Colors.primary}
                    />
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        paddingVertical: 8,
                      }}
                    >
                      <Text style={{ fontSize: 18, marginLeft: 8 }}>
                        {selectedCustomer
                          ? selectedCustomer.name
                          : t("Select Customer")}
                      </Text>
                    </TouchableOpacity>
                    {errors.customer_id && (
                      <Text style={{ color: "red" }}>{errors.customer_id}</Text>
                    )}
                  </TouchableOpacity>

                  {/* errors not pick customer */}

                  {/* errors not pick guest count */}

                  {/* Guest Count */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 16 }}>{t("Guests")}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: Colors.primary,
                        borderWidth: 2,
                        borderRadius: 25,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginVertical: 5,
                        width: "auto",
                      }}
                    >
                      <Icon
                        type={Icons.AntDesign}
                        name="user"
                        size={20}
                        color={Colors.primary}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          color: Colors.black,
                          paddingVertical: 8,
                        }}
                        keyboardType="numeric"
                        onChangeText={handleChange("guest_count")}
                        onBlur={handleBlur("guest_count")}
                        placeholder={t("Guests")}
                        value={values.guest_count}
                      />
                      {errors.guest_count && (
                        <Text style={{ color: "red" }}>
                          {errors.guest_count}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Note */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 16 }}>{t("Note")}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: Colors.primary,
                        borderWidth: 2,
                        borderRadius: 25,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginVertical: 5,
                        width: "auto",
                      }}
                    >
                      <Icon
                        type={Icons.AntDesign}
                        name="edit"
                        size={20}
                        color={Colors.primary}
                      />

                      <TextInput
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          color: Colors.black,
                          paddingVertical: 8,
                        }}
                        onChangeText={handleChange("note")}
                        onBlur={handleBlur("note")}
                        value={values.note}
                        placeholder={t("Note")}
                      />
                    </View>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    className="rounded-3xl bg-blue-500 text-white p-4 text-center"
                    style={{
                      backgroundColor: Colors.primary,
                      padding: 16,

                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 18 }}>
                      {t("Submit")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setOptions("hold")}
                    className="flex justify-center items-center"
                  >
                    <Text
                      style={{ color: Colors.primary }}
                      className="font-semibold text-lg mt-5"
                    >
                      {t("You wanna hold?")}
                    </Text>
                  </TouchableOpacity>

                  {/* change form */}
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <View
            style={{ backgroundColor: "white" }}
            className="bg-white px-4 py-4 mx-4 my-2 rounded-xl shadow-md"
          >
            <Formik
              enableReinitialize
              initialValues={{
                residence_id: parseInt(itemId),
                checkin: parseDateDDMMYYYY(pickDate.start_date.toISOString()),
                checkout: parseDateDDMMYYYY(pickDate.end_date.toISOString()),
                expire: 0,
              }}
              onSubmit={(values) => {
                const solveApi = async () => {
                  const data = {
                    residence_id: parseInt(itemId),
                    checkin: parseDateDDMMYYYY(
                      pickDate.start_date.toISOString()
                    ),
                    checkout: parseDateDDMMYYYY(
                      pickDate.end_date.toISOString()
                    ),
                    expire: parseInt(values.expire),
                  };
                  const res = await holdBookingApi(data);
                  showToast(res);
                  if (res.success) {
                    router.replace(`HoldSuccessScreen?id=${res.data.id}`);
                  }
                };
                solveApi();
              }}
              validate={(values) => {
                const errors: any = {};
                if (values.expire <= 0) {
                  errors.expire = t("Required");
                }
                return errors;
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 8,
                    }}
                  >
                    {t("Hold Information")}
                  </Text>

                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 16 }}>{t("Expire")}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: Colors.primary,
                        borderWidth: 2,
                        borderRadius: 25,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginVertical: 5,
                        width: "auto",
                      }}
                    >
                      <Icon
                        type={Icons.AntDesign}
                        name="calendar"
                        size={20}
                        color={Colors.primary}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          color: Colors.black,
                          paddingVertical: 8,
                        }}
                        keyboardType="numeric"
                        onChangeText={handleChange("expire")}
                        onBlur={handleBlur("expire")}
                        placeholder={t("Expire")}
                        value={values.expire}
                      />
                      {errors.expire && (
                        <Text style={{ color: "red" }}>{errors.expire}</Text>
                      )}
                    </View>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    className="rounded-3xl bg-blue-500 text-white p-4 text-center"
                    style={{
                      backgroundColor: Colors.primary,
                      padding: 16,

                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 18 }}>
                      {t("Submit")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setOptions("book")}
                    className="flex justify-center items-center"
                  >
                    <Text
                      style={{ color: Colors.primary }}
                      className="font-semibold text-lg mt-5"
                    >
                      {t("You wanna book?")}
                    </Text>
                  </TouchableOpacity>

                  {/* change form */}
                </View>
              )}
            </Formik>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FillFormBooking;
