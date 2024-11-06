import { BackButton } from "@/components";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import AddCategory from "./AddCategory";
import PickAddress from "./PickAddress";
import ProcessBar from "./ProgessBar";
import SettingPrice from "./SettingPrice";

import { AmenityType, Type } from "@/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import AddImages from "./AddImages";
import Infomation from "./Infomation";
import { getPrice } from "@/apis/residences";

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

  price_special: { day: string; price: string }[];

  price_season: { start_date: string; end_date: string; price: string }[];
}
const AddVilla = () => {
  const [step, setStep] = useState(1);
  const [id, setId] = useState<string>("");

  // receive data from  router.push(`/AddVilla?villa=${JSON.stringify(villa)}`);  may be not receive

  const route = useRoute<RouteProp<{ params: { villa: string } }, "params">>();
  const villa = route.params?.villa;

  const fetchPrice = async (id: string) => {
    if (id) {
      const res = await getPrice(id);
      const { default_price, weekend_price, special_day_price, season_price } =
        res.data;

      const priceMap: PriceType = {
        price_default: default_price,
        price_weekend: weekend_price
          ? weekend_price.map(
              (item: { weeknd_day: string; price: string }) => ({
                day: item.weeknd_day,
                price: item.price,
              })
            )
          : [],

        price_special: special_day_price
          ? special_day_price.map((item: { date: string; price: string }) => ({
              day: item.date,
              price: item.price,
            }))
          : [],

        price_season: season_price
          ? season_price.map(
              (item: {
                start_date: string;
                end_date: string;
                price: string;
              }) => ({
                start_date: item.start_date,
                end_date: item.end_date,
                price: item.price,
              })
            )
          : [],
      };

      setData((prevData) => ({
        ...prevData,
        price: priceMap,
      }));
    }
  };
  useEffect(() => {
    if (villa) {
      const {
        residence_id,
        residence_name,
        residence_type,
        residence_type_id,
        residence_address,
        province_code,
        province,
        district_code,
        district,
        ward_code,
        ward,
        num_of_bathrooms,
        num_of_bedrooms,
        num_of_beds,
        max_guests,
        step,
        amenities,
        phones,
      } = JSON.parse(villa);
      setId(residence_id);
      setStep(step);

      fetchPrice(residence_id);

      setData((prevData) => ({
        ...prevData,
        address: {
          provide: {
            label: province || "",
            value: province_code || "",
          },
          district: {
            label: district || "",
            value: district_code || "",
          },
          ward: {
            label: ward || "",
            value: ward_code || "",
          },
          address: residence_address || "",
          phones: phones.map((phone: { phone: string }) => phone.phone) || [],
        },
        // parse amenities to utilities
        utilities: amenities.map(
          (amenity: {
            id: number;
            name: string;
            description: string;
            icon_id: number;
            icon: string;
          }) => {
            return {
              name: amenity.name,
              description: amenity.description,
              amenity_id: amenity.icon_id,
              icon: amenity.icon,
            };
          }
        ),
        information: {
          max_guests,
          name: residence_name,
          num_bath_room: num_of_bathrooms,
          num_bed_room: num_of_bedrooms,
          num_of_beds,
          type: {
            id: residence_type_id,
            name: residence_type,
            description: residence_type,
          },
        },
      }));
    }
  }, [villa]);
  const [data, setData] = useState<{
    address: AddressType;
    utilities: AmenityType[];
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
      phones: ["0987654321"],
    },
    utilities: [],
    price: {
      price_default: 0,
      price_season: [],

      price_special: [],

      price_weekend: [],
    },
    images: [],
    information: {
      max_guests: 2,
      name: "Villa Pay Lak",
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
      <Infomation
        setStep={setStep}
        data={data.information}
        setData={setData}
        id={id}
        setId={setId}
      />
    );
  };
  // Render Step 2
  const RenderStep2 = () => {
    return (
      <PickAddress
        id={id}
        setId={setId}
        setStep={setStep}
        formData={data.address}
        setData={setData}
      />
    );
  };
  // Render Step 3
  const RenderStep3 = () => {
    // update utilities
    return (
      <AddCategory
        id={id}
        setId={setId}
        setStep={setStep}
        utilities={data.utilities}
        setData={setData}
      />
    );
  };

  // Render Step 4
  const RenderStep4 = () => {
    return (
      <SettingPrice
        setStep={setStep}
        price={data.price}
        setData={setData}
        id={id}
        setId={setId}
      />
    );
  };
  // Render Step 5
  const RenderStep5 = () => {
    return <AddImages setStep={setStep} id={id} setId={setId} />;
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
