import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { ReportType } from "@/types/ReportType";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { getMyReportsApi } from "@/apis/report";
import { SafeAreaView } from "react-native-safe-area-context";
import ReportItem from "./ReportItem";

const Report = () => {
  const [report, setReport] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchReports = async (pageNumber: number, isRefresh: boolean) => {
    setLoading(true);
    const res = await getMyReportsApi(pageNumber);
    console.log("res", res);
    if (res.code === 1000) {
      if (isRefresh) {
        setReport(res.result);
      } else {
        setReport([...report, ...res.result]);
      }

      setTotalPage(res.totalPages);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      fetchReports(page + 1, false);
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
  useEffect(() => {
    fetchReports(page, false);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <FlatList
          data={report}
          renderItem={({ item }) => <ReportItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={isRefreshing}
          onRefresh={() => {
            fetchReports(0, true);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Report;
