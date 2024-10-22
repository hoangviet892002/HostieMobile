import { getDistricts, getProvinces, getWards } from "@/apis/region";
import { postResidence } from "@/apis/residences";
import { Colors } from "@/constants/Colors";
import { RegionType } from "@/types";
import {
  ResidencesStep1,
  ResidencesStep2,
} from "@/types/request/ResidencesRequest";

import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import { use } from "i18next";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
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
interface PickAddressProps {
  setStep: (step: number) => void;
  formData: AddressType;
  setData: (data: any) => void;
  setId: (id: string) => void;
  id: string;
}
interface RenderInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  type: "text" | "select" | "number" | "area" | "multiInput";
}
const PickAddress: React.FC<PickAddressProps> = ({
  setStep,
  formData,
  setData,
  id,
  setId,
}) => {
  const [data] = useState<AddressType>(formData);

  const [optionProvide, setOptionProvide] = useState<RegionType[]>([]);
  const [optionDistrict, setOptionDistrict] = useState<RegionType[]>([]);
  const [optionWard, setOptionWard] = useState<RegionType[]>([]);
  const fetchRegion = async () => {
    const response = await getProvinces();
    if (response.data) {
      setOptionProvide(response.data);
      setOptionDistrict([]);
      setOptionWard([]);
    }
  };
  const fetchDistricts = async (codeProvide: string) => {
    const response = await getDistricts(codeProvide);
    if (response.data) {
      setOptionDistrict(response.data);
      setOptionWard([]);
    }
  };
  const fetchWards = async (codeDistrict: string) => {
    const response = await getWards(codeDistrict);
    if (response.data) {
      setOptionWard(response.data);
    }
  };
  useEffect(() => {
    fetchRegion();
  }, []);

  useEffect(() => {
    const fetchRegion = async () => {
      if (formData.district.value) {
        const response = await getDistricts(formData.district.value);
        if (response.data) {
          setOptionWard(response.data);
        }
      }
    };
    fetchRegion();
  }, [formData.district]);
  const element: RenderInputProps[] = [
    {
      label: "provide",
      value: formData.provide,
      type: "select",
      onChange: (value) => {},
    },
    {
      label: "district",
      value: formData.district,
      type: "select",
      onChange: (value) => {
        fetchDistricts(value.value);
      },
    },
    {
      label: "ward",
      value: formData.ward,
      type: "select",

      onChange: (value) => {},
    },
    {
      label: "address",
      value: formData.address,
      type: "text",
      onChange: (value) => {},
    },

    {
      label: "phones",
      value: formData.phones,
      type: "multiInput",
      onChange: (value) => {},
    },
  ];

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

      case "select":
        const [modalVisible, setModalVisible] = useState(false);
        return (
          // will open a modal to select

          <>
            <View className="mx-5">
              <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Text>{value.label}</Text>
              </TouchableOpacity>

              {error && <Text style={{ color: "red" }}>{error}</Text>}
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                    width: 300,
                  }}
                >
                  <Text>Select</Text>
                  {
                    // will render list of option
                    <ScrollView>
                      {label === "provide" &&
                        optionProvide.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              const value = {
                                label: item.full_name,
                                value: item.code,
                              };
                              onChange(value);
                              fetchDistricts(item.code);
                              // set value for ward and district to empty
                              setFieldValue("district", {
                                label: "",
                                value: "",
                              });
                              setFieldValue("ward", { label: "", value: "" });
                              setModalVisible(false);
                            }}
                            style={{
                              padding: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: "gray",
                            }}
                          >
                            <Text>{item.full_name}</Text>
                          </TouchableOpacity>
                        ))}
                      {label === "district" &&
                        optionDistrict.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              const value = {
                                label: item.full_name,
                                value: item.code,
                              };
                              onChange(value);
                              // set value for ward
                              fetchWards(item.code);
                              setModalVisible(false);
                            }}
                            style={{
                              padding: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: "gray",
                            }}
                          >
                            <Text>{item.name}</Text>
                          </TouchableOpacity>
                        ))}
                      {label === "ward" &&
                        optionWard.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              const value = {
                                label: item.full_name,
                                value: item.code,
                              };
                              onChange(value);
                              setModalVisible(false);
                            }}
                            style={{
                              padding: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: "gray",
                            }}
                          >
                            <Text>{item.name}</Text>
                          </TouchableOpacity>
                        ))}

                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={{
                          padding: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: "gray",
                        }}
                      >
                        <Text>Close</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  }
                </View>
              </View>
            </Modal>
          </>
        );
      case "multiInput":
        return (
          <View className="mx-5">
            <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            {value.map((item: string, index: number) => (
              <View key={index} className="flex flex-row">
                <TextInput
                  className="w-4/5"
                  placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
                  onChangeText={(text) => {
                    const newPhones = [...value];
                    newPhones[index] = text;
                    onChange(newPhones);
                  }}
                  value={item}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 10,
                  }}
                />
                <TouchableOpacity
                  className="w-1/5 flex items-center"
                  onPress={() => {
                    const newPhones = [...value];
                    newPhones.splice(index, 1);
                    onChange(newPhones);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text>-</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => {
                onChange([...value, ""]);
              }}
              style={{
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
            >
              <Text>+</Text>
            </TouchableOpacity>
            {error && <Text style={{ color: "red" }}>{error}</Text>}
          </View>
        );

      default:
        return <Text>Not found</Text>;
    }
  };
  const solveApi = async (dataPost: ResidencesStep2) => {
    if (id !== "") {
      dataPost.id = id;
      setId(id);
    }
    const res = await postResidence(dataPost);

    if (res.success) {
      setId(res.data.id);
      setStep(3);
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.msg,
      });
    }
  };
  return (
    <View>
      <Formik
        initialValues={{
          provide: data.provide,
          district: data.district,
          ward: data.ward,
          address: data.address,
          phones: data.phones,
        }}
        enableReinitialize={false}
        onSubmit={(values) => {
          setData((prevData) => ({
            ...prevData,
            address: {
              provide: values.provide,
              district: values.district,
              ward: values.ward,
              address: values.address,
              phones: values.phones,
            },
          }));
          const dataPost: ResidencesStep2 = {
            address: values.address,
            district_code: values.district.value,
            id: id,
            phones: values.phones,
            province_code: values.provide.value,
            step: 2,
            ward_code: values.ward.value,
          };

          solveApi(dataPost);
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.provide.value) {
            errors.provide = "Provide is required";
          }
          if (!values.district.value) {
            errors.district = "District is required";
          }
          if (!values.ward.value) {
            errors.ward = "Ward is required";
          }
          if (!values.address) {
            errors.address = "address is required";
          }
          if (values.phones.length === 0) {
            errors.phones = "Phone is required";
          }
          // check phone is valid
          values.phones.forEach((item: string, index: number) => {
            if (!item) {
              errors.phones = "Phone is required";
            }
          });
          // check format phone
          values.phones.forEach((item: string, index: number) => {
            if (!/^\d{10}$/.test(item)) {
              errors.phones = "Phone is invalid";
            }
          });

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
                    (Array.isArray(item.value) ? item.value : item.value.value)
                    // or value is a array
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
                  setStep(1);
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

export default PickAddress;
