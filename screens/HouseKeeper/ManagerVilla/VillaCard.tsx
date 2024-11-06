import { Colors } from "@/constants/Colors";
import { Residence } from "@/types/response/Residences";
import { useNavigation } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface VillaCardProps {
  villa: Residence;
}

const VillaCard = (props: VillaCardProps) => {
  const navigation = useNavigation();
  return (
    <>
      <Image
        source={
          props.villa.images[0]
            ? { uri: props.villa.images[0].image }
            : {
                uri: "https://picsum.photos/200/300",
              }
        }
        className="w-full h-40 rounded-md"
      />
      <View
        style={{
          padding: 20,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          {props.villa.residence_name}
        </Text>

        <Text style={{ fontSize: 16, color: "#666", marginTop: 5 }}>
          {`${props.villa.ward}, ${props.villa.district}, ${props.villa.province}`}
        </Text>

        <Text>{props.villa.residence_id}</Text>
        <Text style={{ fontSize: 16, color: "#666", marginTop: 5 }}>
          {props.villa.residence_address}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        ></View>
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
    </>
  );
};

export default VillaCard;
