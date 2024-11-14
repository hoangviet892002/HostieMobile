import {
  ActivityIndicator,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { BackButton, Loading } from "@/components";
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
import { chatApi, getMessagesApi } from "@/apis/chat";
import Message from "./Message";
import { generateUUID } from "@/utils/generateUUID";
import useSocketListener from "@/hooks/useListen";
import { useDispatch, useSelector } from "react-redux";
import { messageActions, selectMessage } from "@/redux/slices/messageSlice";
import { Skeleton } from "@rneui/base";

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

  const messages = useSelector(selectMessage);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const dispatch = useDispatch();

  const chatsocketEvent = useSocketListener("common.chat.receive_message");
  useEffect(() => {
    if (chatsocketEvent) {
      console.log("New message received:", chatsocketEvent);
      const message = chatsocketEvent.message;
      const file = chatsocketEvent.files ? chatsocketEvent.files : [];
      const created_at = chatsocketEvent.created_at;
      const newMessage: MessageType = {
        created_at: created_at,
        files: file,
        sender_id: chatsocketEvent.sender_id,
        message: message,
      };
      console.log(newMessage);
      dispatch(messageActions.receiveMessage([newMessage]));
    }
  }, [chatsocketEvent]);
  const RenderInput = () => {
    const [sendLoading, setSendLoading] = useState<boolean>(false);
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleSend = async () => {
      setSendLoading(true);
      if (message.trim() || selectedImage) {
        // Send message and image if available
        console.log("Message sent:", message);
        console.log("Image sent:", selectedImage);

        const formData = new FormData();
        formData.append("message", message);
        formData.append("group_id", id);
        formData.append("receiver_id", partner.id);
        formData.append("uuid", generateUUID());
        if (selectedImage) {
          const uriParts = selectedImage.split(".");
          const fileType = uriParts[uriParts.length - 1];
          formData.append("files", {
            uri: selectedImage,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
        }

        const res = await chatApi(formData);

        // Clear the input fields
        setMessage("");
        setSelectedImage(null);
      }
      setSendLoading(false);
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
        <TouchableOpacity
          onPress={handleSend}
          style={{ marginLeft: 10 }}
          disabled={sendLoading}
        >
          {sendLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons name="send" size={24} color={Colors.primary} />
          )}
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
    console.log(page);
    if (res.success) {
      let messages = res.data.result;
      if (page !== 1) {
        dispatch(messageActions.loadMessages(messages));
      } else {
        dispatch(messageActions.addMessage(messages));
      }
      setTotalPage(res.data.total_pages);
      // sort messages by created_at
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

  const RenderSkeleton = () => {
    return (
      <View className="flex-1">
        <Loading loading={loading} />
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

      {loading ? (
        <RenderSkeleton />
      ) : (
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message {...item} />}
          // keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          style={{ flex: 1 }}
          inverted
        />
      )}

      <RenderInput />
    </SafeAreaView>
  );
};

export default Conversation;
