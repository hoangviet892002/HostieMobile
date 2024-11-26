import React, { useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { Dimensions } from "react-native";
import { PolicyType } from "@/types/PolicyType";
import { useTranslation } from "react-i18next";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const ModalPolicy = ({
  visiblePolicy,
  setVisiblePolicy,
  policyData,
}: {
  visiblePolicy: boolean;
  setVisiblePolicy: (visible: boolean) => void;
  policyData: PolicyType | null;
}) => {
  const { t } = useTranslation();
  const viewShotRef = useRef<ViewShot>(null);

  const captureScrollView = async () => {
    const uri = await captureRef(viewShotRef, {
      format: "jpg",
      quality: 0.8,
    });
    console.log(uri);
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);
    Alert.alert("Success", "Image saved to gallery");
  };

  return (
    <Modal visible={visiblePolicy} transparent>
      <ScrollView
        className="flex-1 bg-opacity-50"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="bg-white p-5 rounded-2xl shadow-lg w-full ">
          <Text className="text-2xl font-semibold mb-5 text-center">
            {t("Policy")}
          </Text>

          {policyData ? (
            <>
              <ViewShot
                ref={viewShotRef}
                options={{ format: "png", quality: 1 }}
              >
                <View className="bg-white">
                  <RenderHtml source={{ html: policyData.policy }} />
                </View>
              </ViewShot>

              {policyData.files && policyData.files.length > 0 && (
                <View className="mt-5">
                  <Text className="text-lg font-semibold mb-3">
                    {t("Attachments")}
                  </Text>
                  <FlatList
                    data={policyData.files}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="flex flex-row items-center justify-between py-2 border-b border-gray-200"
                        onPress={() => Linking.openURL(item.file_url)}
                      >
                        <Text className="text-base text-blue-600">
                          {item.original_name || item.file_name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {`${(item.file_size / 1024).toFixed(2)} KB`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </>
          ) : (
            <Text className="text-gray-500 text-center">
              {t("No policy data")}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => captureScrollView()}
            className="mt-5 bg-blue-500 rounded-3xl p-4 items-center"
          >
            <Text className="text-white font-semibold"> {t("Download")} </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setVisiblePolicy(false)}
            className="mt-5 bg-red-500 rounded-3xl p-4 items-center"
          >
            <Text className="text-white font-semibold"> {t("Close")} </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default ModalPolicy;
