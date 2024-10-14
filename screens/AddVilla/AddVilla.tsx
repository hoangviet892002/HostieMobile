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
import { Type } from "@/types";

/**
 * AddVilla Screen
 *  */
interface AddressType {
  provide: {
    label: string;
    value: string;
  };
  district: {
    label: string;
    value: string;
  };
  ward: {
    label: string;
    value: string;
  };
  address: string;
  phones: string[];
}

interface informationType {
  name: string;
  num_bath_room: number;
  num_bed_room: number;
  num_of_beds: number;
  max_guests: number;
  type: Type;
}

interface PriceType {
  price_default: number;
  price_weekend: { day: string; price: string }[];
  price_weeknd_delete: number[];
  price_special: { day: string; price: string }[];
  price_special_delete: number[];
  price_season: { start_date: string; end_date: string; price: string }[];
  price_season_delete: number[];
}
const AddVilla = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<{
    address: AddressType;
    utilities: CategoryType[];
    price: PriceType;
    images: File[];
    information: informationType;
  }>({
    address: {
      provide: {
        label: "",
        value: "",
      },
      district: {
        label: "",
        value: "",
      },
      ward: {
        label: "",
        value: "",
      },
      address: "",
      phones: ["sdadsa"],
    },
    utilities: [],
    price: {
      price_default: 0,
      price_season: [],
      price_season_delete: [],
      price_special: [],
      price_special_delete: [],
      price_weekend: [],
      price_weeknd_delete: [],
    },
    images: [],
    information: {
      max_guests: 2,
      name: "x",
      num_bath_room: 2,
      num_bed_room: 2,
      num_of_beds: 2,
      type: {
        id: "",
        name: "",
        description: "",
      },
    },
  });

  const RenderStep1 = () => {
    return (
      <Infomation setStep={setStep} data={data.information} setData={setData} />
    );
  };
  // Render Step 2
  const RenderStep2 = () => {
    return (
      <PickAddress
        setStep={setStep}
        formData={data.address}
        setData={setData}
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
