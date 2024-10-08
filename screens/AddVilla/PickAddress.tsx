import { Colors } from "@/constants/Colors";
import { RenderInputProps } from "@/types/props/RenderInputProps";
import { Formik } from "formik";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface PickAddressProps {
  setStep: (step: number) => void;
  formData: {
    provide: string;
    district: string;
    ward: string;
    street: string;
  };
  onChange: (key: string, value: string) => void;
}

const PickAddress: React.FC<PickAddressProps> = ({
  setStep,
  formData,
  onChange,
}) => {
  const element: RenderInputProps[] = [
    {
      label: "provide",
      value: formData.provide,
      type: "text",
      onChange: (text) => onChange("provide", text),
    },
    {
      label: "district",
      value: formData.district,
      type: "text",
      onChange: (text) => onChange("district", text),
    },
    {
      label: "ward",
      value: formData.ward,
      type: "text",
      onChange: (text) => onChange("ward", text),
    },
    {
      label: "street",
      value: formData.street,
      type: "text",
      onChange: (text) => onChange("street", text),
    },
  ];

  const RenderInput = ({ label, value, onChange, error }: RenderInputProps) => {
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
  };

  return (
    <View>
      <Formik
        initialValues={formData}
        enableReinitialize={false}
        onSubmit={(values) => {
          onChange("provide", values.provide);
          onChange("district", values.district);
          onChange("ward", values.ward);
          onChange("street", values.street);
          setStep(3);
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.provide) {
            errors.provide = "Provide is required";
          }
          if (!values.district) {
            errors.district = "District is required";
          }
          if (!values.ward) {
            errors.ward = "Ward is required";
          }
          if (!values.street) {
            errors.street = "Street is required";
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
              <>
                <RenderInput
                  key={index}
                  label={item.label}
                  value={values[item.label as keyof typeof values]}
                  onChange={(text) => {
                    formikHandleChange(item.label as keyof typeof values)(text); // Cập nhật Formik
                  }}
                  error={errors[item.label as keyof typeof errors]}
                  type="text"
                />
              </>
            ))}

            <View className="flex flex-row justify-between m-4">
              <TouchableOpacity
                className="flex items-center justify-center"
                onPress={() => {
                  onChange("provide", values.provide);
                  onChange("district", values.district);
                  onChange("ward", values.ward);
                  onChange("street", values.street);
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
