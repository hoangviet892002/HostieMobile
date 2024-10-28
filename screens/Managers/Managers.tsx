import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { VillaType } from "@/types";
import { EmptyData, VillaManageCard } from "@/components";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Residence } from "@/types/response/Residences";
import { getResidences } from "@/apis/residences";
import { Loading } from "@/components";

const Managers = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [villas, setVillas] = useState<Residence[]>([]);

  const fetchVillas = async (pageToFetch = page, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getResidences(10, pageToFetch);
      if (res.success) {
        setTotalPage(res.data.total_pages);
        if (isLoadMore) {
          setVillas((prevVillas) => [...prevVillas, ...res.data.residences]);
        } else {
          setVillas(res.data.residences);
        }
      }
    } catch (error) {
      console.error("Error fetching villas:", error);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      setVillas([]);
      setPage(0);
      setTotalPage(0);
      fetchVillas(0);
    }, [])
  );

  useEffect(() => {
    if (page === 0) return;
    fetchVillas(page, true);
  }, [page]);

  const handleLoadMore = () => {
    if (page < totalPage && !loadingMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="flex items-center justify-center p-4">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  };

  const renderHeader = () => (
    <View className="flex items-center flex-row justify-center ">
      <Text className="text-3xl font-bold ">{t("Managers")}</Text>
      <TouchableOpacity
        className="p-2 rounded-lg h-[50px] w-[100px] items-center justify-center m-2"
        style={{ backgroundColor: Colors.primary }}
        onPress={() => {
          navigation.navigate("AddVilla");
        }}
      >
        <Text className="text-white font-semibold">{t("Add Villa")}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: Residence }) => (
    <View className="flex items-center justify-center">
      <VillaManageCard villa={item} />
    </View>
  );

  return (
    <>
      <Loading loading={loading} />
      <SafeAreaView>
        <FlatList
          className="flex"
          data={villas}
          keyExtractor={(item) => item.residence_id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => <EmptyData />}
        />
      </SafeAreaView>
    </>
  );
};

export default Managers;
