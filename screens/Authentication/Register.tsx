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
                    name="mail"
                    size={20}
                    color={Colors.primary}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                    value={values.email}
                    placeholder={t("Email")}
                    onChangeText={formikHandleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                  {errors.email && (
                    <Text className="text-red-500">{errors.email}</Text>
                  )}
                </View>
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
                    name="user"
                    size={20}
                    color={Colors.primary}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                    value={values.username}
                    placeholder={t("Username")}
                    onChangeText={formikHandleChange("username")}
                    onBlur={handleBlur("username")}
                  />
                  {errors.username && (
                    <Text className="text-red-500">{errors.username}</Text>
                  )}
                </View>
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
                    name="lock"
                    size={20}
                    color={Colors.primary}
                  />
                  <TextInput
                    secureTextEntry={true}
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                    value={values.password}
                    placeholder={t("Password")}
                    onChangeText={formikHandleChange("password")}
                    onBlur={handleBlur("password")}
                  />
                  {errors.password && (
                    <Text className="text-red-500">{errors.password}</Text>
                  )}
                </View>

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
                    name="lock"
                    size={20}
                    color={Colors.primary}
                  />
                  <TextInput
                    secureTextEntry={true}
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                    value={values.retype_password}
                    placeholder={t("Retype Password")}
                    onChangeText={formikHandleChange("retype_password")}
                    onBlur={handleBlur("retype_password")}
                  />
                  {errors.retype_password && (
                    <Text className="text-red-500">
                      {errors.retype_password}
                    </Text>
                  )}
                </View>

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
                    name="hash"
                    size={20}
                    color={Colors.primary}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: Colors.black,
                      paddingVertical: 8,
                    }}
                    value={values.reference_code}
                    placeholder={t("Reference Code")}
                    onChangeText={formikHandleChange("reference_code")}
                    onBlur={handleBlur("reference_code")}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {t("Social")}
                  </Text>
                  {values.social_urls.map((item, index) => (
                    <View
                      key={index}
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
                        name="hash"
                        size={20}
                        color={Colors.primary}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          color: Colors.black,
                          paddingVertical: 8,
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
                      <Icon
                        type={Icons.Feather}
                        name="link"
                        size={20}
                        color={Colors.primary}
                        style={{ marginLeft: 10 }}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          color: Colors.black,
                          paddingVertical: 8,
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
                          style={{ marginLeft: 10 }}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Plus button to add more social URLs */}
                  <View className="flex items-center justify-center">
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.primary,
                        padding: 10,
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        width: wp(80),
                        marginVertical: 10,
                      }}
                      onPress={() => {
                        setFieldValue("social_urls", [
                          ...values.social_urls,
                          { social_name: "", url: "" },
                        ]);
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        {t("Add more social")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ paddingVertical: 16 }}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => {
                    setFieldValue("checked", !values.checked);
                  }}
                >
                  <View
                    style={{
                      height: 24,
                      width: 24,
                      borderWidth: 2,
                      borderColor: Colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                    }}
                  >
                    {values.checked && (
                      <Icon
                        name="check"
                        size={16}
                        color={Colors.primary}
                        type={Icons.Feather}
                      />
                    )}
                  </View>
                  <Text style={{ marginLeft: 8, flex: 1 }}>
                    {t("I agree to the")}{" "}
                    <Text
                      style={{ color: Colors.primary }}
                      onPress={() => {
                        // Navigate to Terms and Conditions page
                      }}
                    >
                      {t("Terms")}
                    </Text>{" "}
                    {t("and")}{" "}
                    <Text
                      style={{ color: Colors.primary }}
                      onPress={() => {
                        // Navigate to Privacy Policy page
                      }}
                    >
                      {t("Privacy Policy")}
                    </Text>
                  </Text>
                </TouchableOpacity>
                {errors.checked && (
                  <Text style={{ color: "red", marginTop: 8 }}>
                    {errors.checked}
                  </Text>
                )}
              </View>
            </Animatable.View>
            <Animatable.View delay={120} animation="slideInDown">
              <TouchableOpacity
                className="flex justify-center items-center py-3 rounded-3xl"
                style={{ width: wp(80), backgroundColor: Colors.primary }}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text className="text-white text-2xl font-bold">
                  {" "}
                  {t("Register")}{" "}
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
