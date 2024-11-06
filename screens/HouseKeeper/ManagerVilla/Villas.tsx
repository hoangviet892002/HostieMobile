import { View, FlatList, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { VillaType } from "@/types";
import VillaCard from "./VillaCard";
import { Residence } from "@/types/response/Residences";
import { useFocusEffect } from "expo-router";
import { getResidencesByHouseKeeperApi } from "@/apis/residences";
import { Colors } from "@/constants/Colors";
import { EmptyData } from "@/components";

const Villas = () => {
  const [villas, setVillas] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  useFocusEffect(
    useCallback(() => {
      fetchVillas();
    }, [])
  );
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchVillas = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    const res = await getResidencesByHouseKeeperApi(pageNumber);
    if (res.success) {
      if (pageNumber === 1) {
        setVillas(res.data.residences);
      } else {
        setVillas((prevVillas) => [...prevVillas, ...res.data.residences]);
      }
      setTotalPage(res.data.total_pages);
    }
    if (pageNumber === 1) {
      setLoading(false);
    } else {
      setLoadingMore(false);
    }
  };
  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      fetchVillas(page + 1);
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
    <View>
      <FlatList
        data={villas}
        renderItem={({ item }) => <VillaCard villa={item} />}
        keyExtractor={(item) => item.residence_id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<EmptyData />}
      />
    </View>
  );
};

export default Villas;
