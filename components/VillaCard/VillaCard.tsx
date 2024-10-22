import { Animations } from "@/constants/Animations";
import { Colors } from "@/constants/Colors";
import { VillaType } from "@/types";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Icon, { Icons } from "../Icons";
import { useNavigation } from "@react-navigation/native";
import { Residence } from "@/types/response/Residences";
interface VillaCardProps {
  villa: Residence;
}

export const VillaCard: React.FC<VillaCardProps> = ({ villa }) => {
  const navigate = useNavigation<any>();
  const { t } = useTranslation();
  const randomAnimation =
    Animations[Math.floor(Math.random() * Animations.length)];
  return (
    <View className="h-auto m-4 rounded-3xl flex justify-between bg-white shadow-2xl shadow-blue-900  overflow-hidden flex-col w-3/4">
      <View className="flex">
        <Image
          source={
            villa.images[0]
              ? { uri: villa.images[0].image }
              : {
                  uri: "https://www.google.com/imgres?q=house%20drawing&imgurl=https%3A%2F%2Fwww.easyartstart.com%2Fwp-content%2Fuploads%2F2024%2F04%2Fhouse_line_drawing.png&imgrefurl=https%3A%2F%2Fwww.easyartstart.com%2Fhow-to-draw-a-house-step-by-step%2F&docid=A7gficByEPPNsM&tbnid=qyscgBy3NKCevM&vet=12ahUKEwjcjcS2t6CJAxWvk1YBHbTOICMQM3oECBkQAA..i&w=728&h=530&hcb=2&ved=2ahUKEwjcjcS2t6CJAxWvk1YBHbTOICMQM3oECBkQAA",
                }
          }
          className="h-[200px] rounded-t-3xl"
        />
        <View className="absolute top-4 right-4 bg-white p-2 rounded-lg">
          <Icon
            type={Icons.Feather}
            name="bookmark"
            size={24}
            color={Colors.skyBlue}
          />
        </View>
        <View className="absolute bottom-4 right-4 bg-white p-2 rounded-lg">
          <Text className="text-sm" style={{ color: Colors.skyBlue }}>
            {villa.residence_type}
          </Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-3xl font-bold">{villa.residence_name}</Text>
        <Text className="text-sm text-gray-600">{villa.residence_address}</Text>
      </View>

      <View className="p-4">
        <TouchableOpacity
          className="p-2 rounded-3xl items-center justify-center"
          style={{
            backgroundColor: Colors.primary,
            width: "100%",
            height: 50,
          }}
          onPress={() => {
            (navigate as any).navigate("VillaDetail", {
              itemId: villa.residence_id,
            });
          }}
        >
          <Text className="text-sm text-white">{t("Book Now")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
