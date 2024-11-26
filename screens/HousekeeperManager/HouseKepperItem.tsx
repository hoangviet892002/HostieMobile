import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { HouseKepperType } from "@/types/HouseKeppertype";
import { MaterialIcons } from "@expo/vector-icons"; // Ensure you have expo/vector-icons installed

const HouseKepperItem = ({ housekeeper }: { housekeeper: HouseKepperType }) => {
  const {
    firstName,
    lastName,
    email,
    username,
    urlAvatar,
    approvedResidences,
  } = housekeeper;

  // Fallback for missing names
  const displayName = `${firstName || "N/A"} ${lastName || ""}`.trim();

  return (
    <View style={styles.card}>
      {/* Avatar and Basic Details */}
      <View style={styles.header}>
        {urlAvatar ? (
          <Image source={{ uri: urlAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={24} color="#fff" />
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      {/* Approved Residences */}
      <View style={styles.residencesContainer}>
        <Text style={styles.sectionTitle}>Approved Residences:</Text>
        {approvedResidences.length > 0 ? (
          <FlatList
            data={approvedResidences}
            keyExtractor={(item) => item.residenceId.toString()}
            renderItem={({ item }) => (
              <View style={styles.residenceItem}>
                <Text style={styles.residenceName}>{item.name}</Text>
                <Text style={styles.residenceAddress}>
                  {item.address || "No Address"}
                </Text>
              </View>
            )}
            // Optional: Adjust nested FlatList performance
            nestedScrollEnabled
          />
        ) : (
          <Text style={styles.noResidences}>No approved residences found.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6c5ce7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2d3436",
  },
  username: {
    fontSize: 16,
    color: "#636e72",
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: "#b2bec3",
    marginTop: 2,
  },
  residencesContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
  },
  residenceItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dfe6e9",
  },
  residenceName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3436",
  },
  residenceAddress: {
    fontSize: 14,
    color: "#636e72",
    marginTop: 2,
  },
  noResidences: {
    fontSize: 14,
    color: "#b2bec3",
    fontStyle: "italic",
  },
});

export default HouseKepperItem;
