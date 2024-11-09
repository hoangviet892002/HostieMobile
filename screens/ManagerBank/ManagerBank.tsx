import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Bank, BankAccountsType } from "@/types";
import { useFocusEffect } from "expo-router";
import {
  deleteBankAccountApi,
  editBankAccountApi,
  getMyBankAccountsApi,
  postBankAccountApi,
} from "@/apis/users";
import { Loading } from "@/components";
import { FlatList } from "react-native";

import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Formik } from "formik";
import { getBanksApi } from "@/apis/bank";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { use } from "i18next";
import { selectUserId } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

const ManagerBank = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccountsType[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<BankAccountsType | null>(
    null
  );

  const userID = useSelector(selectUserId);
  const [banks, setBanks] = useState<Bank[]>([]);

  const fetchBankAccounts = async () => {
    setLoading(true);
    const res = await getMyBankAccountsApi();

    if (res.code === 1000) {
      setBankAccounts(res.result);
    }
    setLoading(false);
  };

  const fetchBanks = async () => {
    const res = await getBanksApi();
    if (res.code === 1000) {
      setBanks(res.result);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchBanks();
      fetchBankAccounts();
    }, [])
  );

  const handleAddBank = async (values: any) => {
    const res = await postBankAccountApi(values, userID);
    if (res.code === 1000) {
      fetchBankAccounts();
      setVisible(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
    }
  };

  const handleEditBank = async (values: any) => {
    console.log(values);
    const res = await editBankAccountApi(values, userID, values.id);
    console.log(res);
    if (res.code === 1000) {
      fetchBankAccounts();
      setVisible(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
    }
  };

  const ModalAddorEdit = () => {
    const [visibleBankOption, setVisibleBankOption] = useState<boolean>(false);
    const ModalSelectBank = ({ setFieldValue }) => {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visibleBankOption}
          onRequestClose={() => {
            setVisibleBankOption(false);
          }}
        >
          <View
            className="flex-1 bg-opacity-50 items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <View className="bg-white w-11/12 p-4 rounded-lg">
              <Text className="text-center text-lg font-semibold text-gray-800">
                Select Bank
              </Text>
              <Pressable
                className="absolute top-2 right-2"
                onPress={() => setVisibleBankOption(false)}
              >
                <Icon
                  type={Icons.Feather}
                  name="x"
                  size={24}
                  color={Colors.gray}
                />
              </Pressable>
              <FlatList
                data={banks}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setFieldValue("bankId", item.id);
                      setFieldValue("bankName", item.enName);
                      setVisibleBankOption(false);
                    }}
                  >
                    {renderOptionBank(item)}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          </View>
        </Modal>
      );
    };
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View
          className="flex-1 bg-opacity-50 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="bg-white w-11/12 p-4 rounded-lg">
            <Text className="text-center text-lg font-semibold text-gray-800">
              {selectedBank ? "Edit Bank Account" : "Add Bank Account"}
            </Text>
            <Pressable
              className="absolute top-2 right-2"
              onPress={() => setVisible(false)}
            >
              <Icon
                type={Icons.Feather}
                name="x"
                size={24}
                color={Colors.gray}
              />
            </Pressable>
            <Formik
              initialValues={{
                id: selectedBank?.id || -1,
                accountHolder: selectedBank?.accountHolder || "",
                accountNo: selectedBank?.accountNo || "",
                bankId: selectedBank?.bank.id || -1,
                bankName: selectedBank?.bank.enName || "",
              }}
              onSubmit={(values) => {
                if (selectedBank) {
                  const data = {
                    id: values.id,
                    accountHolder: values.accountHolder,
                    accountNo: values.accountNo,
                    bankId: values.bankId,
                    status: selectedBank.status,
                  };
                  handleEditBank(data);
                  return;
                }

                const data = {
                  accountHolder: values.accountHolder,
                  accountNo: values.accountNo,
                  bankId: values.bankId,
                };
                handleAddBank(data);
              }}
              validate={(values) => {
                const errors: any = {};
                if (!values.accountHolder) {
                  errors.accountHolder = "Required";
                }
                if (!values.accountNo) {
                  errors.accountNo = "Required";
                }
                if (!values.bankName) {
                  errors.bankId = "Required";
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
                setFieldValue,
              }) => (
                <View>
                  <ModalSelectBank setFieldValue={setFieldValue} />
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
                      width: "100%",
                    }}
                  >
                    <Icon
                      type={Icons.Feather}
                      name="user"
                      size={20}
                      color={Colors.primary}
                    />

                    <TextInput
                      placeholder="Account Holder"
                      value={values.accountHolder}
                      onChangeText={(text) => {
                        setFieldValue("accountHolder", text);
                      }}
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        color: Colors.black,
                        paddingVertical: 8,
                      }}
                    />
                    {errors.accountHolder && (
                      <Text className="text-red-500">
                        {errors.accountHolder}
                      </Text>
                    )}
                  </View>

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
                      width: "100%",
                    }}
                  >
                    <Icon
                      type={Icons.MaterialCommunityIcons}
                      name="credit-card"
                      size={20}
                      color={Colors.primary}
                    />
                    <TextInput
                      placeholder="Account No"
                      value={values.accountNo}
                      onChangeText={(text) => {
                        setFieldValue("accountNo", text);
                      }}
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        color: Colors.black,
                        paddingVertical: 8,
                      }}
                      keyboardType="numeric"
                    />
                    {errors.accountNo && (
                      <Text className="text-red-500">{errors.accountNo}</Text>
                    )}
                  </View>

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
                      width: "100%",
                    }}
                  >
                    <Icon
                      type={Icons.MaterialCommunityIcons}
                      name="bank"
                      size={20}
                      color={Colors.primary}
                    />
                    <TouchableOpacity
                      onPress={() => setVisibleBankOption(true)}
                      style={{
                        flex: 1,
                        marginLeft: 10,

                        paddingVertical: 8,
                      }}
                    >
                      <Text>{values.bankName || "Select Bank"}</Text>
                    </TouchableOpacity>
                    {errors.bankId && (
                      <Text className="text-red-500">{errors.bankId}</Text>
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                      className="flex items-center justify-center w-full h-12 rounded-2xl"
                      style={{
                        backgroundColor: Colors.primary,
                      }}
                    >
                      <Text style={{ color: Colors.white }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    );
  };

  const renderOptionBank = (item: Bank) => {
    return (
      <View className=" flex flex-row h-[100px] items-center border-b border-gray-200">
        <View className="mr-2 p-2 bg-green-300 rounded-full w-[70px] h-[70px] flex justify-center items-center">
          <Icon
            type={Icons.MaterialCommunityIcons}
            name="bank"
            size={24}
            color={Colors.primary}
          />
        </View>
        <View className="flex flex-col">
          <Text className="text-gray-800 text-base font-semibold">
            {item.shortName}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">{item.enName}</Text>
        </View>
      </View>
    );
  };

  const renderBankAccount = ({ item }: { item: BankAccountsType }) => {
    return (
      <Swipeable renderRightActions={() => renderRightActions()}>
        <TouchableOpacity
          key={item.id}
          className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3 w-full bg-white"
          onPress={() => {
            setSelectedBank(item);
            setVisible(true);
          }}
        >
          <View className="flex-row items-center">
            <View className="mr-2 p-2 bg-green-300 rounded-full">
              <Icon
                type={Icons.MaterialCommunityIcons}
                name="bank"
                size={24}
                color={Colors.primary}
              />
            </View>

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
              {item.bank.shortName}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        className="bg-red-300 justify-center items-center w-20 h-20"
        onPress={async () => {
          const res = await deleteBankAccountApi(
            userID,
            selectedBank?.id || -1
          );
          if (res.code === 1000) {
            fetchBankAccounts();
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: res.message,
            });
          }
        }}
      >
        <Icon
          type={Icons.Feather}
          name="trash"
          size={24}
          color={Colors.white}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View className="flex-1">
      <Loading loading={loading} />
      <FlatList
        data={bankAccounts}
        renderItem={renderBankAccount}
        keyExtractor={(item) => item.id.toString()}
      />
      <ModalAddorEdit />

      {/*  absolut button add with icon */}
      <TouchableOpacity
        className="rounded-full w-12 h-12 items-center justify-center"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: Colors.primary,
        }}
        onPress={() => {
          console.log("add bank account");
          setSelectedBank(null);
          setVisible(true);
        }}
      >
        <Icon type={Icons.Feather} name="plus" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default ManagerBank;
