import { Loading, VillaCard } from "@/components";
import { Colors } from "@/constants/Colors";
import { VillaType } from "@/types";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon, { Icons } from "@/components/Icons";
import { Residence } from "@/types/response/Residences";
import { getResidences } from "@/apis/residences";
/**
 * Home Screen
 *  */
const Home = () => {
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serach, setSearch] = useState<string>("");
  const [Residences, setResidences] = useState<Residence[]>([]);
  useFocusEffect(
    useCallback(() => {
      setPage(0);
      setResidences([]);
      fetchResidences(0);
    }, [])
  );
  useEffect(() => {
    fetchResidences(page);
  }, [page]);
  const fetchResidences = async (pageToFetch = page) => {
    setLoading(true);
    const res = await getResidences(10, pageToFetch, serach);
    if (res.success) {
      setTotalPage(res.data.total_pages);
      setResidences((prevResidences) => [
        ...prevResidences,
        ...res.data.residences,
      ]);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="h-full p-5 pb-24 w-[450px]">
      <Loading loading={loading} />
      <View className="flex flex-row items-center justify-center">
        <TextInput
          className="bg-white p-2 rounded-lg border-2 py-2 my-2"
          style={{ width: wp(80), borderColor: Colors.primary }}
          value={serach}
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
      <ScrollView>
        <View className="flex justify-center items-center">
          {Residences.map((villa, index) => (
            <VillaCard key={index} villa={villa} />
          ))}
          {/* load more button */}
          <Pressable
            className="p-2 rounded-lg h-[50px] w-[100px] items-center justify-center m-2"
            style={{ backgroundColor: Colors.primary }}
            onPress={() => {
              if (page < totalPage) {
                setPage(page + 1);
              }
            }}
          >
            <Icon
              type={Icons.Feather}
              name="arrow-down"
              size={24}
              color="white"
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
