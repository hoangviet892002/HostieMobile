import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { PackageType, RegisterType } from "@/types";
import { getPackagesApi } from "@/apis/package";
import { Loading } from "@/components";
import { Colors } from "@/constants/Colors";
import { getRegistersApi, postRegisterApi } from "@/apis/registers";
import { useFocusEffect } from "expo-router";
import Toast from "react-native-toast-message";
import { getURLPaymentApi } from "@/apis/payment";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
const Package = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState("");

  const fetchPackages = async (pageNumber = 0) => {
    if (pageNumber === 1) {
      setLoading(true);
    }
    const response = await getPackagesApi(pageNumber);

    if (response) {
      if (pageNumber === 1) {
        setPackages(response.result);
        setTotalPage(response.totalPages);
      } else {
        setPackages((prevPackages) => [...prevPackages, ...response.result]);
        setTotalPage(response.totalPages);
      }
    }
    setLoading(false);
  };

  const loadMorePackages = () => {
    if (page < totalPage - 1 && !loading) {
      setPage((prevPage) => prevPage + 1);
      fetchPackages(page);
    }
  };

  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );

  const [visible, setVisible] = useState(false);
  const renderItem = ({ item }: { item: PackageType }) => (
    <View
      className="rounded-lg p-6 m-4 w-64 h-64"
      style={{ backgroundColor: Colors.primary }}
    >
      <Text className="text-lg font-bold text-white mb-2">{item.name}</Text>
      <Text className="text-sm text-white mb-4">{item.description}</Text>
      <View className="space-y-2 mb-4">
        <Text className="text-sm text-white">
          • Duration: {item.duration} month(s)
        </Text>
        <Text className="text-sm text-white">
          • Price: {item.price.toLocaleString("vi-VN")} VND
        </Text>
      </View>
      <TouchableOpacity
        className="bg-yellow-400 rounded-full py-2 items-center mt-4"
        onPress={() => {
          setSelectedPackage(item);
          setVisible(true);
        }}
      >
        <Text className="text-white">Buy</Text>
      </TouchableOpacity>
    </View>
  );

  const handleBuyPackage = async () => {
    const data = {
      packageId: selectedPackage?.id,
      userId: 1,
    };

    const response = await postRegisterApi(data);
    if (response.code === 1000) {
      const res = await getURLPaymentApi(response.result.id);
      if (res.code === 1000) {
        setPaymentUrl(res.result.paymentUrl);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.message,
          position: "top",
        });
      }
      fetchRegisters(0);
      setVisible(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.message,
        position: "top",
      });
      setVisible(false);
    }
  };
  const ModalRenderBuyPackage = () => {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center bg-opacity-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View className="bg-white p-4 w-80 rounded-lg">
            <Text className="text-lg font-bold text-gray-500 mb-2">
              {selectedPackage?.name}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              {selectedPackage?.description}
            </Text>
            <View className="mb-4">
              <Text className="text-sm text-gray-500">
                • Duration: {selectedPackage?.duration} month(s)
              </Text>
              <Text className="text-sm text-gray-500">
                • Price: {selectedPackage?.price.toLocaleString("vi-VN")} VND
              </Text>
            </View>
            <TouchableOpacity
              className="bg-yellow-400 rounded-full py-2 items-center mt-4"
              onPress={() => {
                handleBuyPackage();
                setVisible(false);
              }}
            >
              <Text className="text-white">Buy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-400 rounded-full py-2 items-center mt-4"
              onPress={() => setVisible(false)}
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const [resgiters, setRegisters] = useState<RegisterType[]>([]);
  const [pageRegister, setPageRegister] = useState(0);

  const [totalPageRegister, setTotalPageRegister] = useState(0);

  const fetchRegisters = async (pageNumber = 0) => {
    if (pageNumber === 1) {
      setLoading(true);
    }
    const response = await getRegistersApi(pageNumber);
    if (response) {
      if (pageNumber === 1) {
        setRegisters(response.result);
        setTotalPageRegister(response.totalPages);
      } else {
        setRegisters((prevRegisters) => [...prevRegisters, ...response.result]);

        setTotalPageRegister(response.totalPages);
      }
    }
    setLoading(false);
  };

  const loadMoreRegisters = () => {
    if (pageRegister < totalPageRegister - 1 && !loading) {
      setPageRegister((prevPage) => prevPage + 1);
      fetchRegisters(pageRegister);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPageRegister(0);
      fetchRegisters(0);
      setPage(0);
      fetchPackages(0);
    }, [])
  );
  const RegisterCard = ({ item }: { item: RegisterType }) => {
    const expirationDate = new Date(
      item.expireAt[0], // Year
      item.expireAt[1] - 1, // Month (0-based index)
      item.expireAt[2] // Day
    ).toLocaleDateString();

    return (
      <View
        className="rounded-lg p-4 m-4 w-72 shadow-lg"
        style={{ backgroundColor: Colors.primary }}
      >
        <Text className="text-lg font-bold text-white mb-2">
          {item.packageInfo.name}
        </Text>
        <Text className="text-sm text-white mb-4">
          {item.packageInfo.description}
        </Text>
        <View className="mb-4">
          <Text className="text-sm text-white">
            • Duration: {item.packageInfo.duration} month(s)
          </Text>
          <Text className="text-sm text-white">
            • Price: {item.packageInfo.price.toLocaleString("vi-VN")} VND
          </Text>
          <Text className="text-sm text-white">
            • Total Amount Paid: {item.totalAmount.toLocaleString("vi-VN")} VND
          </Text>
          <Text className="text-sm text-white">
            • Expiration Date: {expirationDate}
          </Text>
          <Text className="text-sm text-white">
            • Status: {item.registerStatus}
          </Text>
        </View>
        <TouchableOpacity className="bg-yellow-400 rounded-full py-2 items-center mt-4">
          <Text className="text-white font-semibold">
            {item.active ? "Active" : "Renew"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        {paymentUrl !== "" ? (
          <View style={{ flex: 1 }}>
            <WebView
              source={{ uri: paymentUrl }}
              // onNavigationStateChange={(navState) => {
              //   // Kiểm tra URL hiện tại để xác định khi nào giao dịch hoàn tất
              //   if (navState.url.includes("vnp_ReturnUrl")) {
              //     // Xử lý kết quả thanh toán
              //   }
              // }}
            />
          </View>
        ) : (
          <>
            <Loading loading={loading} />
            <View className="flex-1 bg-gray-100 flex justify-center items-center">
              <FlatList
                horizontal
                data={packages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
                onEndReached={loadMorePackages}
                onEndReachedThreshold={0.5}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View className="flex-1 bg-gray-100 flex justify-center items-center">
              <Text className="text-2xl font-bold text-gray-500 mb-4">
                Registers
              </Text>
              <FlatList
                data={resgiters}
                renderItem={RegisterCard}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
                onEndReached={loadMoreRegisters}
                onEndReachedThreshold={0.5}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <ModalRenderBuyPackage />
          </>
        )}
      </View>
    </>
  );
};

export default Package;
