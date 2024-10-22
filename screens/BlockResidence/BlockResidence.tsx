import { deleteBlockApi, getBlocksApi, postBlockApi } from "@/apis/residences";
import { BackButton, DateRangePicker, Loading } from "@/components";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { ResidenceBlock } from "@/types";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
type RouteParams = {
  params: {
    itemId: string;
    name: string;
  };
};
const BlockResidence = () => {
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<ResidenceBlock[]>([]);

  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { itemId, name } = route.params;
  const [dataBlock, setDataBlock] = useState({
    residence_id: itemId,
    start_date: new Date(),
    //  tomorrow
    end_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    reason: "",
  });

  // Mock data
  useFocusEffect(
    useCallback(() => {
      getBlocks();
    }, [])
  );
  const getBlocks = async () => {
    setLoading(true);
    const res = await getBlocksApi(itemId);
    if (res.success) {
      if (res.data.residence_block !== null) {
        setBlocks(res.data.residence_block);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Cannot get blocks",
      });
    }
    setLoading(false);
  };
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const [modalVisible, setModalVisible] = useState(false);
  const ModalAdd = () => {
    const [loadingAtModal, setLoadingAtModal] = useState(false);
    const [openModalDateRange, setOpenModalDateRange] = useState(false);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Loading loading={loadingAtModal} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View className="bg-white p-6 rounded-lg w-11/12">
            <View className="flex justify-center items-center mb-4">
              <Text className="text-2xl font-bold">{name}</Text>
            </View>

            <Formik
              initialValues={dataBlock}
              validate={(values) => {
                const errors: any = {};
                if (!values.reason) {
                  errors.reason = "Required";
                }
                if (!values.start_date) {
                  errors.start_date = "Required";
                }
                if (!values.end_date) {
                  errors.end_date = "Required";
                }
                return errors;
              }}
              onSubmit={async (values) => {
                setLoadingAtModal(true);
                const data = {
                  residence_id: parseInt(itemId),
                  reason: values.reason,

                  start_date: formatDate(values.start_date),
                  end_date: formatDate(values.end_date),
                };
                const res = await postBlockApi(data);
                console.log(res);

                if (res.success) {
                  Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Add block successfully",
                  });
                  getBlocks();
                } else {
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Cannot add block",
                  });
                }
                setModalVisible(false);
                setLoadingAtModal(false);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
              }) => (
                <>
                  {/* Reason Field */}
                  <Text className="mb-1">Reason</Text>
                  <TextInput
                    className="bg-white p-2 rounded-lg border-2 my-2"
                    style={{
                      borderColor:
                        errors.reason && touched.reason
                          ? "red"
                          : Colors.primary,
                    }}
                    onChangeText={handleChange("reason")}
                    onBlur={handleBlur("reason")}
                    value={values.reason}
                    placeholder="Nhập lý do"
                  />
                  {errors.reason && touched.reason && (
                    <Text className="text-red-500 text-sm mb-2">
                      {errors.reason}
                    </Text>
                  )}

                  {/* Date Range Field */}
                  <Text className="mb-1">Date Range</Text>
                  <TouchableOpacity
                    className="bg-white p-2 rounded-lg border-2 my-2"
                    style={{
                      borderColor:
                        errors.start_date && touched.start_date
                          ? "red"
                          : Colors.primary,
                    }}
                    onPress={() => setOpenModalDateRange(true)}
                  >
                    <Text>
                      {values.start_date && values.end_date
                        ? `${values.start_date.toLocaleDateString(
                            "en-GB"
                          )} - ${values.end_date.toLocaleDateString("en-GB")}`
                        : "Select Date Range"}
                    </Text>
                  </TouchableOpacity>
                  {errors.start_date && touched.start_date && (
                    <Text className="text-red-500 text-sm mb-2">
                      {typeof errors.start_date === "string" &&
                        errors.start_date}
                    </Text>
                  )}

                  {/* Date Range Picker Modal */}
                  <Modal visible={openModalDateRange} transparent={true}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <View className="">
                        <DateRangePicker
                          initialRange={[
                            values.start_date ? values.start_date : new Date(),
                            values.end_date
                              ? values.end_date
                              : new Date(
                                  new Date().getTime() + 24 * 60 * 60 * 1000
                                ),
                          ]}
                          onSuccess={(start, end) => {
                            setFieldValue("start_date", start);
                            setFieldValue("end_date", end);
                            setOpenModalDateRange(false);
                          }}
                        />
                      </View>
                    </View>
                  </Modal>

                  {/* Buttons */}
                  <View className="flex flex-row ">
                    <TouchableOpacity
                      className="bg-white p-2 rounded-lg border-2 my-2 flex-1 items-center justify-center mr-2"
                      style={{ borderColor: Colors.primary }}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text className="text-primary font-semibold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-primary p-2 rounded-lg border-2 my-2 flex-1 items-center justify-center ml-2"
                      onPress={() => {
                        handleSubmit();
                      }}
                    >
                      <Text className="text-black font-semibold">Add</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    );
  };
  const onDelete = async (id: string) => {
    const res = await deleteBlockApi(id);
    if (res.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Delete block successfully",
      });
      getBlocks();
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Cannot delete block",
      });
    }
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
            <Text className="text-3xl font-bold ">Block</Text>
          </View>
          {/* Add Block button */}
          <TouchableOpacity
            className="p-2 rounded-lg h-[50px] w-[100px] items-center justify-center m-2"
            style={{ backgroundColor: Colors.primary }}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text className="text-white font-semibold">Add Block</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* Block List */}
      <View className="flex-1 p-4 bg-gray-100">
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <View
              key={index}
              className="bg-white p-4 rounded-lg flex-row items-start justify-between mb-4 shadow-md"
              style={{ elevation: 5, shadowColor: Colors.primary }}
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  Lý do: {block.reason}
                </Text>
                <Text className="text-sm text-gray-600">
                  Ngày bắt đầu: {block.start_date}
                </Text>
                <Text className="text-sm text-gray-600">
                  Ngày kết thúc: {block.end_date}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onDelete(block.id)}
                className="flex-row items-center bg-red-500 p-2 mt-2 rounded-lg"
                activeOpacity={0.7} // Thêm hiệu ứng khi nhấn
              >
                <Feather name="trash-2" size={20} color="#fff" />
                <Text className="text-white ml-2">Xóa</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="flex-1 justify-center items-center">
            <Icon
              type={Icons.Feather}
              name="info"
              size={24}
              color={Colors.primary}
            />
            <Text className="mt-4 text-lg text-gray-600">No data</Text>
          </View>
        )}
      </View>
      <ModalAdd />
    </SafeAreaView>
  );
};

export default BlockResidence;
