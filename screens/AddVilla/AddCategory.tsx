import { View, Text, SectionList } from "react-native";
import React, { useState } from "react";
import { CategoryType } from "@/types/CategoryType";

const AddCategory = () => {
  const options: CategoryType[] = [
    {
      id: "1",
      name: "Bể bơi",
      iconName: "pool",
    },
    {
      id: "2",
      name: "Thú cưng",
      iconName: "pet",
    },
    {
      id: "3",
      name: "Karaoke",
      iconName: "karaoke",
    },
  ];
  const [selectedOptions, setSelectedOptions] = useState<CategoryType[]>([]);
  return (
    <View>
      <Text>Add Category</Text>
    </View>
  );
};

export default AddCategory;
