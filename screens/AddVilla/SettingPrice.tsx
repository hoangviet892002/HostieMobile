// SettingPrice.tsx

import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon, { Icons } from "@/components/Icons";

import { postResidence } from "@/apis/residences";
import { DateRangePicker, DateTimePicker } from "@/components";
import { ResidencesStep4 } from "@/types/request/ResidencesRequest";
import { parseDate, parseDateDDMMYYYY } from "@/utils/parseDate";
import { Formik } from "formik";
import Toast from "react-native-toast-message";
import useToast from "@/hooks/useToast";
import { useTranslation } from "react-i18next";

interface PriceType {
  price_default: number;
  price_weekend: { day: string; price: string }[];

  price_special: { day: string; price: string }[];

  price_season: { start_date: string; end_date: string; price: string }[];
}
interface RenderInputProps {
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  type: "text" | "select" | "number" | "area" | "multiInput";
  icon: string;
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
    name,
    label,
    value,
    onChange,
    error,
    type,
    icon,
    setFieldValue,
  }: RenderInputProps & {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    switch (type) {
      case "text":
        return (
          <View className="mx-5">
            <Text>{name}</Text>
            <TextInput
              placeholder={name}
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
              type={Icons.Feather}
              name={icon}
              size={20}
              color={Colors.primary}
            />
            <TextInput
              placeholder={name}
              onChangeText={onChange}
              value={String(value)}
              keyboardType="numeric"
              style={{
                flex: 1,
                marginLeft: 10,
                color: Colors.black,
                paddingVertical: 8,
              }}
            />
            {error && <Text style={{ color: "red" }}>{error}</Text>}
          </View>
        );

      case "multiInput":
        const [modalVisible, setModalVisible] = useState(false);

        return (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: wp(80),
              }}
            >
              <Text>{name}</Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                borderColor: Colors.primary,

                width: wp(80),
              }}
            >
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
                      style={{
                        flexDirection: "row",
                        backgroundColor: "white",
                        borderRadius: 16,
                        padding: 12,
                        marginVertical: 8,
                        alignItems: "center",
                        justifyContent: "space-between",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 5,
                        width: "100%",
                      }}
                    >
                      <TextInput
                        placeholder={t("Day")}
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
                          borderColor: "#ddd",
                          borderRadius: 10,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          width: 90,
                          fontSize: 16,
                        }}
                      />
                      <TextInput
                        placeholder={t("Price")}
                        onChangeText={(text) => {
                          const newValue = [...value];
                          newValue[index].price = text;
                          onChange(newValue);
                        }}
                        value={String(item.price)}
                        keyboardType="numeric"
                        style={{
                          borderWidth: 1,
                          borderColor: "#ddd",
                          borderRadius: 10,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          width: 90,
                          fontSize: 16,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const newValue = [...value];
                          newValue.splice(index, 1);
                          onChange(newValue);
                        }}
                        style={{
                          backgroundColor: "#ff5c5c",
                          borderRadius: 10,
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          type={Icons.Feather}
                          name="trash"
                          size={20}
                          color={Colors.white}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {label === "price_season" && (
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "white",
                        borderRadius: 16,
                        padding: 12,
                        marginVertical: 8,
                        alignItems: "center",
                        justifyContent: "space-between",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 5,
                        width: "100%",
                      }}
                    >
                      <View className="flex flex-row items-center justify-between w-full">
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
                          {value[index].start_date && value[index].end_date ? (
                            <View>
                              <Text
                                style={{
                                  color: "#fff",
                                  fontWeight: "600",
                                  fontSize: 16,
                                }}
                              >
                                {parseDateDDMMYYYY(value[index].start_date)}{" "}
                              </Text>
                              <Text
                                style={{
                                  color: "#fff",
                                  fontWeight: "600",
                                  fontSize: 16,
                                }}
                              >
                                {parseDateDDMMYYYY(value[index].end_date)}{" "}
                              </Text>
                            </View>
                          ) : (
                            <Text
                              style={{
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: 16,
                              }}
                            >
                              {t("Pick Date")}
                            </Text>
                          )}
                        </TouchableOpacity>

                        {/* Price Input */}
                        <TextInput
                          placeholder={t("Price")}
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
                          <Icon
                            type={Icons.Feather}
                            name="trash"
                            size={20}
                            color={Colors.white}
                          />
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
                                  newValue[index].end_date =
                                    toDate.toISOString();
                                  onChange(newValue);
                                  setModalVisible(false);
                                }}
                                // Add any additional props required by your DateRangePicker
                              />
                            </View>
                          </View>
                        </Modal>
                      </View>
                    </View>
                  )}
                  {label === "price_special" && (
                    <View
                      className="bg-white rounded-2xl w-full p-4 my-2"
                      style={{
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                      }}
                    >
                      <View className="flex flex-row justify-between items-center">
                        <TouchableOpacity
                          onPress={() => setModalVisible(true)}
                          style={{
                            backgroundColor: "#1E90FF",
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                          }}
                          accessibilityLabel="Choose Start Date"
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontWeight: "600",
                              fontSize: 16,
                            }}
                          >
                            {value[index].day
                              ? parseDateDDMMYYYY(value[index].day)
                              : t("Pick Date")}
                          </Text>
                        </TouchableOpacity>

                        {/* Price Input */}
                        <TextInput
                          placeholder={t("Price")}
                          onChangeText={(text) => {
                            const newValue = [...value];
                            newValue[index].price = text;
                            onChange(newValue);
                          }}
                          value={value[index].price}
                          keyboardType="numeric"
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            borderRadius: 8,
                            paddingVertical: 10,
                            paddingHorizontal: 14,
                            width: 110,
                            backgroundColor: "#fff",
                            fontSize: 16,
                          }}
                        />

                        {/* Delete Button */}
                        <TouchableOpacity
                          onPress={() => {
                            const newValue = [...value];
                            newValue.splice(index, 1);
                            onChange(newValue);
                          }}
                          style={{
                            backgroundColor: "#FF4C4C",
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                          }}
                          accessibilityLabel="Delete Item"
                        >
                          <Icon
                            type={Icons.Feather}
                            name="trash"
                            size={20}
                            color={Colors.white}
                          />
                        </TouchableOpacity>

                        {/* Modal for Date Picker */}
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={modalVisible}
                          onRequestClose={() => setModalVisible(false)}
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
                                width: "85%",
                                backgroundColor: "#fff",
                                borderRadius: 12,
                                padding: 24,
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
                    </View>
                  )}

                  {/* another label */}

                  {label !== "price_weekend" &&
                    label !== "price_season" &&
                    label !== "price_special" && (
                      <View className="flex w-full flex-row justify-between">
                        <TextInput
                          className="w-1/2"
                          placeholder={name}
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
            </View>

            <TouchableOpacity
              className="rounded-2xl w-full p-4 my-2"
              onPress={() => {
                onChange([...value, { day: "", price: "" }]);
              }}
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                width: wp(80),
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>{t("Add")}</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return <Text>Not found</Text>;
    }
  };
  const { t } = useTranslation();
  const element: RenderInputProps[] = [
    {
      name: t("Price Default"),
      label: "price_default",
      value: data.price_default,
      onChange: (value) => {},
      type: "number",
      icon: "dollar-sign",
    },
    {
      name: t("Price Weekend"),
      label: "price_weekend",
      value: data.price_weekend,
      onChange: (value) => {},
      type: "multiInput",

      icon: "calendar",
    },

    {
      name: t("Price Special"),
      label: "price_special",
      value: data.price_special,
      onChange: (value) => {},
      type: "multiInput",

      icon: "calendar",
    },

    {
      name: t("Price Season"),
      label: "price_season",
      value: data.price_season,
      onChange: (value) => {},
      type: "multiInput",

      icon: "calendar",
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

            price_special: values.price_special.map((item) => ({
              day: item.day,
              price: parseInt(item.price.toString()),
            })),

            price_season: values.price_season.map((item) => ({
              start_date: item.start_date,
              end_date: item.end_date,
              price: parseInt(item.price.toString()),
            })),
          };

          solveApi(dataPost);
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.price_default) {
            errors.price_default = t("Required");
          }
          if (values.price_default <= 0) {
            errors.price_default = t("Must be > 0");
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
          <View className="flex justify-center items-center">
            {element.map((item, index) => (
              <RenderInput
                name={item.name}
                icon={item.icon}
                key={index}
                label={item.label}
                value={values[item.label as keyof typeof values]}
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

            <View className="flex flex-row justify-between m-4 w-full p-4">
              <TouchableOpacity
                onPress={() => {
                  setStep(3);
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
                  {t("Back")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
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
                  {t("Next")}
                </Text>
                <Icon
                  name="arrow-right"
                  size={20}
                  color={Colors.white}
                  type={Icons.Feather}
                />
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
