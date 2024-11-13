import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

const ProgressBar = ({ step }: { step: number }) => {
  const stepBar = [1, 2, 3, 4, 5];
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {stepBar.map((item, index) => (
        <React.Fragment key={item}>
          {/* Step Indicator */}
          <View style={styles.stepContainer}>
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: step >= item ? Colors.primary : "#fff",
                  borderColor: step >= item ? Colors.primary : "gray",
                },
              ]}
            >
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: step >= item ? "#fff" : "gray",
                  },
                ]}
              >
                {item}
              </Text>
            </View>
            <Text style={styles.stepText}>{`${t("Step")} ${item}`}</Text>
          </View>

          {/* Line Between Steps */}
          {index < stepBar.length - 1 && (
            <View
              style={[
                styles.line,
                {
                  backgroundColor: step > item ? Colors.primary : "gray",
                },
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepContainer: {
    alignItems: "center",
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    marginTop: 4,
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  line: {
    width: 40,
    height: 2,
    marginHorizontal: 4,
  },
});

export default ProgressBar;
