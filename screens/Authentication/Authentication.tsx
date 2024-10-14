import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Animatable from "react-native-animatable";
import { Size } from "@/constants/Size";
import LoginForm from "./LoginForm";
import Register from "./Register";
import LoginWithGoogle from "./LoginWithGoogle";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/slices/authSlice";
const Authentication = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      }
    }, [isAuthenticated])
  );

  const { t } = useTranslation();
  const optionLogin = [
    {
      title: t("Sign in"),
      onPress: () => {
        setOption(optionLogin[0]);
      },
    },
    {
      title: t("Sign up"),
      onPress: () => {
        setOption(optionLogin[1]);
      },
    },
  ];

  const [option, setOption] = useState(optionLogin[0]);
  const renderForm = () => {
    if (option.title === t("Sign in")) {
      return <LoginForm />;
    } else {
      return (
        <ScrollView>
          <Register />
        </ScrollView>
      );
    }
  };
  return (
    <View className="flex justify-center h-full p-10">
      <Animatable.View className="" delay={120} animation="slideInDown">
        <Text style={{ fontSize: Size.font45 }}>Hello</Text>
        <Text style={{ fontSize: Size.font10 }}>
          {t("Wellcome back to Hostie")}
        </Text>
      </Animatable.View>

      <Animatable.View
        className="flex flex-row p-2 my-2 bg-black rounded-3xl justify-between"
        style={{ width: wp(80) }}
        delay={120}
        animation="slideInDown"
      >
        {optionLogin.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`${
              option.title === item.title ? "bg-yellow-50" : "bg-black"
            } p-2 rounded-3xl items-center justify-center`}
            onPress={item.onPress}
            style={{ width: wp(35) }}
          >
            <Text
              className={`${
                option.title !== item.title ? "text-white" : "text-black"
              }
            text-2xl font-bold`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </Animatable.View>
      {renderForm()}
    </View>
  );
};

export default Authentication;
