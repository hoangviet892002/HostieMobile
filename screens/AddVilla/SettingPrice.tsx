// SettingPrice.tsx

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import {
  PriceType,
  PriceWeekendType,
  PriceSeasonType,
  PriceHolidayType,
} from "@/types/PriceType";
import { Formik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";

interface SettingPriceProps {
  setStep: (step: number) => void;
  price: PriceType;
  onChange: (data: PriceType) => void;
}

const SettingPrice: React.FC<SettingPriceProps> = ({
  setStep,
  price,
  onChange,
}) => {
  const [dataPrice] = useState<PriceType>(price);

  const RenderLine = () => (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: "gray",
        marginVertical: 10,
      }}
    />
  );

  // Weekend Price State
  const optionsWeekend = [
    { id: "1", name: "Saturday", description: "Saturday" },
    { id: "2", name: "Sunday", description: "Sunday" },
  ];
  const [selectOptionWeekend, setSelectOptionWeekend] = useState(
    optionsWeekend[0]
  );
  const [modalVisibleWeekend, setModalVisibleWeekend] = useState(false);
  const [optionsWeekendPrice] = useState([
    { id: "1", weekendPrice: 0 },
    { id: "2", weekendPrice: 0 },
  ]);
  const [selectedOptionsWeekendPrice, setSelectedOptionsWeekendPrice] =
    useState(optionsWeekendPrice[0]);
  const [modalVisibleWeekendPrice, setModalVisibleWeekendPrice] =
    useState(false);
  const [descriptionWeekend, setDescriptionWeekend] = useState("");
  const [PriceWeekend, setPriceWeekend] = useState<PriceWeekendType[]>(
    price.priceWeekend
  );

  // Holiday Price State
  const optionsHoliday = [
    { id: "1", name: "Christmas", description: "Christmas" },
    { id: "2", name: "New Year", description: "New Year" },
  ];
  const [selectOptionHoliday, setSelectOptionHoliday] = useState(
    optionsHoliday[0]
  );
  const [modalVisibleHoliday, setModalVisibleHoliday] = useState(false);
  const [optionsHolidayPrice] = useState([
    { id: "1", holidayPrice: 0 },
    { id: "2", holidayPrice: 0 },
  ]);
  const [selectedOptionsHolidayPrice, setSelectedOptionsHolidayPrice] =
    useState(optionsHolidayPrice[0]);
  const [modalVisibleHolidayPrice, setModalVisibleHolidayPrice] =
    useState(false);
  const [descriptionHoliday, setDescriptionHoliday] = useState("");
  const [PriceHoliday, setPriceHoliday] = useState<PriceHolidayType[]>(
    price.priceHoliday
  );

  // Season Price State
  const [seasonStartDate, setSeasonStartDate] = useState<Date | null>(null);
  const [seasonEndDate, setSeasonEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [seasonPrice, setSeasonPrice] = useState("");
  const [descriptionSeason, setDescriptionSeason] = useState("");
  const [PriceSeason, setPriceSeason] = useState<PriceSeasonType[]>(
    price.priceSeason
  );

  // Handle Date Picker
  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSeasonStartDate(selectedDate);
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSeasonEndDate(selectedDate);
    }
  };

  const RenderInput = () => {
    return (
      <Formik
        initialValues={{
          defaultPrice: dataPrice.defaultPrice || 0,
          descriptionWeekend: descriptionWeekend,
          descriptionHoliday: descriptionHoliday,
          descriptionSeason: descriptionSeason,
          seasonPrice: seasonPrice,
        }}
        onSubmit={(values) => {
          // Consolidate all price data
          const updatedPrice: PriceType = {
            defaultPrice: values.defaultPrice,
            priceWeekend: PriceWeekend,
            priceHoliday: PriceHoliday,
            priceSeason: PriceSeason,
          };
          onChange(updatedPrice);
          setStep(5);
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.defaultPrice || values.defaultPrice === 0) {
            errors.defaultPrice = "Required";
          }
          // check type number
          if (values.defaultPrice && isNaN(Number(values.defaultPrice))) {
            errors.defaultPrice = "Price must be a number";
          }
          return errors;
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            {/* Default Price */}

            <RenderLine />

            {/* Weekend Price */}
            <View className="m-3">
              <View className="flex flex-row justify-between">
                <View className="w-40">
                  <Text>Price Weekend</Text>
                  <TouchableOpacity
                    className="border border-gray-400 p-2 rounded-lg my-2"
                    style={{ backgroundColor: Colors.primary }}
                    onPress={() => setModalVisibleWeekend(!modalVisibleWeekend)}
                  >
                    <Text>{selectOptionWeekend.description}</Text>
                  </TouchableOpacity>
                </View>
                <View className="w-40">
                  <Text>Price</Text>
                  <TouchableOpacity
                    className="border border-gray-400 p-2 rounded-lg my-2"
                    style={{ backgroundColor: Colors.primary }}
                    onPress={() =>
                      setModalVisibleWeekendPrice(!modalVisibleWeekendPrice)
                    }
                  >
                    <Text>{selectedOptionsWeekendPrice.weekendPrice}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text>Description</Text>
                <View>
                  <TextInput
                    className="border border-gray-400 p-2 rounded-lg my-2"
                    placeholder="Description"
                    onChangeText={handleChange("descriptionWeekend")}
                    value={values.descriptionWeekend}
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                    }}
                  />
                  {/* Add plus button */}
                  <TouchableOpacity
                    onPress={() => {
                      if (values.descriptionWeekend.trim() === "") return;
                      setPriceWeekend([
                        ...PriceWeekend,
                        {
                          name: selectOptionWeekend.description,
                          weekendPrice:
                            selectedOptionsWeekendPrice.weekendPrice,
                          description: values.descriptionWeekend,
                        },
                      ]);
                    }}
                    style={{
                      backgroundColor: Colors.primary,
                      padding: 10,
                      borderRadius: 5,
                      margin: 5,
                    }}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Show list price weekend */}
              <View>
                {PriceWeekend.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "gray",
                    }}
                  >
                    <Text style={{ width: "30%" }}>{item.name}</Text>
                    <Text style={{ width: "30%" }}>{item.weekendPrice}</Text>
                    <Text style={{ width: "30%" }}>{item.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            <RenderLine />

            {/* Holiday Price */}
            <View className="m-3">
              <View className="flex flex-row justify-between">
                <View className="w-40">
                  <Text>Price Holiday</Text>
                  <TouchableOpacity
                    className="border border-gray-400 p-2 rounded-lg my-2"
                    style={{ backgroundColor: Colors.primary }}
                    onPress={() => setModalVisibleHoliday(!modalVisibleHoliday)}
                  >
                    <Text>{selectOptionHoliday.description}</Text>
                  </TouchableOpacity>
                </View>
                <View className="w-40">
                  <Text>Price</Text>
                  <TouchableOpacity
                    className="border border-gray-400 p-2 rounded-lg my-2"
                    style={{ backgroundColor: Colors.primary }}
                    onPress={() =>
                      setModalVisibleHolidayPrice(!modalVisibleHolidayPrice)
                    }
                  >
                    <Text>{selectedOptionsHolidayPrice.holidayPrice}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text>Description</Text>
                <View>
                  <TextInput
                    className="border border-gray-400 p-2 rounded-lg my-2"
                    placeholder="Description"
                    onBlur={handleBlur("descriptionHoliday")}
                    onChangeText={handleChange("descriptionHoliday")}
                    value={values.descriptionHoliday}
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                    }}
                  />
                  {/* Add plus button */}
                  <TouchableOpacity
                    onPress={() => {
                      if (values.descriptionHoliday.trim() === "") return; // Prevent adding empty descriptions
                      setPriceHoliday([
                        ...PriceHoliday,
                        {
                          name: selectOptionHoliday.description,
                          holidayPrice:
                            selectedOptionsHolidayPrice.holidayPrice,
                          description: values.descriptionHoliday,
                        },
                      ]);
                    }}
                    style={{
                      backgroundColor: Colors.primary,
                      padding: 10,
                      borderRadius: 5,
                      margin: 5,
                    }}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Show list price holiday */}
              <View>
                {PriceHoliday.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "gray",
                    }}
                  >
                    <Text style={{ width: "30%" }}>{item.name}</Text>
                    <Text style={{ width: "30%" }}>{item.holidayPrice}</Text>
                    <Text style={{ width: "30%" }}>{item.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            <RenderLine />

            {/* Season Price */}
            <View className="m-3">
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Season Price
              </Text>
              {/* Start Date */}
              <Text>Start Date</Text>
              <TouchableOpacity
                className="border border-gray-400 p-2 rounded-lg my-2"
                style={{ backgroundColor: Colors.primary }}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text>
                  {seasonStartDate
                    ? seasonStartDate.toLocaleDateString()
                    : "Select Start Date"}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={seasonStartDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeStartDate}
                />
              )}

              {/* End Date */}
              <Text>End Date</Text>
              <TouchableOpacity
                className="border border-gray-400 p-2 rounded-lg my-2"
                style={{ backgroundColor: Colors.primary }}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text>
                  {seasonEndDate
                    ? seasonEndDate.toLocaleDateString()
                    : "Select End Date"}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={seasonEndDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeEndDate}
                />
              )}

              {/* Season Price */}
              <Text>Season Price</Text>
              <TextInput
                className="border border-gray-400 p-2 rounded-lg my-2"
                placeholder="Season Price"
                onChangeText={handleChange("seasonPrice")}
                onBlur={handleBlur("seasonPrice")}
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
              />

              {/* Description */}
              <Text>Description</Text>
              <TextInput
                className="border border-gray-400 p-2 rounded-lg my-2"
                placeholder="Description"
                onChangeText={handleChange("descriptionSeason")}
                onBlur={handleBlur("descriptionSeason")}
                value={values.descriptionSeason}
                style={{
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
              />

              {/* Add Season Button */}
              <TouchableOpacity
                onPress={() => {
                  if (
                    !seasonStartDate ||
                    !seasonEndDate ||
                    !seasonPrice ||
                    values.descriptionSeason.trim() === ""
                  )
                    return; // Prevent adding empty descriptions
                  setPriceSeason([
                    ...PriceSeason,
                    {
                      startDate: seasonStartDate,
                      endDate: seasonEndDate,
                      seasonPrice: Number(seasonPrice),
                      description: values.descriptionSeason,
                    },
                  ]);
                }}
                style={{
                  backgroundColor: Colors.primary,
                  padding: 10,
                  borderRadius: 5,
                  margin: 5,
                }}
              >
                <Text style={{ color: "white" }}>Add Season</Text>
              </TouchableOpacity>

              {/* Show list price season */}
              <View>
                {PriceSeason.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "gray",
                    }}
                  >
                    <Text style={{ width: "25%" }}>
                      {item.startDate.toLocaleDateString()}
                    </Text>
                    <Text style={{ width: "25%" }}>
                      {item.endDate.toLocaleDateString()}
                    </Text>
                    <Text style={{ width: "25%" }}>{item.seasonPrice}</Text>
                    <Text style={{ width: "25%" }}>{item.description}</Text>
                  </View>
                ))}
              </View>
            </View>
            <RenderLine />
            <View className="m-3">
              <Text>Default Price</Text>
              <TextInput
                className="border border-gray-400 p-2 rounded-lg my-2"
                placeholder="Default Price"
                onChangeText={handleChange("defaultPrice")}
                value={values.defaultPrice.toString()}
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
              />

              {errors.defaultPrice && touched.defaultPrice && (
                <Text style={{ color: "red" }}>{errors.defaultPrice}</Text>
              )}
            </View>

            {/* Navigation Buttons */}
            <View className="flex flex-row justify-between m-4">
              <TouchableOpacity
                className="flex items-center justify-center"
                onPress={() => {
                  const updatedPrice: PriceType = {
                    defaultPrice: values.defaultPrice,
                    priceWeekend: PriceWeekend,
                    priceHoliday: PriceHoliday,
                    priceSeason: PriceSeason,
                  };

                  onChange(updatedPrice);
                  setStep(3);
                }}
                style={{
                  backgroundColor: Colors.primary,
                  padding: 10,
                  borderRadius: 5,
                  width: 100,
                }}
              >
                <Text style={{ color: "white" }}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex items-center justify-center"
                onPress={() => handleSubmit()}
                style={{
                  backgroundColor: Colors.primary,
                  padding: 10,
                  borderRadius: 5,
                  width: 100,
                }}
              >
                <Text style={{ color: "white" }}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    );
  };

  // Render Modals for Weekend Selection
  const RenderModalWeekend = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleWeekend}
      onRequestClose={() => setModalVisibleWeekend(!modalVisibleWeekend)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
          }}
        >
          {optionsWeekend.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectOptionWeekend(item);
                setModalVisibleWeekend(false);
              }}
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 5,
                marginVertical: 5,
              }}
            >
              <Text style={{ color: "white" }}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const RenderModalWeekendPrice = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleWeekendPrice}
      onRequestClose={() =>
        setModalVisibleWeekendPrice(!modalVisibleWeekendPrice)
      }
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
          }}
        >
          {optionsWeekendPrice.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedOptionsWeekendPrice(item);
                setModalVisibleWeekendPrice(false);
              }}
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 5,
                marginVertical: 5,
              }}
            >
              <Text style={{ color: "white" }}>{item.weekendPrice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  // Render Modals for Holiday Selection
  const RenderModalHoliday = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleHoliday}
      onRequestClose={() => setModalVisibleHoliday(!modalVisibleHoliday)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
          }}
        >
          {optionsHoliday.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectOptionHoliday(item);
                setModalVisibleHoliday(false);
              }}
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 5,
                marginVertical: 5,
              }}
            >
              <Text style={{ color: "white" }}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const RenderModalHolidayPrice = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleHolidayPrice}
      onRequestClose={() =>
        setModalVisibleHolidayPrice(!modalVisibleHolidayPrice)
      }
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
          }}
        >
          {optionsHolidayPrice.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedOptionsHolidayPrice(item);
                setModalVisibleHolidayPrice(false);
              }}
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 5,
                marginVertical: 5,
              }}
            >
              <Text style={{ color: "white" }}>{item.holidayPrice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <View>
      <RenderLine />
      <RenderInput />
      <RenderModalWeekend />
      <RenderModalWeekendPrice />
      <RenderModalHoliday />
      <RenderModalHolidayPrice />
    </View>
  );
};

export default SettingPrice;
