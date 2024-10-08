import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { BackButton } from "@/components";
import ProcessBar from "./ProgessBar";
import PickAddress from "./PickAddress";
import AddCategory from "./AddCategory";
import { CategoryType } from "@/types/CategoryType";
import SettingPrice from "./SettingPrice";
import { PriceType } from "@/types/PriceType";
import AddImages from "./AddImages";
import Infomation from "./Infomation";

/**
 * AddVilla Screen
 *  */

const AddVilla = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<{
    address: {
      provide: string;
      district: string;
      ward: string;
      street: string;
    };
    utilities: CategoryType[];
    price: PriceType;
    images: File[];
    information: {
      title: string;
      description: string;
      email: string;
      website: string;
      type: string;
      maxGuest: number;
      bedRoom: number;
      standardGuest: number;
    };
  }>({
    address: {
      provide: "",
      district: "",
      ward: "",
      street: "",
    },
    utilities: [],
    price: {
      defaultPrice: 0,
      priceHoliday: [],
      priceSeason: [],
      priceWeekend: [],
    },
    images: [],
    information: {
      title: "",
      description: "",
      email: "",
      website: "",
      type: "",
      maxGuest: 0,
      bedRoom: 0,
      standardGuest: 0,
    },
  });

  const RenderStep1 = () => {
    const handleChange = (key: string, value: string) => {
      setData((prevData) => ({
        ...prevData,
        information: {
          ...prevData.information,
          [key]: value,
        },
      }));
    };
    return (
      <Infomation
        setStep={setStep}
        data={data.information}
        onChange={handleChange}
      />
    );
  };
  // Render Step 2
  const RenderStep2 = () => {
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
  // Render Step 3
  const RenderStep3 = () => {
    // update utilities
    const handleChange = (data: CategoryType[]) => {
      setData((prevData) => ({
        ...prevData,
        utilities: data,
      }));
    };
    return (
      <AddCategory
        setStep={setStep}
        utilities={data.utilities}
        handleChange={handleChange}
      />
    );
  };
  // Render Step 4
  const RenderStep4 = () => {
    const handleChange = (data: PriceType) => {
      setData((prevData) => ({
        ...prevData,
        price: data,
      }));
    };
    return (
      <SettingPrice
        setStep={setStep}
        price={data.price}
        onChange={handleChange}
      />
    );
  };
  // Render Step 5
  const RenderStep5 = () => {
    return <AddImages setStep={setStep} />;
  };

  // Render Step
  const RenderStep = () => {
    return (
      <ScrollView>
        {step === 1 && (
          <>
            <RenderStep1 />
            <ProcessBar step={step} />
          </>
        )}
        {step === 2 && (
          <>
            <RenderStep2 />
            <ProcessBar step={step} />
          </>
        )}
        {step === 3 && (
          <>
            <RenderStep3 />
            <ProcessBar step={step} />
          </>
        )}
        {step === 4 && (
          <>
            <RenderStep4 />
            <ProcessBar step={step} />
          </>
        )}
        {step === 5 && (
          <>
            <RenderStep5 />
            <ProcessBar step={step} />
          </>
        )}
      </ScrollView>
    );
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
    </SafeAreaView>
  );
};

export default AddVilla;