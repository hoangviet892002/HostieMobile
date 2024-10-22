import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import moment from "moment";
import Icon, { Icons } from "../Icons";

const MonthNavigator: React.FC<{
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}> = ({ month, year, setMonth, setYear }) => {
  const handlePrevious = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePrevious}>
        <Icon name="arrowleft" type={Icons.AntDesign} />
      </Pressable>

      <Text style={styles.monthText}>
        {moment(`${year}-${month}`, "YYYY-MM").format("MMMM YYYY")}
      </Text>

      <Pressable onPress={handleNext}>
        <Icon name="arrowright" type={Icons.AntDesign} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
});

export default MonthNavigator;
