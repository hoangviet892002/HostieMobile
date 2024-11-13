import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import Conversation from "./Conversation";
import { ConversationType } from "@/types/ConversationType";
import { useFocusEffect } from "expo-router";
import { getConversationsApi } from "@/apis/chat";
import useToast from "@/hooks/useToast";
import { Colors } from "@/constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { Loading } from "@/components";

const Conversations = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const { showToast } = useToast();

  const [loadingMore, setLoadingMore] = useState(false);

  const fetchConversations = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const res = await getConversationsApi(pageNumber);

    if (res.success) {
      if (pageNumber === 1) {
        setConversations(res.data.result);
        setTotalPage(res.data.total_pages);
      } else {
        setConversations((prevConversations) => [
          ...prevConversations,
          ...res.data.result,
        ]);
      }

      setTotalPage(res.data.total_pages);
    } else {
      showToast(res);
    }

    if (pageNumber === 1) {
      setLoading(false);
    } else {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations(1);
    }, [page])
  );
  const handleLoadMore = () => {
    if (!loadingMore && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      fetchConversations(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  return (
    <ScrollView className="flex-1">
      <Loading loading={loading} />
      <FlatList
        data={conversations}
        renderItem={({ item }) => <Conversation {...item} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </ScrollView>
  );
};

export default Conversations;
