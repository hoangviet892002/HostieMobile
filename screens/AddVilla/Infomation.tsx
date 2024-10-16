import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import { Type } from "@/types";
import { getTypes } from "@/apis/type";

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
}
interface RenderInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  type: "text" | "select" | "number" | "area";
}

const Infomation: React.FC<InfomationProps> = ({ setStep, data, setData }) => {
  const initialValues = data;
  const element: RenderInputProps[] = [
    {
      label: "name",
      type: "text",
      onChange: (value) => {},
      value: data.name,
    },
    {
      label: "type",
      type: "select",
      onChange: (value) => {},
      value: data.type,
    },
    {
      label: "num_bath_room",
      type: "number",
      onChange: (value) => {},
      value: data.num_bath_room,
    },
    {
      label: "num_bed_room",
      type: "number",
      onChange: (value) => {},
      value: data.num_bed_room,
    },
    {
      label: "num_of_beds",
      type: "number",
      onChange: (value) => {},
      value: data.num_of_beds,
    },
    {
      label: "max_guests",
      type: "number",
      onChange: (value) => {},
      value: data.max_guests,
    },
  ];
  const [optionSelect, setOptionSelect] = useState<Type[]>([]);
  const fetchType = async () => {
    const response = await getTypes();
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
    setFieldValue,
  }: RenderInputProps & {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    // Di chuyển useState lên đầu component
    const [modalVisible, setModalVisible] = useState(false);

    switch (type) {
      case "text":
        return (
          <View className="mx-5">
            <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            <TextInput
              placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
              onChangeText={onChange}
              value={String(value)}
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
      case "area":
        return (
          <View className="mx-5">
            <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            <TextInput
              placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
              onChangeText={onChange}
              value={String(value)}
              autoCapitalize="none"
              multiline
              numberOfLines={4}
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
              autoCapitalize="none"
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
      case "select":
        return (
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
                <Text>{value.description}</Text>
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
                    >
                      <Text>{item.name}</Text>
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

  return (
    <View>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          setData((prevData) => ({
            ...prevData,
            infomation: values,
          }));
          setStep(2);
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.name) {
            errors.name = "Name is required";
          }
          if (!values.type || values.type.id === "") {
            errors.type = "Type is required";
          }
          if (!values.num_bath_room) {
            errors.num_bath_room = "Number of bath room is required";
          }
          if (!values.num_bed_room) {
            errors.num_bed_room = "Number of bed room is required";
          }
          if (!values.num_of_beds) {
            errors.num_of_beds = "Number of beds is required";
          }
          if (!values.max_guests) {
            errors.max_guests = "Max guests is required";
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
          <View>
            {element.map((item, index) => (
              <RenderInput
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
            <View className="flex flex-row justify-end m-4">
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

export default Infomation;
