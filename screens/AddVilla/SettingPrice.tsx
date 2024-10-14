// SettingPrice.tsx

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";

import { Formik } from "formik";
import { DateTimePicker, DateRangePicker } from "@/components";
import { parseDate } from "@/utils/parseDate";

interface PriceType {
  price_default: number;
  price_weekend: { day: string; price: string }[];
  price_weeknd_delete: number[];
  price_special: { day: string; price: string }[];
  price_special_delete: number[];
  price_season: { start_date: string; end_date: string; price: string }[];
  price_season_delete: number[];
}
interface RenderInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  type: "text" | "select" | "number" | "area" | "multiInput";
}
interface SettingPriceProps {
  setStep: (step: number) => void;
  price: PriceType;
  setData: (data: any) => void;
}

const SettingPrice: React.FC<SettingPriceProps> = ({
  setStep,
  price,
  setData,
}) => {
  const data: PriceType = price;
  const RenderInput = ({
    label,
    value,
    onChange,
    error,
    type,
    setFieldValue,
  }: RenderInputProps & {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    switch (type) {
      case "text":
        return (
          <View className="mx-5">
            <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            <TextInput
              placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
            />

            {error && <Text style={{ color: "red" }}>{error}</Text>}
          </View>
        );

      case "number":
        return (
          <View className="mx-5">
            <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            <TextInput
              placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
            />
            {error && <Text style={{ color: "red" }}>{error}</Text>}
          </View>
        );

      case "multiInput":
        const [modalVisible, setModalVisible] = useState(false);

        return (
          <View style={{ marginHorizontal: 20 }}>
            <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            {value.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {label === "Giá cuối tuần" && (
                  <View style={{ flexDirection: "row" }} className="flex">
                    <TextInput
                      placeholder="Ngày"
                      onChangeText={(text) => {
                        const newValue = [...value];
                        newValue[index].day = text;
                        onChange(newValue);
                      }}
                      keyboardType="numeric"
                      value={item.day}
                      autoCapitalize="none"
                      style={{
                        borderWidth: 1,
                        borderColor: "gray",
                        borderRadius: 5,
                        padding: 10,
                        marginBottom: 10,
                        width: 100,
                      }}
                    />
                    <TextInput
                      placeholder="Giá"
                      onChangeText={(text) => {
                        const newValue = [...value];
                        newValue[index].price = text;
                        onChange(newValue);
                      }}
                      value={item.price}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: "gray",
                        borderRadius: 5,
                        padding: 10,
                        marginBottom: 10,
                        width: 100,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        const newValue = [...value];
                        newValue.splice(index, 1);
                        onChange(newValue);
                      }}
                      style={{
                        backgroundColor: "red",
                        padding: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: "white" }}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {label === "Giá theo mùa" && (
                  <View
                    className="bg-white rounded-2xl w-full p-4 my-2"
                    style={{
                      elevation: 3,
                    }}
                  >
                    <View className="flex flex-row justify-between items-center ">
                      {/* Button to Open Date Picker Modal */}
                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                          backgroundColor: "#1E90FF",
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          borderRadius: 6,
                          marginRight: 10,
                        }}
                        accessibilityLabel="Choose Start Date"
                      >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                          Chọn ngày
                        </Text>
                      </TouchableOpacity>

                      {/* Price Input */}
                      <TextInput
                        placeholder="Giá"
                        onChangeText={(text) => {
                          const newValue = [...value];
                          newValue[index].price = text;
                          onChange(newValue);
                        }}
                        value={value[index].price}
                        keyboardType="numeric"
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 6,
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          marginRight: 10,
                          width: 100,
                          backgroundColor: "#fff",
                        }}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          const newValue = [...value];
                          newValue.splice(index, 1);
                          onChange(newValue);
                        }}
                        style={{
                          backgroundColor: "#FF4C4C",
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          borderRadius: 6,
                        }}
                        accessibilityLabel="Delete Item"
                      >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                          Xóa
                        </Text>
                      </TouchableOpacity>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          Alert.alert("Modal has been closed.");
                          setModalVisible(false);
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: "90%",
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              padding: 20,
                              alignItems: "center",
                            }}
                          >
                            <DateRangePicker
                              initialRange={[
                                new Date(),
                                new Date(
                                  new Date().getTime() + 48 * 60 * 60 * 1000
                                ),
                              ]}
                              onSuccess={(fromDate, toDate) => {
                                const newValue = [...value];
                                newValue[index].start_date =
                                  fromDate.toISOString();
                                newValue[index].end_date = toDate.toISOString();
                                onChange(newValue);
                                setModalVisible(false);
                              }}
                              // Add any additional props required by your DateRangePicker
                            />
                          </View>
                        </View>
                      </Modal>
                    </View>
                    {/* Display Selected Date Range */}
                    <View style={{ flex: 1, marginRight: 10 }}>
                      {value[index].start_date && value[index].end_date && (
                        <Text>
                          {parseDate(value[index].start_date)} -{" "}
                          {parseDate(value[index].end_date)}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                {label === "Giá đặc biệt" && (
                  <View
                    className="bg-white rounded-2xl w-full p-4 my-2"
                    style={{
                      elevation: 3,
                    }}
                  >
                    <View className="flex flex-row justify-between items-center ">
                      {/* Button to Open Date Picker Modal */}
                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                          backgroundColor: "#1E90FF",
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          borderRadius: 6,
                          marginRight: 10,
                        }}
                        accessibilityLabel="Choose Start Date"
                      >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                          Chọn ngày
                        </Text>
                      </TouchableOpacity>

                      {/* Price Input */}
                      <TextInput
                        placeholder="Giá"
                        onChangeText={(text) => {
                          const newValue = [...value];
                          newValue[index].price = text;
                          onChange(newValue);
                        }}
                        value={value[index].price}
                        keyboardType="numeric"
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 6,
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          marginRight: 10,
                          width: 100,
                          backgroundColor: "#fff",
                        }}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          const newValue = [...value];
                          newValue.splice(index, 1);
                          onChange(newValue);
                        }}
                        style={{
                          backgroundColor: "#FF4C4C",
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          borderRadius: 6,
                        }}
                        accessibilityLabel="Delete Item"
                      >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                          Xóa
                        </Text>
                      </TouchableOpacity>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          Alert.alert("Modal has been closed.");
                          setModalVisible(false);
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: "90%",
                              backgroundColor: "#fff",
                              borderRadius: 10,
                              padding: 20,
                              alignItems: "center",
                            }}
                          >
                            <DateTimePicker
                              onSuccess={(date) => {
                                const newValue = [...value];
                                newValue[index].day = date.toISOString();
                                onChange(newValue);
                                setModalVisible(false);
                              }}
                            />
                          </View>
                        </View>
                      </Modal>
                    </View>
                    {/* Display Selected Date Range */}
                    <View style={{ flex: 1, marginRight: 10 }}>
                      {value[index].day && (
                        <Text>{parseDate(value[index].day)}</Text>
                      )}
                    </View>
                  </View>
                )}
                {/* another label */}

                {label !== "Giá cuối tuần" &&
                  label !== "Giá theo mùa" &&
                  label !== "Giá đặc biệt" && (
                    <View className="flex w-full flex-row justify-between">
                      <TextInput
                        className="w-1/2"
                        placeholder={
                          label.charAt(0).toUpperCase() + label.slice(1)
                        }
                        onChangeText={(text) => {
                          const newValue = [...value];
                          newValue[index].price = text;
                          onChange(newValue);
                        }}
                        value={item.price}
                        keyboardType="numeric"
                        style={{
                          borderWidth: 1,
                          borderColor: "gray",
                          borderRadius: 5,
                          padding: 10,
                          marginBottom: 10,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const newValue = [...value];
                          newValue.splice(index, 1);
                          onChange(newValue);
                        }}
                        className="flex items-center justify-center w-1/4"
                        style={{
                          borderWidth: 1,
                          backgroundColor: "red",
                          borderRadius: 5,
                          padding: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{ color: "white" }}>Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                {error && <Text style={{ color: "red" }}>{error}</Text>}
              </View>
            ))}
            <TouchableOpacity
              onPress={() => {
                onChange([...value, { day: "", price: "" }]);
              }}
              style={{
                backgroundColor: "blue",
                padding: 10,
                borderRadius: 5,
                width: 100,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>Thêm</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return <Text>Not found</Text>;
    }
  };
  const element: RenderInputProps[] = [
    {
      label: "Giá mặc định",
      value: data.price_default,
      onChange: (value) => {},
      type: "number",
    },
    {
      label: "Giá cuối tuần",
      value: data.price_weekend,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "Giá cuối tuần xóa",
      value: data.price_weeknd_delete,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "Giá đặc biệt",
      value: data.price_special,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "Giá đặc biệt xóa",
      value: data.price_special_delete,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "Giá theo mùa",
      value: data.price_season,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "Giá theo mùa xóa",
      value: data.price_season_delete,
      onChange: (value) => {},
      type: "multiInput",
    },
  ];
  return (
    <View>
      <Formik
        initialValues={data}
        enableReinitialize={false}
        onSubmit={(values) => {
          setStep(5);
        }}
        validate={(values) => {
          const errors: any = {};
          data.price_default = values.price_default;
          return errors;
        }}
      >
        {({
          handleSubmit,
          errors,
          handleBlur,
          handleChange: formikHandleChange,
          values,
          setFieldValue,
        }) => (
          <View>
            {element.map((item, index) => (
              <>
                <RenderInput
                  key={index}
                  label={item.label}
                  value={
                    values[item.label as keyof typeof values] ||
                    // or value is a array
                    (Array.isArray(item.value) ? item.value : item.value.value)
                  }
                  onChange={(value) => {
                    setFieldValue(item.label, value);
                  }}
                  setFieldValue={setFieldValue}
                  error={
                    typeof errors[item.label as keyof typeof errors] ===
                    "string"
                      ? (errors[item.label as keyof typeof errors] as string)
                      : undefined
                  }
                  type={item.type}
                />
              </>
            ))}

            <View className="flex flex-row justify-between m-4">
              <TouchableOpacity
                className="flex items-center justify-center"
                onPress={() => {
                  setStep(3);
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
                onPress={() => handleSubmit()}
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
        )}
      </Formik>
    </View>
  );
};

// Render Modals for Weekend Selection

export default SettingPrice;
