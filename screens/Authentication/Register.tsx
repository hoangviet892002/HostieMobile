import React from "react";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { CheckBox } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { RegisterRequest } from "@/types";
import { Formik } from "formik";
import { Colors } from "@/constants/Colors";
import Icon, { Icons } from "@/components/Icons";
import { registerApi } from "@/apis/users";
import { statusCode } from "@/constants/StatusCode";
import Toast from "react-native-toast-message";
const Register = () => {
  const { t } = useTranslation();
  const [registerForm, setRegisterForm] = useState<
    RegisterRequest & { checked: boolean }
  >({
    email: "hostvietx@example.comx",
    password: "hostviet111x",
    reference_code: "5LLYP",
    retype_password: "hostviet111x",
    social_urls: [
      { social_name: "Facebook", url: "https://facebook.com/user1" },
    ],
    username: "hostvietsadsax",
    checked: false,
  });
  // const [checked, setChecked] = useState(false);
  const handleChange = (key: string, value: string) => {
    setRegisterForm({ ...registerForm, [key]: value });
  };

  const RenderForm = () => {
    return (
      <Formik
        initialValues={registerForm}
        validate={(values) => {
          const errors: Partial<RegisterRequest & { checked: string }> = {};
          if (!values.email) {
            errors.email = t("Required");
          } else if (!values.username) {
            errors.username = t("Required");
          } else if (!values.password) {
            errors.password = t("Required");
          } else if (!values.retype_password) {
            errors.retype_password = t("Required");
          } else if (values.password !== values.retype_password) {
            errors.retype_password = t("Password does not match");
          } else if (!values.checked) {
            errors.checked = t("Required");
          }
          return errors;
        }}
        onSubmit={async (values) => {
          const data: RegisterRequest = {
            email: values.email,
            password: values.password,
            reference_code: values.reference_code,
            social_urls: values.social_urls,
            username: values.username,
            retype_password: values.retype_password,
          };

          const res = await registerApi(data);

          if (res.result) {
            Toast.show({
              type: "success",
              text1: t("Register success"),
            });
          } else {
            Toast.show({
              type: "error",
              text1: res.message,
            });
          }
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
            <Animatable.View
              delay={120}
              animation="slideInDown"
              className="w-full"
            >
              <View className="py-3">
                <View>
                  <Text className="text-lg font-bold"> {t("Email")} </Text>
                  <TextInput
                    className="bg-white p-2 rounded-lg border-2 py-2 my-2"
                    style={{ width: wp(80), borderColor: Colors.primary }}
                    value={values.email}
                    placeholder={t("Email")}
                    onChangeText={formikHandleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                  {errors.email && (
                    <Text className="text-red-500">{errors.email}</Text>
                  )}
                </View>
                <View>
                  <Text className="text-lg font-bold">{t("User name")}</Text>

                  <TextInput
                    className="bg-white p-2 rounded-lg border-2 border-black py-2 my-2"
                    style={{ width: wp(80), borderColor: Colors.primary }}
                    value={values.username}
                    placeholder={t("User name")}
                    onChangeText={formikHandleChange("username")}
                    onBlur={handleBlur("username")}
                  />
                  {errors.username && (
                    <Text className="text-red-500">{errors.username}</Text>
                  )}
                </View>
                <View>
                  <Text className="text-lg font-bold">{t("Password")}</Text>
                  <TextInput
                    secureTextEntry={true}
                    className="bg-white p-2 rounded-lg border-2 border-black py-2 my-2"
                    style={{ width: wp(80), borderColor: Colors.primary }}
                    value={values.password}
                    placeholder={t("Password")}
                    onChangeText={formikHandleChange("password")}
                    onBlur={handleBlur("password")}
                  />
                  {errors.password && (
                    <Text className="text-red-500">{errors.password}</Text>
                  )}
                </View>
                <View>
                  <Text className="text-lg font-bold">
                    {t("Retype Password")}
                  </Text>
                  <TextInput
                    secureTextEntry={true}
                    className="bg-white p-2 rounded-lg border-2 border-black py-2 my-2"
                    style={{ width: wp(80), borderColor: Colors.primary }}
                    value={values.retype_password}
                    placeholder={t("Confirm Password")}
                    onChangeText={formikHandleChange("retype_password")}
                    onBlur={handleBlur("retype_password")}
                  />
                  {errors.retype_password && (
                    <Text className="text-red-500">
                      {errors.retype_password}
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="text-lg font-bold">
                    {t("Reference Code")}
                  </Text>
                  <TextInput
                    className="bg-white p-2 rounded-lg border-2 border-black py-2 my-2"
                    style={{ width: wp(80), borderColor: Colors.primary }}
                    value={values.reference_code || ""}
                    placeholder={t("Reference Code")}
                    onChangeText={formikHandleChange("reference_code")}
                    onBlur={handleBlur("reference_code")}
                  />
                </View>
                <View>
                  <Text className="text-lg font-bold">{t("Social")}</Text>
                  {values.social_urls.map((item, index) => (
                    <View key={index} className=" flex  justify-between">
                      <View
                        key={index}
                        className="flex flex-row justify-between items-center my-2"
                      >
                        <TextInput
                          className="bg-white p-3 rounded-md border-2 border-black w-5/12"
                          style={{
                            borderColor: Colors.primary,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                          }}
                          value={item.social_name}
                          placeholder={t("Social Name")}
                          onChangeText={(text) => {
                            const newSocialUrls = [...values.social_urls];
                            newSocialUrls[index].social_name = text;
                            setFieldValue("social_urls", newSocialUrls);
                          }}
                          onBlur={handleBlur("social_urls")}
                        />
                        <TextInput
                          className="bg-white p-3 rounded-md border-2 border-black w-5/12"
                          style={{
                            borderColor: Colors.primary,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                          }}
                          value={item.url}
                          placeholder={t("URL")}
                          onChangeText={(text) => {
                            const newSocialUrls = [...values.social_urls];
                            newSocialUrls[index].url = text;
                            setFieldValue("social_urls", newSocialUrls);
                          }}
                          onBlur={handleBlur("social_urls")}
                        />
                        <TouchableOpacity
                          className="flex justify-center items-center w-1/12"
                          onPress={() => {
                            const newSocialUrls = [...values.social_urls];
                            newSocialUrls.splice(index, 1);
                            setFieldValue("social_urls", newSocialUrls);
                          }}
                        >
                          <Icon
                            type={Icons.Feather}
                            name="minus"
                            size={24}
                            color={Colors.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  {/* plus button social */}
                  <TouchableOpacity
                    className="bg-black p-2 rounded-lg items-center justify-center"
                    style={{ width: wp(80), backgroundColor: Colors.primary }}
                    onPress={() => {
                      setFieldValue("social_urls", [
                        ...values.social_urls,
                        { social_name: "", url: "" },
                      ]);
                    }}
                  >
                    <Text>{t("Add more social")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="py-4">
                <CheckBox
                  title={t("I agree to Terms and Privacy Policy")}
                  checked={values.checked}
                  onPress={() => {
                    setFieldValue("checked", !values.checked);
                  }}
                />
                {errors.checked && (
                  <Text className="text-red-500">{errors.checked}</Text>
                )}
              </View>
            </Animatable.View>
            <Animatable.View delay={120} animation="slideInDown">
              <TouchableOpacity
                className="bg-black p-2 rounded-lg items-center justify-center"
                style={{ width: wp(80), backgroundColor: Colors.primary }}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text className="text-white text-2xl font-bold">
                  {t("Register")}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        )}
      </Formik>
    );
  };
  return (
    <View>
      <RenderForm />
    </View>
  );
};

export default Register;
