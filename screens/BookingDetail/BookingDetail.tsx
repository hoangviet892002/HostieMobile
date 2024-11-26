import {
  acceptBookingApi,
  checkinApi,
  checkoutApi,
  getDetailBookingApi,
  getLogApi,
  getQRCodeApi,
  hostReceiveApi,
  sellerCancelApi,
  sellerTransferApi,
  updateBookingApi,
} from "@/apis/booking";
import { getMyBankAccountsApi } from "@/apis/users";
import { BackButton, DateTimePicker, EmptyData, Loading } from "@/components";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { Roles } from "@/constants/enums/roles";
import {
  ActionStatusBooking,
  StatusBooking,
} from "@/constants/enums/statusBookingEnums";
import { getStatusStyle } from "@/constants/getStatusStyle";
import useToast from "@/hooks/useToast";
import { selectRole, selectUserId } from "@/redux/slices/authSlice";
import {
  BankAccountsType,
  BookingType,
  DetailBookingType,
  QRType,
} from "@/types";
import { parseDateDDMMYYYY, parseDateString } from "@/utils/parseDate";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { parseStatusBooking } from "@/utils/parseStatusBooking";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import * as Animatable from "react-native-animatable";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Residence } from "@/types/response/Residences";
import { getPolicy, getResidence } from "@/apis/residences";
import { parsePrice } from "@/utils/parsePrice";
import { getCusomtersApi } from "@/apis/customer";
import { parseLogsEvent } from "@/utils/parseLogsEvent";
import { PolicyType } from "@/types/PolicyType";
import { ModalPolicy } from "@/components";
import ReportModal from "./ReportModal";

interface Data {
  booking: BookingType;
  details: DetailBookingType[];
}
type RouteParams = {
  params: {
    id: string;
  };
};

interface Log {
  date: string;
  event_type: string;
  user_id: number;
  username: string;
  user_avatar: string;
  data_change: DataChange[];
}
interface DataChange {
  field: string;
  old_value: string;
  new_value: string;
}
const BookingDetail = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [data, setData] = useState<Data>({
    booking: {
      checkin: "",
      checkout: "",
      seller_id: 0,
      host_id: 0,
    },
  } as Data);
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id } = route.params;
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const idUser = useSelector(selectUserId);
  const { t } = useTranslation();
  const role = useSelector(selectRole);
  const [permission, setPermission] = useState<string[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [residence, setResidence] = useState<Residence | null>(null);

  const [visibleQR, setVisibleQR] = useState(false);

  const [logs, setLogs] = useState<Log[]>([]);
  const updatePermission = () => {
    let newPermissions: string[] = [];

    console.log("booking: ", data.booking);

    if (role === Roles.ROLE_HOUSEKEEPER) {
      const status = parseStatusBooking(data.booking);
      if (status === StatusBooking.SUCCESS) {
        newPermissions.push(ActionStatusBooking.CHECKIN);
      }
      if (status === StatusBooking.CHECKIN) {
        newPermissions.push(ActionStatusBooking.CHECKOUT);
      }
    } else if (idUser === data.booking.seller_id) {
      const status = parseStatusBooking(data.booking);
      if (status !== StatusBooking.CANCEL && status !== StatusBooking.REJECT) {
        newPermissions.push(ActionStatusBooking.CANCEL);
      }
      if (status === StatusBooking.WAIT_TRANSFER) {
        newPermissions.push(ActionStatusBooking.TRANSFER);
        newPermissions.push(ActionStatusBooking.OPENQR);
      }
      if (status !== StatusBooking.CANCEL && status !== StatusBooking.REJECT) {
        newPermissions.push(ActionStatusBooking.UPDATE);
      }
      if (status === StatusBooking.SUCCESS) {
        newPermissions.push(ActionStatusBooking.OPENPOLICY);
      }
    }
    // if (idUser === data.booking.host_id)
    else {
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
    }

    newPermissions.push(ActionStatusBooking.OPENDETAIL);
    newPermissions.push(ActionStatusBooking.OPENTRACKING);
    setPermission(newPermissions);
  };

  const fetchDataLog = async () => {
    const response = await getLogApi(id);

    if (response.success && response.data) {
      response.data.sort(
        (a: Log, b: Log) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      console.log("logs: ", response.data);
      setLogs(response.data);
    }
  };

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (data.booking) {
      const { icon, color, textColor } = getStatusStyle(
        parseStatusBooking(data.booking)
      );
      setIcon(icon);
      setColor(color);
      setTextColor(textColor);
      updatePermission();

      const fetchRessidence = async () => {
        const response = await getResidence(
          data.booking.residence_id.toString()
        );
        if (response.success) {
          setResidence(response.data);
        }
      };
      fetchRessidence();
    }
  }, [data.booking]);
  const fetchData = async () => {
    const response = await getDetailBookingApi(id);

    if (response.success && response.data) {
      setData(response.data);

      const res = await getPolicy(response.data.booking.residence_id);

      if (res) {
        setPolicy(res.data);
      }
    }
    fetchDataLog();
  };

  const [visibleLog, setVisibleLog] = useState(false);
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleReject, setVisibleReject] = useState(false);
  const action = [
    {
      title: ActionStatusBooking.ACCEPT,
      onPress: () => {
        setVisible(true);
      },
      color: "bg-green-500",
    },
    {
      title: ActionStatusBooking.REJECT,
      onPress: () => {
        setVisibleReject(true);
      },
      color: "bg-red-500",
    },
    {
      title: ActionStatusBooking.TRANSFER,
      onPress: () => {
        const dataSolve = {
          id: parseInt(id),
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
          commission_rate: parseInt(data.booking.commission_rate),
        };
        console.log(dataSolve);

        const callApi = async () => {
          const response = await sellerTransferApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            showToast(response);
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
          id: parseInt(id),
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
          is_received: true,
        };

        const callApi = async () => {
          const response = await hostReceiveApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            showToast(response);
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
          id: parseInt(id),
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
          is_received: false,
        };

        const callApi = async () => {
          const response = await hostReceiveApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            showToast(response);
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
          id: parseInt(id),
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
        };

        const callApi = async () => {
          const response = await sellerCancelApi(dataSolve);
          if (response.success) {
            fetchData();
          } else {
            showToast(response);
          }
        };
        callApi();
      },
      color: "bg-red-500",
    },
    {
      title: ActionStatusBooking.OPENQR,
      onPress: () => {
        fetchQRCode();
        setVisibleQR(true);
      },
      color: "bg-blue-500",
    },
    {
      title: ActionStatusBooking.CHECKIN,
      onPress: () => {
        const solveData = {
          id: parseInt(id),
        };
        const callApi = async () => {
          const response = await checkinApi(solveData);
          if (response.success) {
            fetchData();
          } else {
            showToast(response);
          }
        };
        callApi();
      },
      color: "bg-green-500",
    },
    {
      title: ActionStatusBooking.CHECKOUT,
      onPress: () => {
        const solveData = {
          id: parseInt(id),
        };
        const callApi = async () => {
          const response = await checkoutApi(solveData);
          if (response.success) {
            fetchData();
          } else {
            showToast(response);
          }
        };
        callApi();
      },
      color: "bg-red-500",
    },
    {
      title: ActionStatusBooking.OPENTRACKING,
      onPress: () => {
        setVisibleLog(true);
      },
      color: "bg-blue-500",
    },
    {
      title: ActionStatusBooking.OPENDETAIL,
      onPress: () => {
        setVisibleDetail(true);
      },
      color: "bg-blue-500",
    },
    {
      title: ActionStatusBooking.UPDATE,
      onPress: () => {
        setVisibleUpdate(true);
      },
      color: "bg-blue-500",
    },
    {
      title: ActionStatusBooking.OPENPOLICY,
      onPress: () => {
        setVisiblePolicy(true);
      },
      color: "bg-blue-500",
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [id]);

  const accept = async (commission_rate: number) => {
    const dataSolve = {
      id: parseInt(id),
      accept: true,
      checkin: parseDateDDMMYYYY(data.booking.checkin),
      checkout: parseDateDDMMYYYY(data.booking.checkout),
      commission_rate: parseInt(commission_rate),
      bank_account_id: bank_account_id,
    };

    console.log(dataSolve);

    const response = await acceptBookingApi(dataSolve);
    if (response.success) {
      fetchData();
    } else {
      showToast(response);
    }
  };
  const [banks, setBanks] = useState<BankAccountsType[]>([]);

  const fetchDataBank = async () => {
    const response = await getMyBankAccountsApi();
    if (response) {
      setBanks(response.result);
    }
  };
  const [accountNo, setAccountNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bank_account_id, setBank_account_id] = useState<number | null>(null);
  const [qr, setQR] = useState<QRType | null>(null);

  useEffect(() => {
    fetchDataBank();
  }, []);

  const fetchQRCode = async () => {
    const response = await getQRCodeApi(id);
    if (response.success) {
      setQR(response.data);
    } else {
      showToast(response);
    }
  };

  const renderBankItem = (item: BankAccountsType) => {
    return (
      <TouchableOpacity
        key={item.id}
        className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3 w-full bg-white"
        activeOpacity={0.7}
        onPress={() => {
          setBank_account_id(item.id);
          setDropdownVisible(false);
        }}
      >
        <View className="flex-row items-center">
          <View className="flex-col">
            <Text className="text-gray-800 text-base font-semibold">
              {item.accountHolder}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              **** **** **** {item.accountNo.slice(-4)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-800 text-base mr-2">
            {item.bank.vnName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (bank_account_id) {
      const bank = banks.find((item) => item.id === bank_account_id);
      if (bank) {
        setAccountNo(bank.accountNo);
        setBankName(bank.bank.vnName);
        setAccountHolder(bank.accountHolder);
      }
    }
  }, [bank_account_id]);

  const scrollViewRef = useRef<ScrollView>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const captureScrollView = async () => {
    const uri = await captureRef(viewShotRef, {
      format: "jpg",
      quality: 0.8,
    });
    console.log(uri);
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);
    Alert.alert("Success", "Image saved to gallery");
  };

  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [fieldUpdate, setFieldUpdate] = useState<string[]>([]);
  useEffect(() => {
    setField(parseStatusBooking(data.booking));
  }, [data.booking]);
  const setField = (status: string) => {
    let newField = [];
    newField.push("description");
    newField.push("guest_count");
    newField.push("guest_id");
    if (status === StatusBooking.WAIT_ACCEPT) {
      newField.push("checkin");
      newField.push("checkout");
    }
    setFieldUpdate(newField);
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
  const ModalUpdate = () => {
    const [values, setValues] = useState({
      checkin: data.booking.checkin,
      checkout: data.booking.checkout,
      description: data.booking.description,
      guest_count: data.booking.guest_count,

      guest_id: data.booking.guest_id,
      guest_name: data.booking.guest_name,
      guest_phone: data.booking.guest_phone,
    });

    const elememt: Element[] = [
      {
        icon: "calendar",
        title: "Check-in",
        type: "date",
        name: "checkin",
      },
      {
        icon: "calendar",
        title: "Check-out",
        type: "date",
        name: "checkout",
      },
      {
        icon: "file-text",
        title: "Description",
        type: "text",
        name: "description",
      },
      {
        icon: "user",
        title: "Guest Count",
        type: "number",
        name: "guest_count",
      },

      {
        icon: "user",
        title: "Guest ID",
        type: "special",
        name: "guest_id",
      },
      {
        icon: "user",
        title: "Guest Name",
        type: "text",
        name: "guest_name",
      },
    ];
    interface Element {
      icon: string;
      title: string;
      type: string;
      name: keyof typeof values;
    }

    const renderElement = (item: Element) => {
      const [visibleDatePick, setVisibleDatePick] = useState(false);
      const [visibleCustomer, setVisibleCustomer] = useState(false);
      if (fieldUpdate.includes(item.name)) {
        switch (item.type) {
          case "date":
            return (
              <View className="mb-2 ">
                <Text className="text-gray-700 text-lg font-semibold ">
                  {item.title}:
                </Text>
                <TouchableOpacity
                  onPress={() => setVisibleDatePick(true)}
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
                  <Icon type={Icons.Feather} name={item.icon} size={20} />
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                  >
                    {values[item.name]}
                  </Text>
                </TouchableOpacity>
                <Modal visible={visibleDatePick} transparent>
                  <View
                    className="flex justify-center items-center flex-1"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <DateTimePicker
                      initialRange={parseDateString(values[item.name])}
                      onSuccess={(date) => {
                        setValues({
                          ...values,
                          [item.name]: parseDateDDMMYYYY(date),
                        });
                        setVisibleDatePick(false);
                      }}
                    />
                  </View>
                </Modal>
              </View>
            );
          case "text":
            return (
              <View className="mb-2">
                <Text className="text-gray-700 text-lg font-semibold ">
                  {item.title}
                </Text>
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
                  <Icon type={Icons.Feather} name={item.icon} size={20} />
                  <TextInput
                    value={values[item.name].toString()}
                    onChangeText={(text) =>
                      setValues({ ...values, [item.name]: text })
                    }
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                  />
                </View>
              </View>
            );
          case "number":
            return (
              <View className="mb-2">
                <Text className="text-gray-700 text-lg font-semibold ">
                  {item.title}
                </Text>
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
                  <Icon type={Icons.Feather} name={item.icon} size={20} />
                  <TextInput
                    value={values[item.name].toString()}
                    onChangeText={(text) =>
                      setValues({ ...values, [item.name]: text })
                    }
                    keyboardType="number-pad"
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                  />
                </View>
              </View>
            );
          case "special":
            return (
              <View className="mb-2">
                <Text className="text-gray-700 text-lg font-semibold ">
                  {t("Guest")}
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
                    width: wp(80),
                  }}
                  onPress={() => setVisibleCustomer(true)}
                >
                  <Icon type={Icons.Feather} name={item.icon} size={20} />
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                  >
                    {values["guest_name"] + " - " + values["guest_phone"]}
                  </Text>
                </TouchableOpacity>
                <Modal visible={visibleCustomer} transparent>
                  <View
                    className="flex justify-center items-center flex-1"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <View className="w-full bg-white">
                      <FlatList
                        className="w-full"
                        data={customers}
                        renderItem={({ item }) => (
                          <View
                            className="flex items-center justify-center w-full"
                            style={{
                              elevation: 2,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                setValues({
                                  ...values,
                                  guest_id: item.id,
                                  guest_name: item.name,
                                  guest_phone: item.phone,
                                });
                                setVisibleCustomer(false);
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
                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    color: "#333",
                                  }}
                                >
                                  {item.name}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: "#666",
                                    marginTop: 4,
                                  }}
                                >
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
                            {/* <DeleteConfirmationModal
                            visible={visible}
                            onConfirm={() => handleConfirmDelete(item.id)}
                            onCancel={() => setVisible(false)}
                          /> */}
                          </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                      />
                    </View>
                  </View>
                </Modal>
              </View>
            );
        }
      }
    };
    return (
      <Modal visible={visibleUpdate} transparent>
        <View
          className="flex justify-center items-center flex-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <ScrollView className="bg-white p-5  shadow-lg w-full h-full ">
            <View className="flex justify-between items-center flex-row">
              <Text className="text-2xl font-semibold mb-5">Update</Text>
              <Pressable onPress={() => setVisibleUpdate(false)}>
                <Text className="text-red-500 font-semibold text-xl">
                  {t("Close")}
                </Text>
              </Pressable>
            </View>
            <Formik
              initialValues={values}
              onSubmit={() => {
                // build data follow field update

                console.log("values: ", values);
                const dataSolve = {
                  id: parseInt(id, 10),
                  ...Object.keys(values)
                    .filter((key) => fieldUpdate.includes(key))
                    .reduce((obj, key) => {
                      obj[key] = values[key];
                      return obj;
                    }, {}),
                };
                console.log("data: ", dataSolve);
                const callApi = async () => {
                  const response = await updateBookingApi(dataSolve);

                  if (response.success) {
                    fetchData();
                    showToast(response);
                  } else {
                    showToast(response);
                  }
                };
                callApi();
                setVisibleUpdate(false);
              }}
              validate={(values) => {}}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View className="flex justify-center items-center">
                  {elememt.map((item) => renderElement(item))}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="flex items-center justify-center p-4 rounded-3xl w-full bg-blue-500 "
                    style={{
                      width: wp(80),
                    }}
                  >
                    <Text className=" text-white font-semibold text-base">
                      Update
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const ModalReject = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibleReject}
        onRequestClose={() => {
          setVisibleReject(!visibleReject);
        }}
      >
        {/* Formik with reason reject */}
        <View
          className="flex-1 justify-center items-center  bg-opacity-60"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Formik
            initialValues={{ reason: "" }}
            onSubmit={(values) => {
              const dataSolve = {
                id: parseInt(id),
                accept: false,
                checkin: parseDateDDMMYYYY(data.booking.checkin),
                checkout: parseDateDDMMYYYY(data.booking.checkout),
                reason_reject: values.reason,
              };

              console.log(dataSolve);

              const callApi = async () => {
                const response = await acceptBookingApi(dataSolve);
                if (response.success) {
                  fetchData();
                } else {
                  showToast(response);
                }
              };
              callApi();
              setVisibleReject(false);
            }}
            validate={(values) => {
              const errors: any = {};
              if (!values.reason) {
                errors.reason = t("Required");
              }
              return errors;
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View className="bg-white p-4 w-11/12 rounded-lg">
                <Text className="text-xl font-semibold text-gray-800 mb-4">
                  {t("Reason for reject")}
                </Text>
                {/* close modal */}
                <TouchableOpacity
                  onPress={() => setVisibleReject(false)}
                  className="absolute top-2 right-2"
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex flex-col items-center">
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
                      // icon for reason
                      name="closecircle"
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
                      placeholder={t("Reason for reject")}
                      onChangeText={handleChange("reason")}
                      onBlur={handleBlur("reason")}
                      value={values.reason}
                    />
                    {errors.reason && (
                      <Text style={{ color: "red" }}>{errors.reason}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  className="bg-red-500 p-4 rounded-3xl ml-2 flex justify-center items-center my-3"
                  onPress={() => handleSubmit()}
                >
                  <Text className="text-white">{t("Submit")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </Modal>
    );
  };

  const [policy, setPolicy] = useState<PolicyType | null>(null);
  const [visiblePolicy, setVisiblePolicy] = useState<boolean>(false);
  const [visibleReport, setVisibleReport] = useState<boolean>(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ModalPolicy
        visiblePolicy={visiblePolicy}
        setVisiblePolicy={setVisiblePolicy}
        policyData={policy}
      />
      <ReportModal
        visibleReport={visibleReport}
        setVisibleReport={setVisibleReport}
        reportData={data.booking}
      />
      <ModalUpdate />
      <ModalReject />
      <ScrollView>
        <Loading loading={loading} />
        <Animatable.View
          className="flex flex-row items-center px-4"
          delay={120}
          animation="slideInDown"
        >
          <BackButton navigateTo="dashboard" />
          <View className="flex flex-row items-center ">
            <View className="flex ">
              <Text className="text-3xl font-bold ">Booking Detail</Text>
            </View>
          </View>

          {idUser === data.booking.seller_id ? (
            <TouchableOpacity
              className="bg-white h-[60px] w-[60px] m-5 flex justify-center items-center"
              style={{
                borderBlockColor: Colors.primary,
                borderRadius: 16,
                borderWidth: 1,
              }}
              onPress={() => {
                setVisibleReport(true);
              }}
            >
              {/* report icon */}
              <Icon
                type={Icons.Feather}
                name="alert-triangle"
                size={24}
                color={Colors.red}
              />
            </TouchableOpacity>
          ) : null}
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
                  <Text className="font-medium">Check-in: </Text>
                  {parseDateDDMMYYYY(data.booking.checkin)}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={20} color="#4A5568" />
                <Text className="ml-2 text-gray-700">
                  <Text className="font-medium">Check-out: </Text>
                  {parseDateDDMMYYYY(data.booking.checkout)}
                </Text>
              </View>
            </View>

            {/* guest name */}
            {data.booking.guest_name ? (
              <View className="flex-row items-center mb-2">
                <Ionicons name="person" size={20} color="#4A5568" />
                <Text className="ml-2 text-gray-700">
                  <Text className="font-medium">{t("Guest")}: </Text>
                  {data.booking.guest_name} - {data.booking.guest_phone}
                </Text>
              </View>
            ) : null}
            {/* Số lượng khách */}
            <View className="flex-row items-center mb-2">
              <Icon
                type={Icons.Feather}
                name="users"
                size={20}
                color="#4A5568"
              />
              <Text className="ml-2 text-gray-700">
                <Text className="font-medium">{t("Guest Count")}: </Text>
                {data.booking.guest_count}
              </Text>
            </View>

            {/* Mô tả */}
            <View className="mb-4">
              <Text className="text-gray-700">
                <Text className="font-medium">{t("Description")}: </Text>
                {data.booking.description}
              </Text>
            </View>

            {/* total_amount and paid_amount */}
            <View className="flex-row items-center mb-2">
              <Ionicons name="cash" size={20} color="#4A5568" />
              <Text className="ml-2 text-gray-700">
                <Text className="font-medium">{t("Total Amount")}: </Text>
                {parsePrice(data.booking.total_amount)} VND
              </Text>
            </View>

            {/* Action button flow permistion */}
            <View className="flex flex-col justify-center items-center px-4 py-6">
              {permission.map((item) => {
                const actionItem = action.find(
                  (action) => action.title === item
                );
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={actionItem?.onPress}
                    className={`flex  items-center justify-center p-3 rounded-3xl ${actionItem?.color} my-1   w-full p-4`}
                  >
                    <Text className=" text-white font-semibold text-lg">
                      {t(actionItem?.title)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <EmptyData />
        )}

        {/* Detail booking */}
        <Modal visible={visibleDetail} transparent>
          <View
            className="flex flex-1 justify-center items-center bg-opacity-50"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View className="bg-white p-5 rounded-2xl shadow-lg w-11/12">
              <Text className="text-2xl font-semibold mb-5">Detail</Text>

              <ScrollView className="max-h-96">
                <FlatList
                  className="w-full m-2"
                  data={data.details}
                  renderItem={({ item, index }) => (
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
                  )}
                />
              </ScrollView>

              <View className="">
                <TouchableOpacity
                  onPress={() => setVisibleDetail(false)}
                  className="flex items-center justify-center p-4 rounded-3xl w-full bg-red-500 "
                >
                  <Text className=" text-white font-semibold text-base">
                    {t("Close")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Log */}
        <Modal visible={visibleLog} transparent>
          <View
            className="flex flex-1 justify-center items-center bg-opacity-50"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View className="bg-white p-5 rounded-2xl shadow-lg w-11/12">
              <Text className="text-2xl font-semibold mb-5">{t("Logs")}</Text>
              <ScrollView className="max-h-96">
                {logs.map((log, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center border-b border-gray-200 py-3"
                  >
                    <Image
                      source={{ uri: log.user_avatar }}
                      className="w-10 h-10 rounded-full"
                    />
                    <View className="flex flex-col ml-4">
                      <Text className="text-gray-700 text-base font-semibold">
                        {log.username}
                      </Text>
                      <Text> {moment(log?.date).fromNow()}</Text>

                      <Text className="text-gray-500 text-sm">
                        {t(parseLogsEvent(log.event_type))}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View className="">
                <TouchableOpacity
                  onPress={() => setVisibleLog(false)}
                  className="flex items-center justify-center p-4 rounded-3xl w-full bg-red-500 "
                >
                  <Text className=" text-white font-semibold text-base">
                    {t("Close")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={() => setVisible(false)}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Formik
            initialValues={{
              accountNo,
              bankName,
              accountHolder,
              commission_rate: 0,
            }}
            onSubmit={(values) => {
              accept(values.commission_rate);
              setVisible(false);
            }}
            validate={(values) => {
              const errors: any = {};
              if (!accountNo) {
                errors.accountNo = "Required";
              }
              if (!bankName) {
                errors.bankName = "Required";
              }
              if (!accountHolder) {
                errors.accountHolder = "Required";
              }
              if (values.commission_rate <= 0) {
                errors.commission_rate = "Commission > 0";
              }

              return errors;
            }}

            // validateOnChange={false}
            // validateOnBlur={false}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View
                className="flex flex-1 justify-center items-center bg-opacity-50"
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <View className="bg-white p-5 rounded-2xl shadow-lg w-11/12">
                  <Text className="text-2xl font-semibold mb-5">
                    {t("Confirm")}{" "}
                  </Text>
                  <Text className="text-gray-700 text-base">
                    {t("Please enter your bank account information")}
                  </Text>

                  <View>
                    <TouchableOpacity
                      onPress={() => setDropdownVisible(!dropdownVisible)}
                    >
                      <Text className="text-gray-700 text-base font-semibold mt-5">
                        {t("Bank Account")}
                      </Text>
                      {bankName === "" ? (
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
                            name="credit-card"
                            size={20}
                            color={Colors.primary}
                          />
                          <Text
                            style={{
                              flex: 1,
                              marginLeft: 10,
                              color: Colors.black,
                              paddingVertical: 8,
                            }}
                          >
                            {accountNo}
                          </Text>
                        </View>
                      ) : (
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
                            name="credit-card"
                            size={20}
                            color={Colors.primary}
                          />
                          <Text
                            style={{
                              flex: 1,
                              marginLeft: 10,
                              color: Colors.black,
                              paddingVertical: 8,
                            }}
                          >
                            {accountHolder}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    {errors.accountNo && (
                      <Text className="text-red-500 text-sm">
                        {errors.accountNo}
                      </Text>
                    )}
                    <Modal
                      visible={dropdownVisible}
                      transparent
                      animationType="slide"
                      onRequestClose={() => setDropdownVisible(false)}
                    >
                      <View
                        className="flex flex-1 justify-center items-center bg-opacity-50"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                      >
                        <View
                          className="bg-white rounded-2xl shadow-lg p-5"
                          style={{
                            width: "90%",
                          }}
                        >
                          <FlatList
                            data={banks}
                            renderItem={({ item }) => renderBankItem(item)}
                            keyExtractor={(item) => item.id.toString()}
                          />
                        </View>
                      </View>
                    </Modal>
                  </View>
                  <Text className="text-gray-700 text-base font-semibold mt-5">
                    {t("Commission Rate")}
                  </Text>
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
                      name="percent"
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
                      value={values.commission_rate.toString()}
                      placeholder="Commission Rate"
                      onChangeText={handleChange("commission_rate")}
                    />
                    {errors.commission_rate && (
                      <Text style={{ color: "red" }}>
                        {errors.commission_rate}
                      </Text>
                    )}
                  </View>

                  <View className="flex flex-col justify-center items-center mt-5">
                    <TouchableOpacity
                      onPress={() => {
                        handleSubmit();
                      }}
                      className="flex items-center justify-center p-4 rounded-3xl bg-green-500 w-full mb-3 "
                    >
                      <Text className=" text-white font-semibold text-lg">
                        {t("Confirm")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      className="flex items-center justify-center p-4 rounded-3xl bg-red-500 w-full"
                    >
                      <Text className=" text-white font-semibold text-lg">
                        {t("Cancel")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </Modal>
        <Modal visible={visibleQR} transparent>
          <ScrollView
            ref={scrollViewRef}
            className="flex flex-1 bg-opacity-50"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
              <View className="bg-white p-5 rounded-2xl shadow-lg w-11/12">
                <Text className="text-2xl font-semibold mb-5">
                  {" "}
                  {t("Bill")}
                </Text>
                {qr ? (
                  <View className="flex items-center justify-center w-full">
                    <View>
                      <View className="flex items-center justify-center">
                        <Text className=" font-semibold text-2xl">
                          {residence?.residence_name}
                        </Text>
                      </View>

                      {/* residence address */}
                      <Text className="text-gray-700 text-base font-semibold mt-2">
                        {t("Address")}: {residence?.residence_address} ,{" "}
                        {residence?.ward} , {residence?.district} ,{" "}
                        {residence?.province}
                      </Text>
                    </View>

                    <View className="flex flex-row items-center justify-between  mt-5 w-full">
                      <View className="flex flex-row items-center">
                        <Text className="text-gray-700 text-sm font-semibold">
                          {t("Day")} :{" "}
                        </Text>
                        <Text className="text-sm">
                          {parseDateDDMMYYYY(data.booking.updated_at)}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center">
                        <Text className="text-gray-700 text-sm font-semibold">
                          {t("Time")} :{" "}
                        </Text>
                        <Text className="text-sm">
                          {moment(data.booking.updated_at).format("HH:mm")}
                        </Text>
                      </View>
                    </View>

                    {/* Booking information */}
                    <View className="flex flex-row items-center justify-between mt-5 w-full">
                      <View>
                        <View className="flex flex-row">
                          <Text className="text-gray-700 text-sm font-semibold">
                            {t("Check-in")} :{" "}
                          </Text>
                          <Text className="text-gray-700 text-sm ">
                            {parseDateDDMMYYYY(data.booking.checkin)}
                          </Text>
                        </View>
                        <View className="flex flex-row">
                          <Text className="text-gray-700 text-sm font-semibold">
                            {t("Check-out")} :{" "}
                          </Text>
                          <Text className="text-gray-700 text-sm ">
                            {parseDateDDMMYYYY(data.booking.checkout)}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View className="flex flex-row justify-between items-center ">
                          <View className="flex flex-row items-center">
                            <Ionicons name={icon} size={24} color={color} />
                            <Text className={`font-medium ${textColor}`}>
                              {parseStatusBooking(data.booking)}
                            </Text>
                          </View>
                        </View>
                        {/* <Text className="text-gray-700 text-sm font-semibold">
                        {t("Total")} : {parsePrice(qr.final_amount)} VND
                      </Text> */}
                      </View>
                    </View>

                    <ScrollView className="">
                      {/* date and price from detail */}
                      <FlatList
                        data={data.details}
                        ListHeaderComponent={() => (
                          <View className="flex flex-row justify-between items-center border-b border-gray-200 py-3 w-full">
                            <Text className="text-gray-700 text-base font-semibold">
                              {t("Date")}
                            </Text>
                            <Text className="text-gray-700 text-base font-semibold">
                              {t("Price")}
                            </Text>
                          </View>
                        )}
                        renderItem={({ item }) => (
                          <View className="flex flex-row items-center justify-between border-b border-gray-200 py-3 w-full">
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
                        )}
                      />
                    </ScrollView>

                    {/* To */}
                    <View className="flex flex-row items-center justify-between mt-5 w-full">
                      <Text className="text-gray-700 text-base font-semibold">
                        {t("Total")}
                      </Text>
                      <Text className="text-gray-700 text-base font-semibold">
                        {parsePrice(qr.total_amount)} VND
                      </Text>
                    </View>

                    {/* commission_rate */}
                    <View className="flex flex-row items-center justify-between mt-5 w-full">
                      <Text className="text-gray-700 text-base font-semibold">
                        {t("Commission Rate")}
                      </Text>
                      <Text className="text-gray-700 text-base font-semibold">
                        {qr.commission_rate} %
                      </Text>
                    </View>

                    {/* line */}
                    <View className="border-b border-gray-500 my-3  "></View>
                    {/* total */}
                    <View className="flex flex-row items-center justify-between mt-5 w-full">
                      <Text className="text-gray-700 text-base font-semibold">
                        {t("Total")}
                      </Text>
                      <Text className="text-gray-700 text-base font-semibold">
                        {parsePrice(qr.final_amount)} VND
                      </Text>
                    </View>

                    <Image
                      source={{ uri: qr.qr }}
                      className="w-64 h-64"
                      resizeMode="contain"
                    />
                    <Text className="text-gray-700 text-base font-semibold mt-5">
                      {qr.account_holder}
                    </Text>
                    <Text className="text-gray-700 text-base font-semibold mt-2">
                      {qr.account_no}
                    </Text>
                    <Text className="text-gray-700 text-base font-semibold mt-2">
                      {qr.fullname_bank_vn}
                    </Text>
                  </View>
                ) : null}
                <View className="flex flex-row justify-between mt-5">
                  <TouchableOpacity
                    onPress={() => captureScrollView()}
                    className="flex items-center justify-center p-3 rounded-lg bg-green-500"
                  >
                    <Text className=" text-white font-semibold text-sm">
                      Save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setVisibleQR(false)}
                    className="flex items-center justify-center p-3 rounded-lg bg-red-500"
                  >
                    <Text className=" text-white font-semibold text-sm">
                      {t("Close")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ViewShot>
          </ScrollView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetail;
