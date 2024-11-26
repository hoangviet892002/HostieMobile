import { getPackagesApi } from "@/apis/package";
import {
  getMyRegisterApi,
  getPackageUpgradesApi,
  getRegistersApi,
  postRegisterApi,
  upGradeResgisterApi,
} from "@/apis/registers";
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
import { formatExpireDate } from "@/utils/parseDate";
import { ScrollView } from "react-native-gesture-handler";
import { UpgradePackageType } from "@/types/PackageType";
import { useTranslation } from "react-i18next";
const Package = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [upgradePackages, setUpgradePackages] = useState<UpgradePackageType[]>(
    []
  );
  const { t } = useTranslation();

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
  const [selectUpgradePackage, setSelectUpgradePackage] =
    useState<UpgradePackageType | null>(null);

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
              {t("Buy Package")} {selectedPackage?.name}
            </Text>
            <Text className="text-sm text-gray-600 mb-4">
              {t("Are you sure you want to buy this package?")}
            </Text>
            <View className="flex flex-row justify-between">
              <TouchableOpacity
                className="bg-red-400 rounded-full py-2 px-4 items-center"
                onPress={() => setVisible(false)}
              >
                <Text className="text-white font-semibold">{t("Cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-400 rounded-full py-2 px-4 items-center"
                onPress={handleBuyPackage}
              >
                <Text className="text-white font-semibold">{t("Confirm")}</Text>
              </TouchableOpacity>
            </View>

            <View className="flex flex-row justify-between"></View>
          </View>
        </View>
      </Modal>
    );
  };
  const ModalRenderUpgrade = () => {
    return (
      <Modal
        visible={visibleUpgrade}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisibleUpgrade(false)}
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
              {t("Upgrade Package")} {selectUpgradePackage?.newPackage.name}
            </Text>
            <Text className="text-sm text-gray-600 mb-4">
              {t("Are you sure you want to upgrade this package?")}
            </Text>
            <View className="flex flex-row justify-between">
              <TouchableOpacity
                className="bg-red-400 rounded-full py-2 px-4 items-center"
                onPress={() => setVisibleUpgrade(false)}
              >
                <Text className="text-white font-semibold">{t("Cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-400 rounded-full py-2 px-4 items-center"
                onPress={handleUpgradePackage}
              >
                <Text className="text-white font-semibold">{t("Confirm")}</Text>
              </TouchableOpacity>
            </View>

            <View className="flex flex-row justify-between"></View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleUpgradePackage = async () => {
    const data = {
      packageId: selectUpgradePackage?.newPackage.id,
    };

    const response = await upGradeResgisterApi(data);
    console.log(response);
    if (response.code === 1000) {
      console.log(response.result.paymentUrl);
      setPaymentUrl(response.result.paymentUrl);

      setVisibleUpgrade(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.message,
        position: "top",
      });
      setVisibleUpgrade(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPaymentUrl("");
    }, [])
  );

  const fectchUpgradePackage = async () => {
    const res = await getPackageUpgradesApi();
    if (res) {
      setUpgradePackages(res.result);
    }
  };

  const [myRegisters, setMyRegisters] = useState<RegisterType | null>(null);
  const fetchMyRegisters = async () => {
    console.log("fetchMyRegisters");
    const response = await getMyRegisterApi();

    if (response.result !== undefined) {
      setMyRegisters(response.result);
      fectchUpgradePackage();
    } else {
      fetchPackages(0);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyRegisters();
    }, [])
  );
  const [visibleUpgrade, setVisibleUpgrade] = useState(false);

  const renderUpgrade = ({ item }: { item: UpgradePackageType }) => (
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
          {item.newPackage.name}
        </Text>

        {/* Package Description */}
        <Text className="text-sm text-gray-600 mb-4">
          {item.newPackage.description}
        </Text>

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
              Duration: {item.newPackage.duration} month(s)
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
              Price: {item.upgradeCost.toLocaleString("vi-VN")} VND
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
            setSelectUpgradePackage(item);
            setVisibleUpgrade(true);
          }}
        >
          <Text className="text-lg font-semibold text-white">
            {t("Upgrade")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        {paymentUrl !== "" ? (
          <View className="h-full">
            <WebView
              className=" bg-gray-100 h-[1000px]"
              source={{
                uri: paymentUrl,
              }}
              onNavigationStateChange={(navState) => {
                if (navState.url.includes("complete")) {
                  fetchMyRegisters();
                  fectchUpgradePackage();
                  setPaymentUrl("");
                }
              }}
            />
          </View>
        ) : (
          <>
            {myRegisters ? (
              <>
                <View className="p-6 bg-white mb-6 rounded-lg shadow-md">
                  <Text className="text-2xl font-bold text-gray-800 mb-4">
                    My Registration
                  </Text>
                  <View className="space-y-4">
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-base text-gray-600 font-medium">
                        Package Name:
                      </Text>
                      <Text className="text-base text-gray-800">
                        {myRegisters.packageInfo.name}
                      </Text>
                    </View>

                    <View className="flex flex-row justify-between items-start">
                      <Text className="text-base text-gray-600 font-medium">
                        Description:
                      </Text>
                      <Text className="text-base text-gray-800 text-right w-2/3">
                        {myRegisters.packageInfo.description}
                      </Text>
                    </View>

                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-base text-gray-600 font-medium">
                        Price:
                      </Text>
                      <Text className="text-base text-gray-800">
                        ${myRegisters.packagePrice.toFixed(2)}
                      </Text>
                    </View>

                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-base text-gray-600 font-medium">
                        Total Amount:
                      </Text>
                      <Text className="text-base text-gray-800">
                        ${myRegisters.totalAmount.toFixed(2)}
                      </Text>
                    </View>

                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-base text-gray-600 font-medium">
                        Duration:
                      </Text>
                      <Text className="text-base text-gray-800">
                        {myRegisters.duration} month(s)
                      </Text>
                    </View>

                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-base text-gray-600 font-medium">
                        Expire At:
                      </Text>
                      <Text className="text-base text-gray-800">
                        {formatExpireDate(myRegisters.expireAt)}
                      </Text>
                    </View>

                    {myRegisters.paymentExpiryTime && (
                      <View className="flex flex-row justify-between items-center">
                        <Text className="text-base text-gray-600 font-medium">
                          Payment Expiry Time:
                        </Text>
                        <Text className="text-base text-gray-800">
                          {formatExpireDate(myRegisters.paymentExpiryTime)}
                        </Text>
                      </View>
                    )}

                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-base text-gray-600 font-medium">
                        Status:
                      </Text>
                      <Text
                        className={`text-base font-semibold ${
                          myRegisters.active ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {myRegisters.registerStatus}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-1 bg-gray-100 flex justify-center items-center">
                  <Loading loading={loading} />
                  <FlatList
                    horizontal
                    data={upgradePackages}
                    renderItem={renderUpgrade}
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
              </>
            ) : (
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
            )}
            <ModalRenderUpgrade />

            <ModalRenderBuyPackage />
          </>
        )}
      </ScrollView>
    </>
  );
};

export default Package;
