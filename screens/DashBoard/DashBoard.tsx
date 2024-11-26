import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import { StaticTypeSeller } from "@/types/StaticTypeSeller";
import useToast from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { getStaticHostApi, getStaticSellerApi } from "@/apis/booking";
import { useFocusEffect } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { StaticTypeHost } from "@/types/StaticTypeHost";
import { useSelector } from "react-redux";
import { selectRole } from "@/redux/slices/authSlice";
import { Roles } from "@/constants/enums/roles";
import { SafeAreaView } from "react-native-safe-area-context";

const DashBoard = () => {
  const [data, setData] = useState<StaticTypeSeller | null>(null);
  const [dataHost, setDataHost] = useState<StaticTypeHost | null>(null);
  const [loadingSeller, setLoadingSeller] = useState<boolean>(true);
  const [loadingHost, setLoadingHost] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const role = useSelector(selectRole);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoadingSeller(true);
      const res = await getStaticSellerApi();
      if (res.success) {
        setData(res.data);
      } else {
        showToast(res);
      }
    } catch (err) {
      setError("An error occurred while fetching seller data.");
    } finally {
      setLoadingSeller(false);
    }
  };

  const fetchDataHost = async () => {
    try {
      setLoadingHost(true);
      const res = await getStaticHostApi();
      if (res.success) {
        setDataHost(res.data);
      } else {
        showToast(res);
      }
    } catch (err) {
      setError("An error occurred while fetching host data.");
    } finally {
      setLoadingHost(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (role === Roles.ROLE_HOST) {
        fetchDataHost();
      }
      fetchData();
      return () => {
        setData(null);
        setDataHost(null);
        setLoadingSeller(true);
        setLoadingHost(true);
        setError(null);
      };
    }, [role])
  );

  const chartWidth = Dimensions.get("window").width + 100;

  if (loadingSeller || (role === Roles.ROLE_HOST && loadingHost)) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  interface IStatus {
    label: string;
    name: string;
    color: string;
    icon: string;
    background: string;
  }

  const statusNumber: IStatus[] = [
    {
      label: "Total Villas Sold",
      name: "total_sold",
      color: "#3B82F6",
      icon: "home",
      background: "#EFF6FF",
    },
    {
      label: "Total Revenue",
      name: "total_revenue",
      color: "#14B8A6",
      icon: "dollar-sign",
      background: "#E0FFF9",
    },
    {
      label: "Total Commission",
      name: "total_commission",
      color: "#EF4444",
      icon: "check-circle",
      background: "#FEF2F2",
    },
  ];

  const statusHostNumber: IStatus[] = [
    {
      label: "Total Residence",
      name: "total_residence",
      color: "#3B82F6",
      icon: "home",
      background: "#EFF6FF",
    },
    {
      label: "Total Butler",
      name: "total_butler",
      color: "#14B8A6",
      icon: "dollar-sign",
      background: "#E0FFF9",
    },
    {
      label: "Total Commission",
      name: "total_commission",
      color: "#EF4444",
      icon: "check-circle",
      background: "#FEF2F2",
    },
    {
      label: "Total Revenue",
      name: "total_revenue",
      color: "#EF4444",
      icon: "dollar-sign",
      background: "#FEF2F2",
    },
  ];

  const renderStatus = (status: IStatus) => (
    <View
      key={status.name}
      className="p-4 rounded-lg items-center shadow-sm mx-4"
      style={{ backgroundColor: status.background }}
    >
      <Icon name={status.icon} size={32} color={status.color} />
      <Text className="text-lg font-bold text-blue-600 mt-2">
        {data?.[status.name as keyof StaticTypeSeller] as number}
      </Text>
      <Text className="text-sm text-gray-600">{t(status.label)}</Text>
    </View>
  );

  const renderStatusHost = (status: IStatus) => (
    <View
      key={status.name}
      className="p-4 rounded-lg items-center shadow-sm mx-4"
      style={{ backgroundColor: status.background }}
    >
      <Icon name={status.icon} size={32} color={status.color} />
      <Text className="text-lg font-bold text-blue-600 mt-2">
        {dataHost?.[status.name as keyof StaticTypeHost] as number}
      </Text>
      <Text className="text-sm text-gray-600">{t(status.label)}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="bg-gray-100 p-4">
        {/* Welcome Message */}
        <Text className="text-xl font-bold text-gray-800 mb-4">
          {t("Welcome Back")} 👋
        </Text>

        {/* Summary Cards for Seller */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {statusNumber.map(renderStatus)}
          </ScrollView>
        </View>

        {/* Monthly Income Chart for Seller */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-700 mb-4">
            {t("Monthly Income")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <LineChart
              data={{
                labels: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(
                  " "
                ),
                datasets: [
                  {
                    data:
                      data?.income_by_month[0].data.map(
                        (item) => item.this_year
                      ) || [],
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    strokeWidth: 2,
                  },
                  {
                    data:
                      data?.income_by_month[0].data.map(
                        (item) => item.last_year
                      ) || [],
                    color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
                legend: ["This Year", "Last Year"],
              }}
              width={chartWidth}
              height={260}
              yAxisInterval={1}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#3B82F6",
                },
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "#E5E7EB",
                },
              }}
              bezier
              style={{ marginVertical: 10, borderRadius: 16 }}
            />
          </ScrollView>
        </View>

        {/* Summary Cards for Host */}
        {role === Roles.ROLE_HOST && (
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {statusHostNumber.map(renderStatusHost)}
            </ScrollView>
          </View>
        )}

        {/* Monthly Income Chart for Host */}
        {role === Roles.ROLE_HOST && (
          <View className="bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-lg font-bold text-gray-700 mb-4">
              {t("Monthly Income")}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <LineChart
                data={{
                  labels:
                    "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(
                      " "
                    ),
                  datasets: [
                    {
                      data:
                        dataHost?.income_by_month[0].data.map(
                          (item) => item.this_year
                        ) || [],
                      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                      strokeWidth: 2,
                    },
                    {
                      data:
                        dataHost?.income_by_month[0].data.map(
                          (item) => item.last_year
                        ) || [],
                      color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                  legend: ["This Year", "Last Year"],
                }}
                width={chartWidth}
                height={260}
                yAxisInterval={1}
                chartConfig={{
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#3B82F6",
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: "",
                    stroke: "#E5E7EB",
                  },
                }}
                bezier
                style={{ marginVertical: 10, borderRadius: 16 }}
              />
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashBoard;
