// SettingPrice.tsx

import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { postResidence } from "@/apis/residences";
import { DateRangePicker, DateTimePicker } from "@/components";
import { ResidencesStep4 } from "@/types/request/ResidencesRequest";
import { parseDate } from "@/utils/parseDate";
import { Formik } from "formik";
import Toast from "react-native-toast-message";
import useToast from "@/hooks/useToast";

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
  setId: (id: string) => void;
  id: string;
}

const SettingPrice: React.FC<SettingPriceProps> = ({
  setStep,
  price,
  setData,
  id,
  setId,
}) => {
  const { showToast } = useToast();
  const solveApi = async (dataPost: ResidencesStep4) => {
    if (id !== "") {
      dataPost.id = id;
      setId(id);
    }
    const res = await postResidence(dataPost);

    if (res.success) {
      setId(res.data.id);
      setStep(5);
    } else {
      showToast(res);
    }
  };
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
              value={String(value)}
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
                {label === "price_weekend" && (
                  <View
                    style={{ flexDirection: "row", elevation: 3 }}
                    className="flex bg-white rounded-2xl w-full p-4 my-2 justify-between"
                  >
                    <TextInput
                      placeholder="Ngày"
                      onChangeText={(text) => {
                        const newValue = [...value];
                        newValue[index].day = text;
                        onChange(newValue);
                      }}
                      keyboardType="numeric"
                      value={String(item.day)}
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
                      value={String(item.price)}
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
                {label === "price_season" && (
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
                        value={String(value[index].price)}
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
                {label === "price_special" && (
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

                {label !== "price_weekend" &&
                  label !== "price_season" &&
                  label !== "price_special" && (
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
      label: "price_default",
      value: data.price_default,
      onChange: (value) => {},
      type: "number",
    },
    {
      label: "price_weekend",
      value: data.price_weekend,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "price_weeknd_delete",
      value: data.price_weeknd_delete,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "price_special",
      value: data.price_special,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "price_special_delete",
      value: data.price_special_delete,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "price_season",
      value: data.price_season,
      onChange: (value) => {},
      type: "multiInput",
    },
    {
      label: "price_season_delete",
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
          setData((prevData) => ({
            ...prevData,
            price: values,
          }));

          // parseInt all value number

          const dataPost: ResidencesStep4 = {
            step: 4,
            id: id,
            price_default: parseInt(values.price_default.toString()),
            price_weekend: values.price_weekend.map((item) => ({
              day: parseInt(item.day.toString()),
              price: parseInt(item.price.toString()),
            })),
            price_weeknd_delete: values.price_weeknd_delete,
            price_special: values.price_special.map((item) => ({
              day: item.day,
              price: parseInt(item.price.toString()),
            })),
            price_special_delete: values.price_special_delete,
            price_season: values.price_season.map((item) => ({
              start_date: item.start_date,
              end_date: item.end_date,
              price: parseInt(item.price.toString()),
            })),
            price_season_delete: values.price_season_delete,
          };

          solveApi(dataPost);
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.price_default) {
            errors.price_default = "Price default is required";
          }
          if (values.price_default <= 0) {
            errors.price_default = "Price default must be greater than 0";
          }

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
              <RenderInput
                key={index}
                label={item.label}
                value={
                  values[item.label as keyof typeof values] ||
                  (Array.isArray(item.value) ? item.value : item.value.value)
                }
                onChange={(value) => {
                  setFieldValue(item.label, value);
                }}
                setFieldValue={setFieldValue}
                error={
                  typeof errors[item.label as keyof typeof errors] === "string"
                    ? (errors[item.label as keyof typeof errors] as string)
                    : undefined
                }
                type={item.type}
              />
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
