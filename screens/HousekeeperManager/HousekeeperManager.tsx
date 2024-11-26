import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HouseKepperType } from "@/types/HouseKeppertype";
import { getHouseKepperApprovedResidencesApi } from "@/apis/housekeeper";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import HouseKepperItem from "./HouseKepperItem";
import Icon, { Icons } from "@/components/Icons";
import { router } from "expo-router";

const HousekeeperManager = () => {
  const [housekeepers, setHousekeepers] = useState<HouseKepperType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHousekeepers = async (pageToFetch = page, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getHouseKepperApprovedResidencesApi(pageToFetch);
      if (res.code === 1000) {
        setTotalPage(res.totalPages);
        console.log("res", res);
        if (isLoadMore) {
          setHousekeepers((prevHousekeepers) => [
            ...prevHousekeepers,
            ...res.result,
          ]);
        } else {
          setHousekeepers(res.result);
        }
      }
    } catch (error) {
      console.error("Error fetching housekeepers:", error);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchHousekeepers();
  }, []);
  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      fetchHousekeepers(page + 1, true);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        className="absolute right-4 top-4 z-50 rounded-full "
        style={{
          backgroundColor: Colors.primary,
          padding: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.push("/HouseKeeperRequest");
          }}
        >
          <Icon
            type={Icons.Feather}
            name="bell"
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        className="flex"
        data={housekeepers}
        renderItem={({ item }) => <HouseKepperItem housekeeper={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          fetchHousekeepers(0);
          setIsRefreshing(false);
        }}
      />
    </SafeAreaView>
  );
};

export default HousekeeperManager;
