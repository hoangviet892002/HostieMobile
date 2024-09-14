import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Animatable from "react-native-animatable";

const LoginScreen = () => {
  const optionLogin = [
    {
      title: "Email",
      onPress: () => {
        setOption(optionLogin[0]);
      },
    },
    {
      title: "Phone",
      onPress: () => {
        setOption(optionLogin[1]);
      },
    },
  ];
  const [option, setOption] = useState(optionLogin[0]);
  const renderForm = () => {
    return (
      <Animatable.View delay={120} animation="slideInDown">
        <Text>{option.title}</Text>
      </Animatable.View>
    );
  };
  return (
    <View className="flex items-center justify-center h-full">
      <Animatable.View className="" delay={120} animation="slideInDown">
        <Text>Hello</Text>
        <Text>Wellcome back to Hostie</Text>
      </Animatable.View>

      <Animatable.View
        className="flex flex-row m-4 p-2 bg-black rounded-3xl justify-between"
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
      <Animatable.View delay={120} animation="slideInDown">
        <TouchableOpacity
          className="bg-black p-2 rounded-3xl items-center justify-center"
          style={{ width: wp(80) }}
          onPress={() => {
            router.navigate("HomeScreen");
          }}
        >
          <Text className="text-white text-2xl font-bold">Login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default LoginScreen;
