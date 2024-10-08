import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import { RenderInputProps } from "@/types/props/RenderInputProps";

interface InfomationProps {
  setStep: (step: number) => void;
  data: {
    title: string;
    description: string;
    email: string;
    website: string;
    type: string;
    maxGuest: number;
    bedRoom: number;
    standardGuest: number;
  };
  onChange: (key: string, value: string) => void;
}

const Infomation: React.FC<InfomationProps> = ({ setStep, data, onChange }) => {
  const initialValues = data;
  const element: RenderInputProps[] = [
    {
      label: "title",
      type: "text",
      onChange: (text) => onChange("title", text),
      value: data.title,
    },

    {
      label: "description",
      type: "area",
      onChange: (text) => onChange("description", text),
      value: data.description,
    },
    {
      label: "email",
      type: "text",
      onChange: (text) => onChange("email", text),
      value: data.email,
    },
    {
      label: "website",
      type: "text",
      onChange: (text) => onChange("website", text),
      value: data.website,
    },
    {
      label: "type",
      type: "select",
      onChange: (text) => onChange("type", text),
      value: data.type,
    },
    {
      label: "maxGuest",
      type: "number",
      onChange: (text) => onChange("maxGuest", text),
      value: data.maxGuest.toString(),
    },
    {
      label: "bedRoom",
      type: "number",
      onChange: (text) => onChange("bedRoom", text),
      value: data.bedRoom.toString(),
    },
    {
      label: "standardGuest",
      type: "number",
      onChange: (text) => onChange("standardGuest", text),
      value: data.standardGuest.toString(),
    },
  ];
  const optionSelect = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const RenderInput = ({
    label,
    value,
    onChange,
    error,
    type,
  }: RenderInputProps) => {
    switch (type) {
      case "text":
        return (
          <View className="mx-5">
            <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            <TextInput
              placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
              onChangeText={onChange} // Gọi hàm onChange được truyền vào
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
              onChangeText={onChange} // Gọi hàm onChange được truyền vào
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
              onChangeText={onChange} // Gọi hàm onChange được truyền vào
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
                <Text>{value}</Text>
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
                        onChange(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text>{item}</Text>
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
          onChange("title", values.title);
          onChange("description", values.description);
          onChange("email", values.email);
          onChange("website", values.website);
          onChange("type", values.type);
          onChange("maxGuest", values.maxGuest.toString());
          onChange("bedRoom", values.bedRoom.toString());
          onChange("standardGuest", values.standardGuest.toString());

          setStep(2);
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.title || values.title === "") {
            errors.title = "Required";
          }
          if (!values.description || values.description === "") {
            errors.description = "Required";
          }
          if (!values.email || values.email === "") {
            errors.email = "Required";
          }
          if (!values.website || values.website === "") {
            errors.website = "Required";
          }
          if (!values.type || values.type === "") {
            errors.type = "Required";
          }
          if (!values.maxGuest || values.maxGuest === 0) {
            errors.maxGuest = "Required";
          }
          if (!values.bedRoom || values.bedRoom === 0) {
            errors.bedRoom = "Required";
          }
          if (!values.standardGuest || values.standardGuest === 0) {
            errors.standardGuest = "Required";
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
        }) => (
          <View>
            {element.map((item, index) => (
              <RenderInput
                key={index}
                label={item.label}
                value={values[item.label as keyof typeof values]}
                onChange={(text) => {
                  formikHandleChange(item.label as keyof typeof values)(text); // Cập nhật Formik
                }}
                error={errors[item.label as keyof typeof errors]}
                type={item.type}
              />
            ))}
            <View className="flex flex-row justify-end m-4">
              <TouchableOpacity
                className="flex items-center justify-center"
                onPress={() => {
                  handleSubmit();
                }}
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
