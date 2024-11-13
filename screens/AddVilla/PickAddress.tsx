import { getDistricts, getProvinces, getWards } from "@/apis/region";
import { postResidence } from "@/apis/residences";
import { Colors } from "@/constants/Colors";
import useToast from "@/hooks/useToast";
import { RegionType } from "@/types";
import { ResidencesStep2 } from "@/types/request/ResidencesRequest";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon, { Icons } from "@/components/Icons";
import { useTranslation } from "react-i18next";
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
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  type: "text" | "select" | "number" | "area" | "multiInput";
  icon: string;
}
const PickAddress: React.FC<PickAddressProps> = ({
  setStep,
  formData,
  setData,
  id,
  setId,
}) => {
  const { showToast } = useToast();
  const [data] = useState<AddressType>(formData);
  const { t } = useTranslation();
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
      name: t("provide"),
      label: "provide",
      value: formData.provide,
      type: "select",
      onChange: (value) => {},
      icon: "map-pin",
    },
    {
      name: t("district"),
      label: "district",
      value: formData.district,
      type: "select",
      onChange: (value) => {
        fetchDistricts(value.value);
      },
      icon: "map-pin",
    },
    {
      name: t("ward"),
      label: "ward",
      value: formData.ward,
      type: "select",

      onChange: (value) => {},
      icon: "map-pin",
    },
    {
      name: t("address"),
      label: "address",
      value: formData.address,
      type: "text",
      onChange: (value) => {},
      icon: "map-pin",
    },

    {
      name: t("phones"),
      label: "phones",
      value: formData.phones,
      type: "multiInput",
      onChange: (value) => {},
      icon: "phone",
    },
  ];

  const RenderInput = ({
    name,
    label,
    value,
    onChange,
    error,
    type,
    setFieldValue,
    icon,
  }: RenderInputProps & {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    switch (type) {
      case "text":
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
              value={value}
              autoCapitalize="none"
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

      case "select":
        const [modalVisible, setModalVisible] = useState(false);
        return (
          // will open a modal to select

          <>
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
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  flex: 1,
                  marginLeft: 10,

                  paddingVertical: 8,
                }}
              >
                <Text>
                  {value.label ||
                    label.charAt(0).toUpperCase() + label.slice(1)}
                </Text>
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
          <>
            <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            <View
              style={{
                borderColor: Colors.primary,
                borderWidth: 2,
                borderRadius: 25,
                padding: 10,
                marginVertical: 5,
                width: wp(80),
              }}
            >
              {value.map((item: string, index: number) => (
                <View
                  key={index}
                  style={{
                    borderColor: Colors.primary,
                    borderWidth: 2,
                    borderRadius: 25,
                    padding: 10,
                    marginVertical: 5,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    className="w-4/5"
                    placeholder={name}
                    onChangeText={(text) => {
                      const newPhones = [...value];
                      newPhones[index] = text;
                      onChange(newPhones);
                    }}
                    value={item}
                    autoCapitalize="none"
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                    }}
                  />
                  <TouchableOpacity
                    className="flex items-center justify-center"
                    onPress={() => {
                      const newPhones = [...value];
                      newPhones.splice(index, 1);
                      onChange(newPhones);
                    }}
                  >
                    <Icon
                      name="minus-square"
                      type={Icons.Feather}
                      color={Colors.primary}
                      size={27}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                className="flex items-center justify-center rounded-3xl "
                style={{
                  backgroundColor: Colors.primary,
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  onChange([...value, ""]);
                }}
              >
                <Text className="text-white">{t("Add")}</Text>
              </TouchableOpacity>

              {error && <Text style={{ color: "red" }}>{error}</Text>}
            </View>
          </>
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
      showToast(res);
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
            errors.provide = t("Required");
          }
          if (!values.district.value) {
            errors.district = t("Required");
          }
          if (!values.ward.value) {
            errors.ward = t("Required");
          }
          if (!values.address) {
            errors.address = t("Required");
          }
          if (values.phones.length === 0) {
            errors.phones = t("Required");
          }
          // check phone is valid
          values.phones.forEach((item: string, index: number) => {
            if (!item) {
              errors.phones = t("Required");
            }
          });
          // check format phone
          values.phones.forEach((item: string, index: number) => {
            if (!/^\d{10}$/.test(item)) {
              errors.phones = t("Phone is invalid");
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
          <View className="flex justify-center items-center">
            {element.map((item, index) => (
              <>
                <RenderInput
                  name={item.name}
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
                  icon={item.icon}
                />
              </>
            ))}

            <View className="flex flex-row justify-between m-4 w-full p-4">
              <TouchableOpacity
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
                onPress={() => {
                  setStep(1);
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
                onPress={() => handleSubmit()}
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
                  type={Icons.Feather}
                  name="arrow-right"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default PickAddress;
