import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import { Type } from "@/types";
import { getTypes } from "@/apis/type";
import { ResidencesStep1 } from "@/types/request/ResidencesRequest";
import { postResidence } from "@/apis/residences";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "expo-router";
import { Loading } from "@/components";
import useToast from "@/hooks/useToast";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon, { Icons } from "@/components/Icons";
import { useTranslation } from "react-i18next";

interface InterfaceType {
  name: string;
  num_bath_room: number;
  num_bed_room: number;
  num_of_beds: number;
  max_guests: number;
  type: Type;
}
interface InfomationProps {
  setStep: (step: number) => void;
  data: InterfaceType;
  setData: (data: any) => void;
  setId: (id: string) => void;
  id: string;
}
interface RenderInputProps {
  name?: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  type: "text" | "select" | "number" | "area";
  icon: string;
}

const Infomation: React.FC<InfomationProps> = ({
  setStep,
  data,
  setData,
  setId,
  id,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [initialValues, setInitialValues] = useState<InterfaceType>(data);
  useFocusEffect(
    useCallback(() => {
      setInitialValues(data);
    }, [data])
  );
  const [loading, setLoading] = useState<boolean>(false);
  const element: RenderInputProps[] = [
    {
      name: t("Name"),
      label: "name",
      type: "text",
      onChange: (value) => {
        setInitialValues((prev) => ({
          ...prev,
          name: value,
        }));
      },
      value: data.name,
      icon: "home",
    },
    {
      name: t("Type"),
      label: "type",
      type: "select",
      onChange: (value) => {
        setInitialValues((prev) => ({
          ...prev,
          type: value,
        }));
      },
      value: data.type,
      icon: "home",
    },
    {
      name: t("Number of bath rooms"),
      label: "num_bath_room",
      type: "number",
      onChange: (value) => {
        setInitialValues((prev) => ({
          ...prev,
          num_bath_room: value,
        }));
      },
      value: data.num_bath_room,
      icon: "droplet",
    },
    {
      name: t("Number of bed rooms"),
      label: "num_bed_room",
      type: "number",
      onChange: (value) => {
        setInitialValues((prev) => ({
          ...prev,
          num_bed_room: value,
        }));
      },
      value: data.num_bed_room,
      icon: "moon",
    },
    {
      name: t("Number of beds"),
      label: "num_of_beds",
      type: "number",
      onChange: (value) => {
        setInitialValues((prev) => ({
          ...prev,
          num_of_beds: value,
        }));
      },
      value: data.num_of_beds,
      icon: "layers",
    },
    {
      name: t("Max guests"),
      label: "max_guests",
      type: "number",
      onChange: (value) => {
        setInitialValues((prev) => ({
          ...prev,
          max_guests: value,
        }));
      },
      value: data.max_guests,
      icon: "users",
    },
  ];
  const [optionSelect, setOptionSelect] = useState<Type[]>([]);
  const fetchType = async () => {
    const response = await getTypes();
    console.log(response);
    if (response.data) {
      setOptionSelect(response.data);
    }
  };
  useEffect(() => {
    fetchType();
  }, []);

  const RenderInput = ({
    label,
    value,
    onChange,
    error,
    type,
    name,
    setFieldValue,
    icon,
  }: RenderInputProps & {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    // Di chuyển useState lên đầu component
    const [modalVisible, setModalVisible] = useState(false);

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
              type={Icons.AntDesign}
              name={icon}
              size={20}
              color={Colors.primary}
            />

            <TextInput
              placeholder={name}
              onChangeText={onChange}
              value={String(value)}
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
      case "area":
        return (
          <View className="mx-5">
            <Text className="text-lg font-bold">{name}</Text>
            <TextInput
              placeholder={name}
              onChangeText={onChange}
              value={String(value)}
              autoCapitalize="none"
              multiline
              numberOfLines={4}
              className="bg-white p-2 rounded-lg border-2 py-2 my-2"
              style={{ borderColor: Colors.primary }}
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
              autoCapitalize="none"
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
      case "select":
        return (
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
                onPress={() => setModalVisible(true)}
                style={{
                  flex: 1,
                  marginLeft: 10,

                  paddingVertical: 8,
                }}
              >
                <Text>{value.name}</Text>
              </TouchableOpacity>

              {error && <Text style={{ color: "red" }}>{error}</Text>}
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(!modalVisible)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.6)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 15,
                    width: 320,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 15,
                    }}
                  >
                    Select
                  </Text>

                  {optionSelect.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const value: Type = {
                          description: item.description,
                          id: item.id,
                          name: item.name,
                        };
                        onChange(value);
                        setModalVisible(false);
                      }}
                      style={{
                        padding: 10,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 5,
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
          </>
        );
      default:
        return <Text>Not found</Text>;
    }
  };

  const solveApi = async (dataPost: ResidencesStep1) => {
    if (id !== "") {
      dataPost.id = id;
      setId(id);
    }

    const res = await postResidence(dataPost);

    if (res.success) {
      setId(res.data.id);
      setStep(2);
    } else {
      showToast(res);
    }
  };

  return (
    <View>
      <Loading loading={loading} />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          setLoading(true);
          setData((prevData) => ({
            ...prevData,
            information: values,
          }));

          const dataPost: ResidencesStep1 = {
            name: values.name,
            type: parseInt(values.type.id),
            num_bath_room: values.num_bath_room,
            num_bed_room: values.num_bed_room,
            num_of_beds: values.num_of_beds,
            max_guests: values.max_guests,
            step: 1,
          };

          solveApi(dataPost);
          setLoading(false);
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.name) {
            errors.name = t("Required");
          }
          if (!values.type || values.type.id === "") {
            errors.type = t("Required");
          }
          if (!values.num_bath_room) {
            errors.num_bath_room = t("Required");
          }
          if (!values.num_bed_room) {
            errors.num_bed_room = t("Required");
          }
          if (!values.num_of_beds) {
            errors.num_of_beds = t("Required");
          }
          if (!values.max_guests) {
            errors.max_guests = t("Required");
          }

          return errors;
        }}
      >
        {({
          handleSubmit,
          errors,
          handleBlur,
          handleChange,
          values,
          setFieldValue,
        }) => (
          <View className="flex items-center justify-center ">
            {element.map((item, index) => (
              <RenderInput
                name={item.name}
                key={index}
                label={item.label}
                value={values[item.label as keyof typeof values]}
                onChange={(value) => {
                  setFieldValue(item.label, value);
                }}
                icon={item.icon}
                setFieldValue={setFieldValue}
                error={
                  typeof errors[item.label as keyof typeof errors] === "string"
                    ? (errors[item.label as keyof typeof errors] as string)
                    : undefined
                }
                type={item.type}
              />
            ))}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                margin: 16,
              }}
            >
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

export default Infomation;
