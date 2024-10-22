import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
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
import { Colors } from "@/constants/Colors";
import Logo from "@/assets/images/logo.png";
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
      <Animatable.View
        className="flex justify-center items-center"
        delay={120}
        animation="slideInDown"
      >
        <Image source={Logo} style={{ width: wp(40), height: hp(20) }} />
      </Animatable.View>

      <Animatable.View
        className="flex flex-row p-2 my-2 rounded-lg justify-between"
        style={{ width: wp(80), backgroundColor: Colors.primary }}
        delay={120}
        animation="slideInDown"
      >
        {optionLogin.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={` p-2 rounded-lg items-center justify-center`}
            onPress={item.onPress}
            style={{
              width: wp(35),
              backgroundColor:
                option.title !== item.title ? Colors.primary : Colors.white,
            }}
          >
            <Text
              className={`${
                option.title !== item.title ? "text-white" : "text-black"
              }
            text-2xl font-bold`}
              style={{
                color:
                  option.title !== item.title ? Colors.white : Colors.black,
              }}
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
