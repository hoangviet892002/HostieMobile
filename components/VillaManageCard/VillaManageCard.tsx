import { View, Text, Image } from "react-native";
import React from "react";
import { VillaType } from "@/types";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
interface VillaManageCardProps {
  villa: VillaType;
}
const VillaManageCard: React.FC<VillaManageCardProps> = ({ villa }) => {
  return (
    <View
      className="flex items-center  h-[300px] w-[330px] m-4"
      style={{
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
      }}
    >
      <Image
        source={{ uri: villa.thumbnail }}
        className="h-[200px] w-[330px]"
        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      />
      <Text className="text-lg font-bold">{villa.name}</Text>
      <Text className="text-sm text-gray-600">{villa.location}</Text>
      <TouchableOpacity
        className="p-2 rounded-lg h-[50px] w-[200px] items-center justify-center m-2"
        style={{ backgroundColor: Colors.primary }}
        onPress={() => {}}
      >
        <Text className="text-white font-semibold">Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VillaManageCard;
