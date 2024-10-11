import { View, Text } from "react-native";
import React from "react";
import { VillaType } from "@/types";
import VillaCard from "./VillaCard";

const Villas = () => {
  const villas: VillaType[] = [
    {
      name: "Villa 1",
      thumbnail: "https://picsum.photos/200/300",
      location: "123 Street, City",
      category: [],
      id: "1",
      maximumGuests: 10,
      standardGuests: 5,
      type: "Villa",
      description: "This is a description",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
    },
    {
      name: "Villa 1",
      thumbnail: "https://picsum.photos/200/300",
      location: "123 Street, City",
      category: [],
      id: "1",
      maximumGuests: 10,
      standardGuests: 5,
      type: "Villa",
      description: "This is a description",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
    },
    {
      name: "Villa 1",
      thumbnail: "https://picsum.photos/200/300",
      location: "123 Street, City",
      category: [],
      id: "1",
      maximumGuests: 10,
      standardGuests: 5,
      type: "Villa",
      description: "This is a description",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
    },
    {
      name: "Villa 1",
      thumbnail: "https://picsum.photos/200/300",
      location: "123 Street, City",
      category: [],
      id: "1",
      maximumGuests: 10,
      standardGuests: 5,
      type: "Villa",
      description: "This is a description",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
    },
    {
      name: "Villa 1",
      thumbnail: "https://picsum.photos/200/300",
      location: "123 Street, City",
      category: [],
      id: "1",
      maximumGuests: 10,
      standardGuests: 5,
      type: "Villa",
      description: "This is a description",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
    },
    {
      name: "Villa 1",
      thumbnail: "https://picsum.photos/200/300",
      location: "123 Street, City",
      category: [],
      id: "1",
      maximumGuests: 10,
      standardGuests: 5,
      type: "Villa",
      description: "This is a description",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
    },
    {
      name: "Villa 1",
      thumbnail: "https://picsum.photos/200/300",
      location: "123 Street, City",
      category: [],
      id: "1",
      maximumGuests: 10,
      standardGuests: 5,
      type: "Villa",
      description: "This is a description",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
    },
    {
      name: "Villa 1",
      thumbnail: "https://picsum.photos/200/300",
      location: "123 Street, City",
      category: [],
      id: "1",
      maximumGuests: 10,
      standardGuests: 5,
      type: "Villa",
      description: "This is a description",
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
      ],
    },
  ];
  return (
    <View>
      {villas.map((villa, index) => (
        <VillaCard villa={villa} key={index} />
      ))}
    </View>
  );
};

export default Villas;
