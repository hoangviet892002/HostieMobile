import { View, Text, Image, ScrollView } from "react-native";
import React from "react";

type status = "pending" | "completed" | "canceled";

interface Todo {
  id: number;
  villaName: string;
  status: status;
  date: string;
  thumbnail: string;
  address: string;
  price: number;
  img: string[];
  deposit: number;
}
interface Seller {
  name: string;
  avatar: string;
  type: string;
}
const Information = () => {
  const mockData: Todo = {
    id: 1,
    villaName: "Villa 1",
    status: "pending",
    date: "2022-08-02",
    thumbnail: "https://i.imgur.com/5nXv0YB.png",
    address: "123 Nguyen Van Linh",
    price: 1000000,
    img: [
      "https://i.imgur.com/5nXv0YB.png",
      "https://i.imgur.com/5nXv0YB.png",
      "https://i.imgur.com/5nXv0YB.png",
      "https://i.imgur.com/5nXv0YB.png",
      "https://i.imgur.com/5nXv0YB.png",
      "https://i.imgur.com/5nXv0YB.png",
      "https://i.imgur.com/5nXv0YB.png",
    ],
    deposit: 100000,
  };
  const seller: Seller = {
    name: "Seller 1",
    avatar: "https://i.imgur.com/5nXv0YB.png",
    type: "seller",
  };

  return (
    <View>
      {/*  seller */}
      <ScrollView>
        <View className="flex justify-center items-center">
          {/* Update status button */}
          <View className="my-4">
            <Text className="text-lg font-bold">Update Status:</Text>
            <View className="flex flex-row justify-around mt-2">
              <Text
                className={`text-lg p-2 rounded-lg ${
                  mockData.status === "pending"
                    ? "bg-yellow-300"
                    : "bg-gray-300"
                }`}
                onPress={() => console.log("Status updated to pending")}
              >
                Pending
              </Text>
              <Text
                className={`text-lg p-2 rounded-lg ${
                  mockData.status === "completed"
                    ? "bg-green-300"
                    : "bg-gray-300"
                }`}
                onPress={() => console.log("Status updated to completed")}
              >
                Completed
              </Text>
              <Text
                className={`text-lg p-2 rounded-lg ${
                  mockData.status === "canceled" ? "bg-red-300" : "bg-gray-300"
                }`}
                onPress={() => console.log("Status updated to canceled")}
              >
                Canceled
              </Text>
            </View>
          </View>
          <Image
            source={{ uri: seller.avatar }}
            className="rounded-3xl w-36 h-36"
          />
          <Text className="text-2xl font-bold">{seller.name}</Text>
          <Text className="text-lg">{seller.type}</Text>
        </View>
        <View className="mt-4">
          {/* Thông tin chi tiết giao dịch */}
          <View className="mt-2">
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold w-1/2">ID transaction: </Text>
              <Text className="text-lg w-1/2">{mockData.id}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold w-1/2">Villa name: </Text>
              <Text className="text-lg w-1/2">{mockData.villaName}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold w-1/2">Status: </Text>

              <Text
                className={`text-lg w-1/2  ${
                  mockData.status === "pending"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {mockData.status}
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold w-1/2">Date: </Text>
              <Text className="text-lg w-1/2">{mockData.date}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold w-1/2">Address: </Text>
              <Text className="text-lg w-1/2">{mockData.address}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold w-1/2">Price: </Text>
              <Text className="text-lg w-1/2">{mockData.price}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold w-1/2">Deposit: </Text>
              <Text className="text-lg w-1/2">{mockData.deposit}</Text>
            </View>
          </View>

          {/* Hiển thị ảnh */}
          <View className="mt-4">
            <Text className="text-lg">Ảnh:</Text>
            <View className="flex flex-row flex-wrap justify-center">
              {mockData.img.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  className="w-32 h-32 mr-2 mb-2"
                  resizeMode="cover"
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Information;
