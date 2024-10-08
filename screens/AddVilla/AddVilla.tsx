import { View, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { BackButton } from "@/components";
import ProcessBar from "./ProgessBar";
import PickAddress from "./PickAddress";
import AddCategory from "./AddCategory";

/**
 * AddVilla Screen
 *  */

const AddVilla = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    address: {
      provide: "",
      district: "",
      ward: "",
      street: "",
    },
    utilities: [],
  });

  const RenderStep1 = () => {
    const handleChange = (key: string, value: string) => {
      setData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [key]: value,
        },
      }));
    };
    return (
      <PickAddress
        formData={data.address}
        onChange={handleChange}
        setStep={setStep as any as (step: number) => void}
      />
    );
  };
  // Render Step 2
  const RenderStep2 = () => {
    return <AddCategory />;
  };
  // Render Step 3
  const RenderStep3 = () => {
    return (
      <View>
        <Text>Step 3</Text>
      </View>
    );
  };
  // Render Step 4
  const RenderStep4 = () => {
    return (
      <View>
        <Text>Step 4</Text>
      </View>
    );
  };
  // Render Step 5
  const RenderStep5 = () => {
    return (
      <View>
        <Text>Step 5</Text>
      </View>
    );
  };

  // Render Step
  const RenderStep = () => {
    switch (step) {
      case 1:
        return <RenderStep1 />;
      case 2:
        return <RenderStep2 />;
      case 3:
        return <RenderStep3 />;
      case 4:
        return <RenderStep4 />;
      case 5:
        return <RenderStep5 />;
      default:
        return <RenderStep1 />;
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Animatable.View
        className="flex flex-row items-center"
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex ">
          <Text className="text-3xl font-bold ">Thêm dịch vụ</Text>
        </View>
      </Animatable.View>
      <RenderStep />
      <ProcessBar step={step} />
    </SafeAreaView>
  );
};

export default AddVilla;
