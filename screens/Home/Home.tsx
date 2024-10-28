import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useFocusEffect } from "expo-router";
import Icon, { Icons } from "@/components/Icons";
import { EmptyData, Loading, VillaCard } from "@/components";
import { Colors } from "@/constants/Colors";
import { Residence } from "@/types/response/Residences";
import { getResidencesBySellerApi } from "@/apis/residences";

const Home = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [residences, setResidences] = useState<Residence[]>([]);

  const fetchResidences = async (pageToFetch = 1) => {
    if (pageToFetch === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const res = await getResidencesBySellerApi(pageToFetch);
    if (res.success) {
      if (pageToFetch === 1) {
        setResidences(res.data.residences);
      } else {
        setResidences((prevResidences) => [
          ...prevResidences,
          ...res.data.residences,
        ]);
      }
      setTotalPage(res.data.total_pages);
    }
    if (pageToFetch === 1) {
      setLoading(false);
    } else {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchResidences(1);
    }, [])
  );

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      fetchResidences(page + 1);
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
    <SafeAreaView className="h-full p-5 pb-24 w-[450px]">
      <Loading loading={loading} />
      <View className="flex flex-row items-center justify-center">
        <TextInput
          className="bg-white p-2 rounded-lg border-2 py-2 my-2"
          style={{ width: wp(80), borderColor: Colors.primary }}
          value={search}
          placeholder="Search"
          onChangeText={(text) => {
            setSearch(text);
          }}
        />
        <Pressable style={{ padding: 10 }}>
          <Icon
            type={Icons.Feather}
            name="search"
            size={24}
            color={Colors.primary}
          />
        </Pressable>
      </View>

      <FlatList
        className="flex"
        data={residences}
        renderItem={({ item }) => (
          <View className="flex items-center justify-center">
            <VillaCard villa={item} />
          </View>
        )}
        keyExtractor={(item) => item.residence_id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => <EmptyData />}
      />
    </SafeAreaView>
  );
};

export default Home;
