import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { VillaType } from "@/types";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";

interface VillaCardProps {
  villa: VillaType;
}

const VillaCard = (props: VillaCardProps) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        padding: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <Image
        style={{ width: "100%", height: 200, borderRadius: 10 }}
        source={{ uri: props.villa.thumbnail }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
        {props.villa.name}
      </Text>
      <Text style={{ fontSize: 16, color: "#666", marginTop: 5 }}>
        {props.villa.location}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 16, color: "#666" }}>
          {props.villa.maximumGuests} Guests
        </Text>
        <Text style={{ fontSize: 16, color: "#666" }}>
          {props.villa.standardGuests} Standard Guests
        </Text>
      </View>
      <TouchableOpacity
        className="bg-gray-200 p-4 rounded-md mt-4 border border-gray-400"
        style={{
          backgroundColor: Colors.primary,
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
          borderBlockColor: "#ddd",
        }}
        onPress={() => {
          navigation.navigate("SchedulerBooking");
        }}
      >
        <Text style={{ textAlign: "center" }}>View Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VillaCard;
