import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { PackageType } from "@/types";
import { getPackagesApi } from "@/apis/package";
import { Colors } from "@/constants/Colors";

const PackageCompoent = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const response = await getPackagesApi(page);
      if (response) {
        setPackages((prevPackages) => [...prevPackages, ...response.result]);
        setTotalPage(response.totalPages);
      }
      setLoading(false);
    };

    fetchPackages();
  }, [page]);

  const loadMorePackages = () => {
    if (page < totalPage - 1 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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
      <TouchableOpacity className="bg-yellow-400 rounded-full py-2 items-center mt-4">
        <Text className="text-base font-semibold text-purple-900">
          Choose Plan
        </Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View className="">
      <Text className="text-2xl font-bold text-gray-800 p-4">Packages</Text>
      <FlatList
        horizontal
        data={packages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        onEndReached={loadMorePackages}
        onEndReachedThreshold={0.5}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default PackageCompoent;
