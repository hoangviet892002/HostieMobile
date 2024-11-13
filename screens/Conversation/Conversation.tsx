import {
  ActivityIndicator,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { BackButton } from "@/components";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MessageType } from "@/types/MessageType";
import { FlatList } from "react-native-gesture-handler";
import useToast from "@/hooks/useToast";
import { getMessagesApi } from "@/apis/chat";
import Message from "./Message";

type RouteParams = {
  params: {
    id: string;
    partner: {
      id: number;
      username: string;
      avatar: string;
    };
  };
};

const Conversation = () => {
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id, partner } = route.params;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const RenderInput = () => {
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleSend = () => {
      if (message.trim() || selectedImage) {
        // Send message and image if available
        console.log("Message sent:", message);
        console.log("Image sent:", selectedImage);

        // Clear the input fields
        setMessage("");
        setSelectedImage(null);
      }
    };

    const pickImage = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    };

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderTopWidth: 1,
          borderColor: "#ccc",
        }}
      >
        {/* Image Picker Button */}
        <TouchableOpacity onPress={pickImage} style={{ marginRight: 10 }}>
          <Ionicons name="image-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "#f0f0f0",
            borderRadius: 20,
          }}
        />

        {/* Selected Image Preview */}
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 5,
              marginLeft: 10,
            }}
          />
        )}

        {/* Send Button */}
        <TouchableOpacity onPress={handleSend} style={{ marginLeft: 10 }}>
          <Ionicons name="send" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const fetchMessages = async () => {
    setLoadingMore(page !== 1);
    setLoading(page === 1);

    const res = await getMessagesApi(id, page);
    if (res.success) {
      setMessages((prevMessages) =>
        page === 1 ? res.data.result : [...prevMessages, ...res.data.result]
      );
      setTotalPage(res.data.total_pages);
      // sort messages by created_at
      setMessages((prevMessages) =>
        prevMessages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      );
    } else {
      showToast(res);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animatable.View
        className="flex flex-row items-center "
        delay={120}
        animation="slideInDown"
      >
        <BackButton />
        <View className="flex flex-row items-center ">
          <View className="flex ">
            <Text className="text-3xl font-bold ">{partner.username}</Text>
          </View>
        </View>
      </Animatable.View>

      <FlatList
        data={messages}
        renderItem={({ item }) => <Message {...item} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        style={{ flex: 1 }}
      />

      <RenderInput />
    </SafeAreaView>
  );
};

export default Conversation;
