import { getPackagesApi } from "@/apis/package";
import { getRegistersApi, postRegisterApi } from "@/apis/registers";
import { Loading } from "@/components";
import { Colors } from "@/constants/Colors";
import { PackageType, RegisterType } from "@/types";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";

import Icon, { Icons } from "@/components/Icons";
const Package = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState("");

  const fetchPackages = async (pageNumber = 0) => {
    if (pageNumber === 0) {
      setLoading(true);
    }
    const response = await getPackagesApi(pageNumber);

    if (response) {
      if (pageNumber === 0) {
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
      className="rounded-3xl p-0 m-4 w-72 h-[400px] shadow-xl overflow-hidden"
      style={{
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 15,
      }}
    >
      {/* Image Header */}
      <Image
        source={{ uri: "https://picsum.photos/200/300" }}
        className="w-full h-40"
        style={{ resizeMode: "cover" }}
      />

      {/* Content Container */}
      <View className="p-5">
        {/* Package Name */}
        <Text className="text-xl font-extrabold text-gray-800 mb-2">
          {item.name}
        </Text>

        {/* Package Description */}
        <Text className="text-sm text-gray-600 mb-4">{item.description}</Text>

        {/* Package Details */}
        <View className="space-y-2 mb-4">
          <Text className="text-sm text-gray-700 flex items-center">
            <Icon
              type={Icons.MaterialIcons}
              name="schedule"
              size={16}
              color="#4A90E2"
            />
            <Text className="ml-2 font-medium">
              Duration: {item.duration} month(s)
            </Text>
          </Text>
          <Text className="text-sm text-gray-700 flex items-center">
            <Icon
              type={Icons.MaterialIcons}
              name="attach-money"
              size={16}
              color="#4A90E2"
            />
            <Text className="ml-2 font-medium">
              Price: {item.price.toLocaleString("vi-VN")} VND
            </Text>
          </Text>
        </View>

        {/* Buy Button */}
        <TouchableOpacity
          className="rounded-full py-3 items-center mt-auto shadow-md"
          style={{
            shadowColor: "#4A90E2",
            shadowOpacity: 0.3,
            backgroundColor: Colors.primary,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 10,
          }}
          onPress={() => {
            setSelectedPackage(item);
            setVisible(true);
          }}
        >
          <Text className="text-lg font-semibold text-white">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleBuyPackage = async () => {
    const data = {
      packageId: selectedPackage?.id,
      userId: 1,
    };

    const response = await postRegisterApi(data);
    if (response.code === 1000) {
      console.log(response.result.paymentUrl);
      setPaymentUrl(response.result.paymentUrl);

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
          <View
            className="bg-white p-4 rounded-lg w-80"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 5 },
              shadowRadius: 15,
            }}
          >
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Confirm Purchase
            </Text>
            <Text className="text-sm text-gray-600 mb-4">
              Are you sure you want to buy this package?
            </Text>
            <View className="flex flex-row justify-between">
              <TouchableOpacity
                className="bg-red-400 rounded-full py-2 px-4 items-center"
                onPress={() => setVisible(false)}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-400 rounded-full py-2 px-4 items-center"
                onPress={handleBuyPackage}
              >
                <Text className="text-white font-semibold">Confirm</Text>
              </TouchableOpacity>
            </View>

            <View className="flex flex-row justify-between"></View>
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
      setPaymentUrl("");
      // setPageRegister(0);
      // fetchRegisters(0);
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
              onNavigationStateChange={(navState) => {
                console.log(navState.url);
              }}
            />
          </View>
        ) : (
          <>
            <View className="flex-1 bg-gray-100 flex justify-center items-center">
              <Loading loading={loading} />
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
            {/* <View className="flex-1 bg-gray-100 flex justify-center items-center">
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
            </View> */}
            <ModalRenderBuyPackage />
          </>
        )}
      </View>
    </>
  );
};

export default Package;
