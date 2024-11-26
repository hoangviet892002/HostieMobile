import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { BackButton } from "@/components";
import { VillaType } from "@/types";
import Villas from "./Villas";
import { Colors } from "@/constants/Colors";
import Icon, { Icons } from "@/components/Icons";
import { housekeeperAddResidenceApi } from "@/apis/housekeeper";
import Toast from "react-native-toast-message";

const Container = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [applyForm, setApplyForm] = useState({
    housekeeperRegistrationCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);

    const res = await housekeeperAddResidenceApi(
      applyForm.housekeeperRegistrationCode
    );
    if (res.code === 1000) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.message,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
    }
    setModalVisible(false);
    setLoading(false);
  };

  // Render Modal
  const renderModal = () => {
    return (
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
              backgroundColor: "#fff",
              width: "80%",
              padding: 40,
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 20, right: 20 }}
              onPress={() => setModalVisible(false)}
            >
              <Icon type={Icons.AntDesign} name="close" size={24} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Apply Manage Residence Code
            </Text>
            <Text style={{ marginTop: 10 }}> Residence Code</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 5,
                padding: 10,
                marginTop: 10,
              }}
              value={applyForm.housekeeperRegistrationCode}
              onChangeText={(text) =>
                setApplyForm({
                  ...applyForm,
                  housekeeperRegistrationCode: text,
                })
              }
            />
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              disabled={loading}
              onPress={handleApply}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                {loading ? "Loading..." : "Apply"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="h-full ">
      {renderModal()}
      {/* Absulute button add */}

      <ScrollView>
        <Villas />
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-white p-2 rounded-lg h-12 w-12 items-center justify-center"
        style={{ backgroundColor: Colors.primary }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Icon type={Icons.Feather} name="plus" size={24} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Container;
