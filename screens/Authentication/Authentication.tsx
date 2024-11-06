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
import { selectIsAuthenticated, selectRole } from "@/redux/slices/authSlice";
import { Colors } from "@/constants/Colors";
import Logo from "@/assets/images/logo.png";
import { Roles } from "@/constants/enums/roles";
const Authentication = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);

  useFocusEffect(
    useCallback(() => {
      isAuthenticated &&
        router.replace(
          role === Roles.ROLE_HOUSEKEEPER ? "/housekeeper" : "/(tabs)"
        );
    }, [isAuthenticated, role])
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
      return (
        <>
          <Text
            style={{ color: Colors.primary }}
            className="font-semibold text-3xl"
          >
            {t("Sign in")}
          </Text>
          <LoginForm />

          {/* register */}
          <TouchableOpacity
            onPress={() => setOption(optionLogin[1])}
            className="flex justify-center items-center"
          >
            <Text
              style={{ color: Colors.primary }}
              className="font-semibold text-lg mt-5"
            >
              {t("Don't have an account? Sign up")}
            </Text>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <ScrollView>
          <Text
            style={{ color: Colors.primary }}
            className="font-semibold text-3xl"
          >
            {t("Sign up")}
          </Text>

          <Register />

          {/* login */}
          <TouchableOpacity
            onPress={() => setOption(optionLogin[0])}
            className="flex justify-center items-center"
          >
            <Text
              style={{ color: Colors.primary }}
              className="font-semibold text-lg mt-5"
            >
              {t("Already have an account? Sign in")}
            </Text>
          </TouchableOpacity>
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

      {renderForm()}
    </View>
  );
};

export default Authentication;
