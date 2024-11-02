import { getIcons } from "@/apis/icon";
import { postResidence } from "@/apis/residences";
import { Colors } from "@/constants/Colors";
import useToast from "@/hooks/useToast";
import { AmenityType } from "@/types";
import { CategoryType } from "@/types/CategoryType";
import { ResidencesStep3 } from "@/types/request/ResidencesRequest";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "react-native-toast-message";

interface AddCategoryProps {
  setStep: (step: number) => void;
  utilities: AmenityType[];
  setData: (data: any) => void;
  setId: (id: string) => void;
  id: string;
}

interface utilitie {
  name: string;
  description: string;
  amenity_id: number;
  icon: string;
}
const AddCategory: React.FC<AddCategoryProps> = ({
  setStep,
  utilities,
  setData,
  id,
  setId,
}) => {
  const [options, setOptions] = useState<CategoryType[]>([]);
  const { showToast } = useToast();

  const fetchIcon = async () => {
    const response = await getIcons();
    if (response) {
      setOptions(response.data);
    }
  };

  const [utilitiesList, setUtilitiesList] = useState<utilitie[]>(utilities);

  useEffect(() => {
    fetchIcon();
  }, []);
  const [selected, setSelected] = useState<CategoryType | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // Render input for add type for list

  const solveApi = async (dataPost: ResidencesStep3) => {
    if (id !== "") {
      dataPost.id = id;
      setId(id);
    }

    const res = await postResidence(dataPost);

    if (res.success) {
      setId(res.data.id);
      setStep(4);
    } else {
      showToast(res);
    }
  };
  const handleSubmit = () => {
    const dataPost: ResidencesStep3 = {
      amenities: utilitiesList.map((item) => ({
        amenity_id: item.amenity_id,
        description: item.description,
        name: item.name,
      })),
      id: id,
      step: 3,
    };

    setData((prevData) => ({
      ...prevData,
      utilities: utilitiesList,
    }));
    solveApi(dataPost);
  };
  return (
    <View>
      <View className="flex flex-wrap flex-row justify-center">
        {options.map((item, index) => (
          <TouchableOpacity
            className="flex items-center justify-center w-1/4 p-2 m-1"
            key={index}
            onPress={() => {
              if (selected?.id === item.id) {
                setSelected(null);
              } else {
                setSelected(item);
              }
            }}
            style={{
              backgroundColor:
                selected?.id === item.id ? Colors.primary : "white",
            }}
          >
            <Image
              source={{ uri: item.icon }}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Input name and verify */}
      <View className="m-4">
        <Text>Name</Text>
        <TextInput
          className="border border-gray-400 p-2 w-full"
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => {
            setForm({ ...form, name: text });
          }}
        />
      </View>

      {/* Input description */}
      <View className="m-4">
        <Text>Description</Text>
        <TextInput
          className="border border-gray-400 p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChangeText={(text) => {
            setForm({ ...form, description: text });
          }}
        />
      </View>

      <TouchableOpacity
        className="m-4"
        onPress={() => {
          if (selected && form.name && form.description) {
            const data: utilitie = {
              ...form,
              icon: selected.icon,
              amenity_id: Number(selected.id),
              description: form.description,
            };
            setUtilitiesList([...utilitiesList, data]);
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Please fill all the fields",
            });
          }
        }}
        style={{
          backgroundColor: Colors.primary,
          padding: 10,
          borderRadius: 5,
          width: 100,
          alignSelf: "center",
        }}
      >
        <Text>Add</Text>
      </TouchableOpacity>

      <ScrollView>
        {utilitiesList.map((item, index) => (
          // Render list of utilities have delete button
          <View
            className="flex flex-row justify-between m-4 border border-gray-400 p-2"
            key={index}
          >
            <View className="flex flex-row">
              <Image
                source={{ uri: item.icon }}
                style={{ width: 50, height: 50 }}
              />
              <View className="flex flex-col ml-4">
                <Text>{item.name}</Text>
                <Text>{item.description}</Text>
              </View>
            </View>
            <TouchableOpacity
              className="flex items-center justify-center"
              onPress={() => {
                setUtilitiesList(utilitiesList.filter((_, i) => i !== index));
              }}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View className="flex flex-row justify-between m-4">
          <TouchableOpacity
            className="flex items-center justify-center"
            onPress={() => {
              setStep(2);
            }}
            style={{
              backgroundColor: Colors.gray,
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
              handleSubmit();
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
      </ScrollView>
    </View>
  );
};

export default AddCategory;
