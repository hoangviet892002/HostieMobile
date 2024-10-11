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

const Container = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [applyForm, setApplyForm] = useState({
    code: "",
  });

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
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Apply Promo Code
            </Text>
            <Text style={{ marginTop: 10 }}>Enter your promo code</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 5,
                padding: 10,
                marginTop: 10,
              }}
              value={applyForm.code}
              onChangeText={(text) =>
                setApplyForm({ ...applyForm, code: text })
              }
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#f0f0f0",
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
                borderBlockColor: "#ddd",
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ textAlign: "center" }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="h-full p-5 pb-24">
      <Animatable.View
        className="flex items-center justify-between flex-row m-1"
        delay={120}
        animation="slideInDown"
      >
        <Text className="text-3xl font-bold ">Villas</Text>
        {/* Add 1 villa manage */}
        <TouchableOpacity
          className="bg-gray-200 p-4 rounded-md mt-4 border border-gray-400"
          style={{
            backgroundColor: "#f0f0f0",
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            borderBlockColor: "#ddd",
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ textAlign: "center" }}>Add Villa</Text>
        </TouchableOpacity>
      </Animatable.View>
      {renderModal()}
      <ScrollView>
        <Villas />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Container;
