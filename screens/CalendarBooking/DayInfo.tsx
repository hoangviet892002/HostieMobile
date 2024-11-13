import { bookingApi, getPrice, holdBookingApi } from "@/apis/booking";
import {
  deleteCustomerApi,
  getCusomtersApi,
  postCustomer,
} from "@/apis/customer";
import { DeleteConfirmationModal, Loading } from "@/components";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import useToast from "@/hooks/useToast";
import { Customer } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface DayFormProps {
  checkin?: string;
  checkout?: string;
  residence_id?: number;
}

const DayInfo = ({
  selectedDayForm,
  name,
  setSelectedDayForm,
  isHost,
  RefreshCalendar,
}: {
  selectedDayForm: DayFormProps;
  name: string;
  setSelectedDayForm: (value: React.SetStateAction<DayFormProps>) => void;
  isHost: boolean;
  RefreshCalendar?: () => void;
}) => {
  const { showToast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState<number>(0);
  const [modalVisibleBooking, setModalVisibleBooking] = useState(false);

  const handleHolding = async (expire: number) => {
    setLoading(true);
    const data = {
      residence_id: selectedDayForm.residence_id,
      checkin: selectedDayForm.checkin
        ? new Date(selectedDayForm.checkin)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-") // to convert the default slashes to dashes
        : undefined,
      checkout: selectedDayForm.checkout
        ? new Date(selectedDayForm.checkout)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-") // to convert the slashes to dashes
        : undefined,
      expire: expire,
    };

    const response = await holdBookingApi(data);
    showToast(response);

    if (response.success) {
      setSelectedDayForm({
        ...selectedDayForm,
        checkin: null,
        checkout: null,
      });
    }
    RefreshCalendar();
    setLoading(false);
    setModalVisible(false);
  };

  const getPriceApi = async () => {
    setLoading(true);
    const data = {
      checkin: selectedDayForm.checkin
        ? new Date(selectedDayForm.checkin)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-")
        : undefined,
      checkout: selectedDayForm.checkout
        ? new Date(selectedDayForm.checkout)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-")
        : undefined,
      residence_ids: [selectedDayForm.residence_id],
    };

    const response = await getPrice(data);

    if (response.success) {
      setPrice(response.data[0].total_price);
    } else {
      showToast(response);
    }
    setLoading(false);
  };

  const RenderBookingForm = () => {
    const [guest_phone, setPhone] = useState("");
    const [guest_name, setName] = useState("");
    const [guest_id, setId] = useState("");
    const [guest_count, setCount] = useState(1);
    const [note, setNote] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [visible, setVisible] = useState(false);

    const deleteCustomer = async (id: number) => {
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
      deleteCustomer(id); // Perform delete action
      setVisible(false); // Hide modal
    };
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
      <>
        <TouchableOpacity
          onPress={() => {
            setSelectedCustomerId(item.id);
            setDropdownVisible(false);
          }}
          onLongPress={() => {
            setVisible(true);
          }}
          delayLongPress={1000}
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
            elevation: 2,
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
        <DeleteConfirmationModal
          visible={visible}
          onConfirm={() => handleConfirmDelete(item.id)}
          onCancel={() => setVisible(false)}
        />
      </>
    );

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleBooking}
        onRequestClose={() => {
          setModalVisibleBooking(!modalVisibleBooking);
        }}
      >
        <Loading loading={loading} />
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
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 15,
                color: "#333",
              }}
            >
              Booking Form
            </Text>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <InfoRow label="Name" value={name} />
              <InfoRow
                label="Checkin"
                value={
                  selectedDayForm.checkin
                    ? new Date(selectedDayForm.checkin).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"
                }
              />
              <InfoRow
                label="Checkout"
                value={
                  selectedDayForm.checkout
                    ? new Date(selectedDayForm.checkout).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"
                }
              />

              <InfoRow label="Price" value={price.toString()} />

              <Formik
                initialValues={{ guest_phone, guest_name, guest_count, note }}
                onSubmit={() => {
                  const data = {
                    guest_id: guest_id,
                    guest_count: guest_count,
                    note: note,
                  };
                  handleBooking(data);
                  setModalVisibleBooking(!modalVisibleBooking);
                }}
                validate={() => {
                  const errors: any = {};
                  if (!guest_phone) {
                    errors.guest_phone = "Required";
                  }
                  // check format phone
                  if (!/^\d{10}$/.test(guest_phone)) {
                    errors.guest_phone = "Invalid phone number";
                  }
                  if (!guest_name) {
                    errors.guest_name = "Required";
                  }
                  if (!guest_count) {
                    errors.guest_count = "Required";
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
                    <View>
                      <View style={{ marginBottom: 15 }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: "#4a4a4a",
                            marginBottom: 5,
                          }}
                        >
                          Select Customer
                        </Text>
                        <TouchableOpacity
                          onPress={() => setDropdownVisible(!dropdownVisible)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderColor: Colors.primary,
                            borderWidth: 2,
                            borderRadius: 25,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            marginVertical: 5,
                            width: wp(80),
                          }}
                        >
                          <Icon
                            type={Icons.Feather}
                            name="user"
                            size={20}
                            color={Colors.primary}
                          />
                          <Text
                            style={{
                              flex: 1,
                              marginLeft: 10,
                              paddingVertical: 8,
                              color: guest_name ? "#000" : "#6c757d",
                            }}
                          >
                            {guest_name
                              ? `${guest_name} (${guest_phone})`
                              : "Select a customer"}
                          </Text>
                        </TouchableOpacity>

                        {/* Dropdown Modal */}
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
                                    const response = await postCustomer(
                                      newCustomer
                                    );
                                    if (response.success) {
                                      setCustomers([
                                        ...customers,
                                        response.data,
                                      ]);
                                      setSelectedCustomerId(response.data.id);
                                      setName(response.data.name);
                                      setPhone(response.data.phone);
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
                                      {" "}
                                      Phone{" "}
                                    </Text>
                                    <TextInput
                                      className="bg-white p-2 rounded-lg border-2 py-2 my-2"
                                      style={{ borderColor: Colors.primary }}
                                      value={values.phone}
                                      placeholder="Phone"
                                      onChangeText={handleChange("phone")}
                                    />
                                    {errors.phone && (
                                      <Text style={{ color: "red" }}>
                                        {errors.phone}
                                      </Text>
                                    )}
                                    <Text className="text-lg font-bold">
                                      {" "}
                                      Name{" "}
                                    </Text>
                                    <TextInput
                                      className="bg-white p-2 rounded-lg border-2 py-2 my-2"
                                      style={{ borderColor: Colors.primary }}
                                      value={values.name}
                                      placeholder="Name"
                                      onChangeText={handleChange("name")}
                                    />
                                    {errors.name && (
                                      <Text style={{ color: "red" }}>
                                        {errors.name}
                                      </Text>
                                    )}
                                    <Pressable
                                      onPress={() => handleSubmit()}
                                      style={{
                                        backgroundColor: "#007bff",
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        borderRadius: 10,
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
                                        Add
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
                      </View>
                      {/* error */}
                      {errors.guest_name && (
                        <Text style={{ color: "red" }}>
                          {errors.guest_name}
                        </Text>
                      )}
                      <Text className="text-lg font-bold"> Guest Count </Text>
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
                          width: wp(80),
                        }}
                      >
                        <Icon
                          type={Icons.Feather}
                          name="users"
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
                          value={guest_count.toString()}
                          placeholder="Guest Count"
                          keyboardType="numeric"
                          onChangeText={(text) => setCount(parseInt(text))}
                        />
                        {errors.guest_count && (
                          <Text style={{ color: "red" }}>
                            {errors.guest_count}
                          </Text>
                        )}
                      </View>

                      <Text className="text-lg font-bold"> Note </Text>

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
                          width: wp(80),
                        }}
                      >
                        <Icon
                          type={Icons.Feather}
                          name="file-text"
                          size={20}
                          color={Colors.primary}
                        />
                        <TextInput
                          style={{
                            flex: 1,
                            color: Colors.black,
                            paddingVertical: 8,
                          }}
                          value={note}
                          placeholder="Note"
                          onChangeText={(text) => setNote(text)}
                        />
                      </View>
                    </View>

                    {/* Buttons */}

                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <Pressable
                        className="flex justify-center items-center w-full rounded-3xl h-14 my-1"
                        style={{
                          backgroundColor: "#007bff",
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 5,
                        }}
                        onPress={() => handleSubmit()}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "600",
                          }}
                        >
                          Book
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          setModalVisibleBooking(!modalVisibleBooking)
                        }
                        className="flex justify-center items-center w-full rounded-3xl h-14 my-1"
                        style={{
                          backgroundColor: "#dc3545",
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          borderRadius: 10,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "600",
                          }}
                        >
                          Close
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </Formik>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const handleBooking = async (dataSolve: any) => {
    setLoading(true);

    const data = {
      paid_amount: price,
      residence_id: selectedDayForm.residence_id,
      checkin: selectedDayForm.checkin
        ? new Date(selectedDayForm.checkin)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-") // to convert the default slashes to dashes
        : undefined,
      checkout: selectedDayForm.checkout
        ? new Date(selectedDayForm.checkout)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-")
        : undefined,

      guest_id: dataSolve.guest_id,
      guest_count: dataSolve.guest_count,
      note: dataSolve.note,
    };

    const response = await bookingApi(data);

    showToast(response);
    if (response.success) {
      setSelectedDayForm({
        ...selectedDayForm,
        checkin: null,
        checkout: null,
      });
    }
    RefreshCalendar();
    setLoading(false);
  };
  const InfoRow = ({ label, value }: { label: string; value: string }) => {
    return (
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-1">
          {label}
        </Text>
        <View className="border-b border-gray-300">
          <Text className="text-base text-gray-600">{value}</Text>
        </View>
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        {/* Checkin Section */}
        {selectedDayForm.checkin && (
          <View style={styles.infoRow}>
            <Icon
              type={Icons.AntDesign}
              name="calendar"
              color={Colors.primary}
            />
            <Text style={styles.infoText}>
              Checkin:{" "}
              {new Date(selectedDayForm.checkin).toLocaleDateString("en-GB")}
            </Text>
          </View>
        )}

        {/* Checkout Section */}
        {selectedDayForm.checkout && (
          <View style={styles.infoRow}>
            <Icon
              type={Icons.AntDesign}
              name="calendar"
              color={Colors.primary}
            />
            <Text style={styles.infoText}>
              Checkout:{" "}
              {new Date(selectedDayForm.checkout).toLocaleDateString("en-GB")}
            </Text>
          </View>
        )}

        {/* Booking button */}
        {selectedDayForm.checkin && selectedDayForm.checkout && (
          <>
            <View
              className="rounded-3xl p-4 mb-4 flex justify-center items-center"
              style={{
                backgroundColor: Colors.primary,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Pressable
                onPress={() => {
                  setModalVisible(true);
                  getPriceApi();
                }}
                style={({ pressed }) => [
                  { transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }] },
                ]}
              >
                <Text className="font-semibold text-2xl text-white">Hold</Text>
              </Pressable>
            </View>

            <View
              className="rounded-3xl p-4 flex justify-center items-center"
              style={{
                backgroundColor: Colors.primary,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Pressable
                onPress={() => {
                  getPriceApi();
                  setModalVisibleBooking(true);
                }}
                style={({ pressed }) => [
                  { transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }] },
                ]}
              >
                <Text className="font-semibold text-2xl text-white">
                  Book Now
                </Text>
              </Pressable>
            </View>
          </>
        )}

        <RenderBookingForm />

        {/* Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <Loading loading={loading} />
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
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 15,
                  color: "#333",
                }}
              >
                Hold Form
              </Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <InfoRow label="Name" value={name} />
                <InfoRow
                  label="Checkin"
                  value={
                    selectedDayForm.checkin
                      ? new Date(selectedDayForm.checkin).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"
                  }
                />
                <InfoRow
                  label="Checkout"
                  value={
                    selectedDayForm.checkout
                      ? new Date(selectedDayForm.checkout).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"
                  }
                />

                <InfoRow label="Price" value={price.toString()} />

                <Formik
                  initialValues={{ expire: "" }}
                  onSubmit={(values) => {
                    handleHolding(parseInt(values.expire));
                  }}
                  validate={(value) => {
                    const errors: any = {};
                    if (!value.expire) {
                      errors.expire = "Required";
                    }
                    if (!/^\d+$/.test(value.expire)) {
                      errors.expire = "Invalid number";
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
                          width: wp(80),
                        }}
                      >
                        <Icon
                          type={Icons.Feather}
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
                          value={values.expire}
                          placeholder="Expire( minute)"
                          onChangeText={handleChange("expire")}
                        />
                        {errors.expire && (
                          <Text style={{ color: "red" }}>{errors.expire}</Text>
                        )}
                      </View>
                      {/* Buttons */}
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 20,
                        }}
                      >
                        <Pressable
                          onPress={() => handleSubmit()}
                          className="flex justify-center items-center w-full rounded-3xl h-14 my-1"
                          style={{
                            backgroundColor: "#007bff",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 20,
                              fontWeight: "600",
                            }}
                          >
                            Book
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => setModalVisible(!modalVisible)}
                          className="flex justify-center items-center w-full rounded-3xl h-14 my-1"
                          style={{
                            backgroundColor: "#dc3545",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 20,
                              fontWeight: "600",
                            }}
                          >
                            Close
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </Formik>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 10,
  },
});

export default DayInfo;
