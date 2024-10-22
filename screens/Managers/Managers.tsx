import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { VillaType } from "@/types";
import { VillaManageCard } from "@/components";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { Residence } from "@/types/response/Residences";
import { getResidences } from "@/apis/residences";
import { Loading } from "@/components";

const Managers = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigation<any>();
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [villas, setVillas] = useState<Residence[]>([]);
  const fetchVillas = async (pageToFetch = page) => {
    setLoading(true);
    const res = await getResidences(10, pageToFetch);
    if (res.success) {
      setTotalPage(res.data.total_pages);

      setVillas([...villas, ...res.data.residences]);
    }
    setLoading(false);
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
    fetchVillas(page);
  }, [page]);

  const RenderPagination = () => {
    return (
      //   Load more button have  disible when page = totalPage and enable when page < totalPage and use useRef to stay index
      <View className="flex items-center justify-center">
        <TouchableOpacity
          className="p-2 rounded-lg h-[50px] w-[100px] items-center justify-center m-2"
          style={{ backgroundColor: Colors.primary }}
          onPress={() => {
            if (page < totalPage) {
              setPage(page + 1);
            }
          }}
        >
          <Text className="text-white font-semibold">{t("Load more")}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <Loading loading={loading} />
      <SafeAreaView>
        <View className="flex items-center flex-row justify-center ">
          <Text className="text-3xl font-bold ">{t("Managers")}</Text>
          <TouchableOpacity
            className="p-2 rounded-lg h-[50px] w-[100px] items-center justify-center m-2"
            style={{ backgroundColor: Colors.primary }}
            onPress={() => {
              navigate.navigate("AddVilla");
            }}
          >
            <Text className="text-white font-semibold">{t("Add Villa")}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="">
          <View className="flex justify-center items-center pb-32">
            {villas.map((villa, index) => (
              <VillaManageCard key={index} villa={villa} />
            ))}
            <RenderPagination />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Managers;
