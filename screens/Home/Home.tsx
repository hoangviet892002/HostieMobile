import { getResidencesBySellerApi } from "@/apis/residences";
import { DateRangePicker, EmptyData, Loading, VillaCard } from "@/components";
import Icon, { Icons } from "@/components/Icons";
import PackageCompoent from "@/components/PackageComponent";
import { Colors } from "@/constants/Colors";
import { Residence } from "@/types/response/Residences";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [residences, setResidences] = useState<Residence[]>([]);
  const [pickedDate, setPickedDate] = useState({
    start_date: new Date(),
    //  tomorrow
    end_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchResidences = async (pageToFetch = 1) => {
    if (pageToFetch === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const res = await getResidencesBySellerApi(
      pageToFetch,
      parseDateDDMMYYYY(pickedDate.start_date.toISOString()),
      parseDateDDMMYYYY(pickedDate.end_date.toISOString())
    );
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
    }, [showCalendar])
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
      {/* <View className="flex flex-row items-center justify-center">
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
      </View> */}
      <View className="flex flex-row items-center justify-center">
        <TouchableOpacity
          className="flex flex-row items-center justify-center mx-2 w-5/6"
          onPress={() => setShowCalendar(!showCalendar)}
          style={{
            borderColor: Colors.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: Colors.primary,
              padding: 10,
            }}
          >
            {parseDateDDMMYYYY(pickedDate.start_date.toISOString())} -{" "}
            {parseDateDDMMYYYY(pickedDate.end_date.toISOString())}
          </Text>

          <Pressable style={{ padding: 10 }}>
            <Icon
              type={Icons.FontAwesome}
              name="calendar"
              size={24}
              color={Colors.primary}
            />
          </Pressable>
        </TouchableOpacity>
      </View>

      <Modal visible={showCalendar} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View>
            <DateRangePicker
              initialRange={[pickedDate.start_date, pickedDate.end_date]}
              onSuccess={(start, end) => {
                setPickedDate({ start_date: start, end_date: end });
                setShowCalendar(false);
                fetchResidences(1);
              }}
            />
          </View>
        </View>
      </Modal>

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
