import { VillaCard } from "@/components";
import { DateRangePicker } from "@/components/DatePickerCustom";
import Icon, { Icons } from "@/components/Icons";
import { Colors } from "@/constants/Colors";
import { VillaType } from "@/types";
import { parseDate } from "@/utils/parseDate";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Home Screen
 *  */
const Home = () => {
  // Mock Category
  const categories = [
    {
      name: "Category 1",
    },
    {
      name: "Category 2",
    },
    {
      name: "Category 3",
    },
    {
      name: "Category 4",
    },
    {
      name: "Category 5",
    },
  ];
  const [state, setState] = useState({
    fromDate: new Date(),
    toDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
    modalVisible: false,
  });

  const RenderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setState({ ...state, modalVisible: false });
        }}
      >
        <Animatable.View
          className="flex items-center justify-center"
          animation="slideInDown"
        >
          <DateRangePicker
            initialRange={[state.fromDate, state.toDate]}
            onSuccess={(fromDate, toDate) => {
              setState({ ...state, fromDate, toDate, modalVisible: false });
            }}
          />
        </Animatable.View>
      </Modal>
    );
  };
  const DisplayDate = () => {
    return (
      <TouchableOpacity
        className="bg-white w-[450px] rounded-lg p-3 flex flex-row justify-center items-center"
        onPress={() => setState({ ...state, modalVisible: true })}
        style={{ borderBlockColor: Colors.primary, borderWidth: 1 }}
      >
        <Text>{parseDate(state.fromDate.toISOString())}</Text>
        <Text> - </Text>
        <Text>{parseDate(state.toDate.toISOString())}</Text>
        <Icon type={Icons.Feather} name="calendar" />
      </TouchableOpacity>
    );
  };
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const RenderCategory = () => {
    return (
      <View className="h-[50px]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex mr-3"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (selectedCategory.includes(category.name)) {
                  setSelectedCategory(
                    selectedCategory.filter((item) => item !== category.name)
                  );
                } else {
                  setSelectedCategory([...selectedCategory, category.name]);
                }
              }}
              style={{
                backgroundColor: selectedCategory.includes(category.name)
                  ? Colors.primary
                  : "white",
              }}
              className="p-2 rounded-lg m-2"
            >
              <Text
                style={{
                  color: selectedCategory.includes(category.name)
                    ? "white"
                    : Colors.primary,
                }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  // mock villa
  const villas: VillaType[] = [
    {
      category: [
        {
          id: "1",
          name: "Category 1",
        },
        {
          id: "2",
          name: "Category 2",
        },
        {
          id: "3",
          name: "Category 3",
        },
        {
          id: "4",
          name: "Category 4",
        },
      ],
      id: "1",
      location: "Location 1",
      maximumGuests: 10,
      name: "Villa 1",
      standardGuests: 5,
      thumbnail: "https://picsum.photos/200/300",
      type: "Type 1",
    },
    {
      category: [
        {
          id: "1",
          name: "Category 1",
        },
        {
          id: "2",
          name: "Category 2",
        },
        {
          id: "3",
          name: "Category 3",
        },
        {
          id: "4",
          name: "Category 4",
        },
      ],
      id: "1",
      location: "Location 1",
      maximumGuests: 10,
      name: "Villa 1",
      standardGuests: 5,
      thumbnail: "https://picsum.photos/200/300",
      type: "Type 1",
    },
    {
      category: [
        {
          id: "1",
          name: "Category 1",
        },
        {
          id: "2",
          name: "Category 2",
        },
        {
          id: "3",
          name: "Category 3",
        },
        {
          id: "4",
          name: "Category 4",
        },
      ],
      id: "1",
      location: "Location 1",
      maximumGuests: 10,
      name: "Villa 1",
      standardGuests: 5,
      thumbnail: "https://picsum.photos/200/300",
      type: "Type 1",
    },
  ];
  const RenderVilla = () => {
    return (
      <ScrollView
        className="flex "
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {villas.map((villa, index) => (
          <VillaCard key={index} villa={villa} />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="h-full p-5 pb-24">
      <RenderModal />
      <DisplayDate />
      <RenderCategory />
      <RenderVilla />
    </SafeAreaView>
  );
};

export default Home;
