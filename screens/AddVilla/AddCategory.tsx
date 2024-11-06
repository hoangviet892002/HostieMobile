import { getIcons } from "@/apis/icon";
import { postResidence } from "@/apis/residences";
import Icon, { Icons } from "@/components/Icons";
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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
      <View className="flex items-center justify-center">
        {/* Input name and verify */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: Colors.primary,
            borderWidth: 2,
            borderRadius: 25,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 5,
            width: wp(80),
          }}
        >
          <Icon
            type={Icons.AntDesign}
            name="user"
            size={20}
            color={Colors.primary}
          />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              color: Colors.black,
              paddingVertical: 8,
            }}
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => {
              setForm({ ...form, name: text });
            }}
          />
        </View>

        {/* Input description */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: Colors.primary,
            borderWidth: 2,
            borderRadius: 25,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 5,
            width: wp(80),
          }}
        >
          <Icon
            type={Icons.AntDesign}
            name="user"
            size={20}
            color={Colors.primary}
          />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              color: Colors.black,
              paddingVertical: 8,
            }}
            placeholder="Description"
            value={form.description}
            onChangeText={(text) => {
              setForm({ ...form, description: text });
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        className="m-4 flex flex-row items-center justify-center rounded-3xl"
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
        <Icon
          type={Icons.AntDesign}
          name="plus"
          size={20}
          color={Colors.white}
        />
        <Text>Add</Text>
      </TouchableOpacity>

      <ScrollView>
        {utilitiesList.map((item, index) => (
          // Render list of utilities have delete button
          <View
            className="flex flex-row justify-between m-4 border border-gray-400 p-2 rounded-3xl"
            style={{ borderRadius: 5 }}
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
              <Icon
                type={Icons.AntDesign}
                name="delete"
                size={20}
                color={Colors.red}
              />
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
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 25,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            <Icon
              name="arrow-left"
              size={20}
              color={Colors.white}
              type={Icons.Feather}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex items-center justify-center"
            onPress={() => {
              handleSubmit();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 25,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Next
            </Text>
            <Icon
              name="arrow-right"
              size={20}
              color={Colors.white}
              type={Icons.Feather}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddCategory;
