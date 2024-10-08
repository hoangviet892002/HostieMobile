import { View, Text, SectionList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { CategoryType } from "@/types/CategoryType";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Icon, { Icons } from "@/components/Icons";

interface AddCategoryProps {
  setStep: (step: number) => void;
  utilities: CategoryType[];
  handleChange: (data: CategoryType[]) => void;
}
const AddCategory: React.FC<AddCategoryProps> = ({
  setStep,
  utilities,
  handleChange,
}) => {
  const options: CategoryType[] = [
    {
      id: "1",
      name: "Bể bơi",
      iconName: "droplet",
    },
    {
      id: "2",
      name: "Thú cưng",
      iconName: "activity",
    },
    {
      id: "3",
      name: "Karaoke",
      iconName: "music",
    },
    {
      id: "4",
      name: "BBQ",
      iconName: "coffee",
    },
    {
      id: "5",
      name: "Wifi",
      iconName: "wifi",
    },
    {
      id: "6",
      name: "TV",
      iconName: "tv",
    },
    {
      id: "7",
      name: "Điều hòa",
      iconName: "wind",
    },
    {
      id: "8",
      name: "Bếp",
      iconName: "home",
    },
    {
      id: "9",
      name: "Máy giặt",
      iconName: "refresh-cw",
    },
    {
      id: "10",
      name: "Phòng tập",
      iconName: "activity",
    },

    {
      id: "12",
      name: "Nhà hàng",
      iconName: "menu",
    },
    {
      id: "13",
      name: "Bar",
      iconName: "coffee",
    },
    {
      id: "14",
      name: "Spa",
      iconName: "sun",
    },
    {
      id: "15",
      name: "Sân golf",
      iconName: "flag",
    },
    {
      id: "16",
      name: "Sân tennis",
      iconName: "target",
    },
    {
      id: "22",
      name: "Sân đấu võ",
      iconName: "activity",
    },
  ];
  const [selectedOptions, setSelectedOptions] =
    useState<CategoryType[]>(utilities);
  // Render input for add type for list
  const RenderInput = ({ item }: { item: CategoryType }) => {
    const isSelected = selectedOptions.find((option) => option.id === item.id);
    return (
      <TouchableOpacity
        className="flex items-center justify-center w-1/4"
        onPress={() => {
          if (isSelected) {
            setSelectedOptions((prev) =>
              prev.filter((option) => option.id !== item.id)
            );
          } else {
            setSelectedOptions((prev) => [...prev, item]);
          }
        }}
        style={{
          backgroundColor: isSelected ? Colors.primary : "white",
          padding: 10,
          borderRadius: 5,
          margin: 5,
        }}
      >
        <Icon
          name={item.iconName ?? "default-icon"}
          type={Icons.Feather}
          size={30}
          color={isSelected ? "white" : "black"}
        />
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View className="flex flex-row flex-wrap justify-center items-center">
        {
          // Render list options
          options.map((item, index) => (
            <RenderInput key={index} item={item} />
          ))
        }
      </View>
      <View className="flex flex-row justify-between m-4">
        <TouchableOpacity
          className="flex items-center justify-center"
          onPress={() => {
            handleChange(selectedOptions);
            setStep(2);
          }}
          style={{
            backgroundColor: Colors.primary,
            padding: 10,
            borderRadius: 5,
            width: 100,
          }}
        >
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex items-center justify-center"
          onPress={() => {
            handleChange(selectedOptions);
            setStep(4);
          }}
          style={{
            backgroundColor: Colors.primary,
            padding: 10,
            borderRadius: 5,
            width: 100,
          }}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddCategory;
