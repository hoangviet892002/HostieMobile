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

const Managers = () => {
  const { t } = useTranslation();
  const navigate = useNavigation<any>();
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [villas, setVillas] = useState<Residence[]>([]);
  const fetchVillas = async () => {
    const res = await getResidences(10, page);
    if (res.success) {
      setTotalPage(res.data.total_pages);
      setVillas(res.data.residences);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(0);
      setTotalPage(0);
      fetchVillas();
    }, [])
  );
  useEffect(() => {
    fetchVillas();
    console.log("page", page);
  }, [page]);

  const RenderPagination = () => {
    return (
      <View className="flex flex-row justify-between mb-4 w-full">
        <TouchableOpacity
          className={`p-2 rounded-lg h-[50px] w-[100px] items-center justify-center`}
          style={{
            backgroundColor: page === 0 ? Colors.disabled : Colors.primary,
          }}
          onPress={() => {
            if (page > 0) {
              setPage(page - 1);
            }
          }}
          disabled={page === 0}
        >
          <Text className="text-white font-semibold">{t("Previous")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-2 rounded-lg h-[50px] w-[100px] items-center justify-center"
          style={{
            backgroundColor:
              page >= totalPage - 1 ? Colors.disabled : Colors.primary,
          }}
          onPress={() => {
            if (page < totalPage - 1) {
              setPage(page + 1);
            }
          }}
          disabled={page >= totalPage - 1}
        >
          <Text className="text-white font-semibold">{t("Next")}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
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
  );
};

export default Managers;
