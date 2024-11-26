import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { ReportType } from "@/types/ReportType";

import { MaterialIcons } from "@expo/vector-icons";
import { parseReportSeverity, parseReportStatus } from "@/utils/parseReport";
import moment from "moment";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ReportItemProps {
  item: ReportType;
  onPress: () => void;
}

const ReportItem: React.FC<ReportItemProps> = ({ item, onPress }) => {
  // Xác định màu sắc dựa trên độ nghiêm trọng
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "text-green-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "HIGH":
        return "text-red-500";
      case "URGENT":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  // Xác định biểu tượng dựa trên loại báo cáo
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "PAYMENT_ISSUE":
        return <MaterialIcons name="payment" size={24} color="#4B5563" />;
      case "RESIDENCE_ISSUE":
        return <MaterialIcons name="home" size={24} color="#4B5563" />;
      case "HOST_ISSUE":
        return <MaterialIcons name="person" size={24} color="#4B5563" />;
      case "OTHER":
        return <MaterialIcons name="report" size={24} color="#4B5563" />;
      default:
        return <MaterialIcons name="error" size={24} color="#4B5563" />;
    }
  };

  return (
    <StyledTouchableOpacity
      className="flex-row items-start p-4 border-b border-gray-200"
      style={{}}
      onPress={onPress}
    >
      <View className="mr-4 mt-1">{getReportTypeIcon(item.reportType)}</View>

      <View className="flex-1">
        <StyledText className="text-lg font-semibold text-gray-800">
          {item.residenceName}
        </StyledText>

        <StyledText className="text-sm text-gray-500 mt-1">
          {item.title}
        </StyledText>

        <StyledText className="text-sm text-gray-600 mt-1" numberOfLines={2}>
          {item.description}
        </StyledText>

        <View className="flex-row items-center mt-2">
          <View className="flex-row items-center mr-4">
            <MaterialIcons
              name="schedule"
              size={16}
              color="#6B7280"
              className="mr-1"
            />
            <StyledText className="text-xs text-gray-600">
              {parseReportStatus(item.status)}
            </StyledText>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons
              name="priority-high"
              size={16}
              color="#6B7280"
              className="mr-1"
            />
            <StyledText
              className={`text-xs font-medium ${getSeverityColor(
                item.severity
              )}`}
            >
              {parseReportSeverity(item.severity)}
            </StyledText>
          </View>
        </View>
      </View>
      <View>
        {/* admin note */}

        <MaterialIcons
          name="sticky-note-2"
          size={24}
          color="#6B7280"
          className="ml-4"
        />
        <Text className="text-xs text-gray-600 mt-1">
          {item.adminNote || "No note"}
        </Text>
      </View>
    </StyledTouchableOpacity>
  );
};

export default ReportItem;
