import { bookingApi, getPrice, holdBookingApi } from "@/apis/booking";
import { Loading } from "@/components";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

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
}: {
  selectedDayForm: DayFormProps;
  name: string;
  setSelectedDayForm: (value: React.SetStateAction<DayFormProps>) => void;
  isHost: boolean;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState<number>(0);
  const [modalVisibleBooking, setModalVisibleBooking] = useState(false);

  const handleHolding = async () => {
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
    };

    const response = await holdBookingApi(data);

    if (response.success) {
      Toast.show({
        type: "success",
        text1: "Booking Success",
        text2: "Your booking is successful",
      });
      setSelectedDayForm({
        ...selectedDayForm,
        checkin: null,
        checkout: null,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: response.msg,
      });
    }
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
    console.log(response);
    if (response.success) {
      setPrice(response.data[0].total_price);
    } else {
      Toast.show({
        type: "error",
        text1: "Get Price Failed",
        text2: response.msg,
      });
    }
    setLoading(false);
  };
  const RenderBookingForm = () => {
    const [guest_phone, setPhone] = useState("");
    const [guest_name, setName] = useState("");
    const [guest_count, setCount] = useState(1);
    const [note, setNote] = useState("");

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
              <View style={{ marginBottom: 15 }}>
                {/* Added margin for spacing */}
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#4a4a4a",
                  }}
                >
                  Name
                </Text>
                <Text style={{ fontSize: 16, color: "#6c757d" }}>{name}</Text>
                {/* Subtle color */}
              </View>
              <View style={{ marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#4a4a4a",
                  }}
                >
                  Checkin
                </Text>
                <Text style={{ fontSize: 16, color: "#6c757d" }}>
                  {selectedDayForm.checkin
                    ? new Date(selectedDayForm.checkin).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"}
                </Text>
              </View>
              <View style={{ marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#4a4a4a",
                  }}
                >
                  Checkout
                </Text>
                <Text style={{ fontSize: 16, color: "#6c757d" }}>
                  {selectedDayForm.checkout
                    ? new Date(selectedDayForm.checkout).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"}
                </Text>
              </View>

              <View style={{ marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#4a4a4a",
                  }}
                >
                  Price
                </Text>
                <Text style={{ fontSize: 16, color: "#6c757d" }}>{price}</Text>
              </View>

              <Formik
                initialValues={{ guest_phone, guest_name, guest_count, note }}
                onSubmit={() => {
                  const data = {
                    guest_phone: guest_phone,
                    guest_name: guest_name,
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
                      <Text className="text-lg font-bold"> Phone </Text>
                      <TextInput
                        className="bg-white p-2 rounded-lg border-2 py-2"
                        style={{ borderColor: Colors.primary }}
                        value={guest_phone}
                        placeholder="Phone"
                        onChangeText={(text) => setPhone(text)}
                      />

                      {/* error */}
                      <Text style={{ color: "red" }}>{errors.guest_phone}</Text>

                      <Text className="text-lg font-bold"> Name </Text>
                      <TextInput
                        className="bg-white p-2 rounded-lg border-2 py-2"
                        style={{ borderColor: Colors.primary }}
                        value={guest_name}
                        placeholder="Name"
                        onChangeText={(text) => setName(text)}
                      />

                      {/* error */}
                      <Text style={{ color: "red" }}>{errors.guest_name}</Text>

                      <Text className="text-lg font-bold"> Count </Text>
                      <TextInput
                        className="bg-white p-2 rounded-lg border-2 py-2"
                        style={{ borderColor: Colors.primary }}
                        value={guest_count.toString()}
                        placeholder="Count"
                        onChangeText={(text) => setCount(parseInt(text))}
                      />
                      {/* error */}
                      <Text style={{ color: "red" }}>{errors.guest_count}</Text>

                      <Text className="text-lg font-bold"> Note </Text>

                      <TextInput
                        className="bg-white p-2 rounded-lg border-2 py-2"
                        style={{ borderColor: Colors.primary }}
                        value={note}
                        placeholder="Note"
                        onChangeText={(text) => setNote(text)}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <Pressable
                        onPress={() =>
                          setModalVisibleBooking(!modalVisibleBooking)
                        }
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
                            fontSize: 16,
                            fontWeight: "600",
                          }}
                        >
                          Close
                        </Text>
                      </Pressable>

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
                          Book
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

    console.log(dataSolve);
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

      guest_phone: dataSolve.guest_phone,
      guest_name: dataSolve.guest_name,
      guest_count: dataSolve.guest_count,
      note: dataSolve.note,
    };
    console.log(data);
    const response = await bookingApi(data);
    console.log(response);
    if (response.success) {
      Toast.show({
        type: "success",
        text1: "Booking Success",
        text2: "Your booking is successful",
      });
      setSelectedDayForm({
        ...selectedDayForm,
        checkin: null,
        checkout: null,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: response.msg,
      });
    }
    setLoading(false);
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
                <View style={{ marginBottom: 15 }}>
                  {/* Added margin for spacing */}
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#4a4a4a",
                    }}
                  >
                    Name
                  </Text>
                  <Text style={{ fontSize: 16, color: "#6c757d" }}>{name}</Text>
                  {/* Subtle color */}
                </View>
                <View style={{ marginBottom: 15 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#4a4a4a",
                    }}
                  >
                    Checkin
                  </Text>
                  <Text style={{ fontSize: 16, color: "#6c757d" }}>
                    {selectedDayForm.checkin
                      ? new Date(selectedDayForm.checkin).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"}
                  </Text>
                </View>
                <View style={{ marginBottom: 15 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#4a4a4a",
                    }}
                  >
                    Checkout
                  </Text>
                  <Text style={{ fontSize: 16, color: "#6c757d" }}>
                    {selectedDayForm.checkout
                      ? new Date(selectedDayForm.checkout).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"}
                  </Text>
                </View>

                <View style={{ marginBottom: 15 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#4a4a4a",
                    }}
                  >
                    Price
                  </Text>
                  <Text style={{ fontSize: 16, color: "#6c757d" }}>
                    {price}
                  </Text>
                </View>

                {/* Buttons */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Pressable
                    onPress={() => setModalVisible(!modalVisible)}
                    style={{
                      backgroundColor: "#dc3545", // Red background for Close
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
                      Close
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleHolding}
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
                      Book
                    </Text>
                  </Pressable>
                </View>
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
