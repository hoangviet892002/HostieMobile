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
} from "@/apis/booking";
import { getMyBankAccountsApi } from "@/apis/users";
import { BackButton, EmptyData, Loading } from "@/components";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { Roles } from "@/constants/enums/roles";
import {
  ActionStatusBooking,
  StatusBooking,
} from "@/constants/enums/statusBookingEnums";
import { getStatusStyle } from "@/constants/getStatusStyle";
import useToast from "@/hooks/useToast";
import { selectRole } from "@/redux/slices/authSlice";
import {
  BankAccountsType,
  BookingType,
  DetailBookingType,
  QRType,
} from "@/types";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { parseStatusBooking } from "@/utils/parseStatusBooking";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import * as Animatable from "react-native-animatable";

import { SafeAreaView } from "react-native-safe-area-context";
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
    },
  } as Data);
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id } = route.params;
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [textColor, setTextColor] = useState("");

  const role = useSelector(selectRole);
  const [permission, setPermission] = useState<string[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [visibleQR, setVisibleQR] = useState(false);

  const [logs, setLogs] = useState<Log[]>([]);
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
        newPermissions.push(ActionStatusBooking.OPENQR);
      }
    } else if (role === Roles.ROLE_HOUSEKEEPER) {
      const status = parseStatusBooking(data.booking);
      if (status === StatusBooking.SUCCESS) {
        newPermissions.push(ActionStatusBooking.CHECKIN);
      }
      if (status === StatusBooking.CHECKIN) {
        newPermissions.push(ActionStatusBooking.CHECKOUT);
      }
    }

    setPermission(newPermissions);
  };

  const fetchDataLog = async () => {
    const response = await getLogApi(id);

    if (response.success && response.data) {
      response.data.sort(
        (a: Log, b: Log) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
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
    }
  }, [data.booking]);
  const fetchData = async () => {
    const response = await getDetailBookingApi(id);

    if (response.success && response.data) {
      setData(response.data);
    }
    fetchDataLog();
  };
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
        const dataSolve = {
          id: parseInt(id),
          accept: false,
          checkin: parseDateDDMMYYYY(data.booking.checkin),
          checkout: parseDateDDMMYYYY(data.booking.checkout),
          commission_rate: parseInt("1"),
          bank_account_id: 25,
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Loading loading={loading} />
        <Animatable.View
          className="flex flex-row items-center px-4"
          delay={120}
          animation="slideInDown"
        >
          <BackButton navigateTo="(tabs)" />
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
                  <Text className="font-medium">Check-in:</Text>
                  {parseDateDDMMYYYY(data.booking.checkin)}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={20} color="#4A5568" />
                <Text className="ml-2 text-gray-700">
                  <Text className="font-medium">Check-out:</Text>
                  {parseDateDDMMYYYY(data.booking.checkout)}
                </Text>
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="sunny-outline" size={20} color="#4A5568" />
                <Text className="ml-2 text-gray-700">
                  <Text className="font-medium">Số ngày:</Text>
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
                <Text className="text-gray-600">
                  {data.booking.description}
                </Text>
              </View>
            ) : null}

            {/* Action button flow permistion */}
            <View className="flex flex-row justify-between items-center space-x-4 px-4 py-6">
              {permission.map((item) => {
                const actionItem = action.find(
                  (action) => action.title === item
                );
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

        {/* Detail booking */}

        {data.details && data.details.length > 0 ? (
          <ScrollView className="bg-white p-6 mx-4 rounded-2xl shadow-lg max-h-56">
            <Text className="text-2xl font-semibold text-gray-800 mb-5">
              Booking Details
            </Text>
            {data.details.map((item, index) => (
              <View
                key={index}
                className="flex flex-row justify-between items-center border-b border-gray-200 py-3"
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
            ))}
          </ScrollView>
        ) : (
          <></>
        )}

        {/* Log */}
        {logs && logs.length > 0 ? (
          <ScrollView className="bg-white p-6 mx-4 rounded-2xl shadow-lg mt-4">
            <Text className="text-2xl font-semibold text-gray-800 mb-5">
              Logs
            </Text>
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
                    {log.event_type}
                  </Text>
                  {/* {log.data_change.map((item, index) => (
                    <Text key={index} className="text-gray-500 text-sm">
                      {item.field} changed from {item.old_value} to{" "}
                      {item.new_value}
                    </Text>
                  ))} */}
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <></>
        )}
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
                  <Text className="text-2xl font-semibold mb-5">Confirm</Text>
                  <Text className="text-gray-700 text-base">
                    Are you sure you want to accept this booking?
                  </Text>

                  <View>
                    <TouchableOpacity
                      onPress={() => setDropdownVisible(!dropdownVisible)}
                    >
                      <Text className="text-gray-700 text-base font-semibold mt-5">
                        Bank Account
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
                    Commission Rate
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

                  <View className="flex flex-row justify-end mt-5">
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      className="flex items-center justify-center p-3 rounded-lg bg-red-500"
                    >
                      <Text className=" text-white font-semibold text-sm">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleSubmit();
                      }}
                      className="flex items-center justify-center p-3 rounded-lg bg-green-500 ml-4"
                    >
                      <Text className=" text-white font-semibold text-sm">
                        Accept
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </Modal>
        <Modal visible={visibleQR} transparent>
          <View
            className="flex flex-1 justify-center items-center bg-opacity-50"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View className="bg-white p-5 rounded-2xl shadow-lg w-11/12">
              <Text className="text-2xl font-semibold mb-5">QR Code</Text>
              {qr ? (
                <View className="flex items-center justify-center">
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
                  <Text className="text-gray-700 text-base font-semibold mt-2">
                    {qr.final_amount} VND
                  </Text>
                </View>
              ) : null}
              <View className="flex flex-row justify-end mt-5">
                <TouchableOpacity
                  onPress={() => setVisibleQR(false)}
                  className="flex items-center justify-center p-3 rounded-lg bg-red-500"
                >
                  <Text className=" text-white font-semibold text-sm">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetail;
