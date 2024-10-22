import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ResidencesStep5 } from "@/types/request/ResidencesRequest";
import { postResidence } from "@/apis/residences";
import Toast from "react-native-toast-message";

interface AddImagesProps {
  setStep: (step: number) => void;
  setId: (id: string) => void;
  id: string;
}

const AddImages: React.FC<AddImagesProps> = ({ setStep, id, setId }) => {
  const [images, setImages] = useState<string[]>([]); // Lưu trữ đường dẫn ảnh

  // Yêu cầu quyền truy cập thư viện ảnh
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập bị từ chối",
        "Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh."
      );
      return false;
    }
    return true;
  };

  // Hàm chọn ảnh
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false, // expo-image-picker hiện tại không hỗ trợ chọn nhiều ảnh cùng lúc
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  // Hàm xóa ảnh
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    setImages(updatedImages);
  };
  const solveApi = async (dataPost: ResidencesStep5) => {
    if (id !== "") {
      dataPost.id = id;
      setId(id);
    }
    const res = await postResidence(dataPost);

    if (res.success) {
      setId(res.data.id);
      Alert.alert("Thành công", "Thêm ảnh thành công.");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.msg,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Nhiều Ảnh</Text>

      <TouchableOpacity style={styles.addButton} onPress={pickImage}>
        <Text style={styles.addButtonText}>Chọn Ảnh</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <ScrollView horizontal style={styles.imagesContainer}>
          {images.map((imageUri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.navButton} onPress={() => setStep(4)}>
          <Text style={styles.navButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={async () => {
            if (images.length === 0) {
              Alert.alert("Không có ảnh", "Vui lòng chọn ít nhất một ảnh.");
              return;
            }
            const postData: ResidencesStep5 = {
              files: await Promise.all(
                images.map(async (image) => {
                  const response = await fetch(image);
                  const blob = await response.blob();
                  return new File(
                    [blob],
                    image.split("/").pop() || "image.jpg",
                    { type: "image/jpeg" }
                  );
                })
              ),
              id: id,
              step: 5,
            };

            solveApi(postData);
          }}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  navButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
