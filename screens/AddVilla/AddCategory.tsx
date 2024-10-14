import { getIcons } from "@/apis/icon";
import { CategoryType } from "@/types/CategoryType";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

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
  const [options, setOptions] = useState<CategoryType[]>([]);

  const fetchIcon = async () => {
    const response = await getIcons();
    if (response) {
      setOptions(response.data);
    }
  };

  useEffect(() => {
    fetchIcon();
  }, []);
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
        <Image source={{ uri: item.icon }} style={{ width: 50, height: 50 }} />
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
