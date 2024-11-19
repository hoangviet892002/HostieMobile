import { getResidencesBySellerApi } from "@/apis/residences";
import {
  DateRangePicker,
  EmptyData,
  Loading,
  RangeSlider,
  VillaCard,
} from "@/components";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { filterActions, selectFilter } from "@/redux/slices/filterSlice";
import { Residence } from "@/types/response/Residences";
import { parseDateDDMMYYYY } from "@/utils/parseDate";
import { parsePrice } from "@/utils/parsePrice";

import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
type RouteParams = {
  params: {
    keyPass?: string;
  };
};
const MIN_DEFAULT = 0;
const MAX_DEFAULT = 100000000;
const Home = () => {
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { keyPass } = route.params ?? {};
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState<string>("");

  const [minValue, setMinValue] = useState(MIN_DEFAULT);
  const [maxValue, setMaxValue] = useState(MAX_DEFAULT);
  const [residences, setResidences] = useState<Residence[]>([]);
  const [pickedDate, setPickedDate] = useState(useSelector(selectFilter));
  // const pickedDate = useSelector(selectFilter);

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

  // useFocusEffect(
  //   useCallback(() => {
  //     // log previous state
  //     if (!keyPass) {
  //       setPage(1);
  //       fetchResidences(1);
  //     }
  //   }, [showCalendar])
  // );

  useEffect(() => {
    fetchResidences(page);
  }, [page]);

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

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchResidences(1);
    setRefreshing(false);
  };

  const [searchText, setSearchText] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setPage(1);
    fetchResidences(1);
  }, [searchText]);

  return (
    <SafeAreaView className="h-full p-5 pb-24 w-[450px]">
      <Loading loading={loading} />

      {/* <View className="flex flex-row items-center justify-center">
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
      </View> */}

      {/* search and icon filter */}
      <View className="w-full flex items-center justify-center">
        <View
          className="w-5/6"
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderColor: Colors.primary,
              borderWidth: 1,
              borderRadius: 5,
              paddingLeft: 10,
            }}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            onPress={() => {
              setShowFilter(!showFilter);
            }}
            style={{ marginLeft: 10 }}
          >
            <Icon
              name="filter"
              size={30}
              color={Colors.primary}
              type={Icons.Feather}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showFilter} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            className="rounded-t-3xl flex items-center justify-center"
            style={{
              width: "100%",
              height: "70%",
              backgroundColor: "white",
              padding: 20,
            }}
          >
            {/* Date */}
            <View className="flex flex-row items-center justify-center mb-7">
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
                        initialRange={[
                          pickedDate.start_date,
                          pickedDate.end_date,
                        ]}
                        onSuccess={(start, end) => {
                          setPickedDate({ start_date: start, end_date: end });
                          dispatch(
                            filterActions.setFilter({
                              start_date: start,
                              end_date: end,
                            })
                          );
                          setShowCalendar(false);
                          fetchResidences(1);
                        }}
                      />
                    </View>
                  </View>
                </Modal>
              </TouchableOpacity>
            </View>

            {/*range slider price */}
            <Text className="text-lg font-semibold">Price</Text>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RangeSlider
                sliderWidth={300}
                min={MIN_DEFAULT}
                max={MAX_DEFAULT}
                step={10}
                onValueChange={(range) => {
                  setMinValue(range.min);
                  setMaxValue(range.max);
                }}
              />

              <View className="flex flex-col justify-between my-3">
                <View style={{ marginBottom: 20 }}>
                  <Text className="">Min Price</Text>
                  <View
                    style={{
                      borderColor: Colors.primary,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text>{parsePrice(minValue)} VND</Text>
                  </View>
                </View>
                <View>
                  <Text>Max Price</Text>
                  <View
                    style={{
                      borderColor: Colors.primary,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text>{parsePrice(maxValue)} VND</Text>
                  </View>
                </View>
              </View>
            </GestureHandlerRootView>

            {/* Apply Button*/}
            <View className="flex items-center justify-center w-full">
              <TouchableOpacity
                className="p-3 rounded-3xl flex-row justify-center items-center w-full"
                style={{ backgroundColor: Colors.primary }}
                onPress={() => {
                  setShowFilter(false);
                  setPage(1);
                  fetchResidences(1);
                }}
              >
                <Text
                  className=" text-center text-lg font-semibold"
                  style={{ color: "white" }}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
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
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default Home;
