import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
const { width } = Dimensions.get("window");

export interface ImageCustomProps {
  images: string[];
}

const ImageCustom: React.FC<ImageCustomProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <Animatable.View
      style={{ backgroundColor: "#fff", marginVertical: 5 }}
      delay={120}
      animation="slideInDown"
    >
      <View
        className="h-[300px]"
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FlatList
          data={images}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            setCurrentIndex(parseInt((x / width).toFixed(0)));
          }}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: width,

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "90%",
                    height: "90%",
                    borderRadius: 16,
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 16,
                    }}
                    source={{ uri: `${item}` }}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: width,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {images.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                width: currentIndex == index ? 10 : 8,
                height: currentIndex == index ? 10 : 8,
                borderRadius: currentIndex == index ? 5 : 4,
                backgroundColor:
                  currentIndex == index ? Colors.primary : "gray",
                marginLeft: 5,
              }}
            ></View>
          );
        })}
      </View>
    </Animatable.View>
  );
};

export default ImageCustom;
