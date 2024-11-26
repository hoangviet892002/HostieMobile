import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { ReportType } from "@/constants/enums/ReportType";
import { parseReportType } from "@/utils/parseReport";
import { ReportRequest } from "@/types/request/ReportRequest";
import { postReportApi } from "@/apis/report";
import Toast from "react-native-toast-message";

const ReportSchema = Yup.object().shape({
  reason: Yup.string()
    .required("Reason is required")
    .min(5, "Reason must be at least 5 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  reportType: Yup.string().required("Report Type is required"),
  severity: Yup.string().required("Severity is required"),
});

const ReportModal = ({ visibleReport, setVisibleReport, reportData }) => {
  const { t } = useTranslation();
  const viewShotRef = useRef(null);

  const handleSubmit = async (values, { resetForm }) => {
    const Data: ReportRequest = {
      bookingId: reportData.id,
      description: values.description,
      reportType: values.reportType,
      severity: values.severity,
      residenceId: reportData.residence_id,
      title: values.reason,
    };

    const res = await postReportApi(Data);
    if (res.code === 1000) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.message,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
    }
    resetForm();
    setVisibleReport(false);
  };

  return (
    <Modal visible={visibleReport} transparent animationType="slide">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          ref={viewShotRef}
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 20,
            width: "90%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {t("Report")}
          </Text>

          <Formik
            initialValues={{
              reason: "",
              description: "",
              reportType: "",
              severity: "",
            }}
            validationSchema={ReportSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <>
                {/* Reason Field */}
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ marginBottom: 5, fontWeight: "500" }}>
                    {t("Reason")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor:
                        errors.reason && touched.reason ? Colors.red : "#ccc",
                      borderRadius: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Icon
                      name="flag"
                      size={20}
                      color={Colors.red}
                      style={{ marginRight: 10 }}
                    />
                    <TextInput
                      style={{ flex: 1, height: 40 }}
                      placeholder={t("Enter reason")}
                      onChangeText={handleChange("reason")}
                      onBlur={handleBlur("reason")}
                      value={values.reason}
                    />
                  </View>
                  {errors.reason && touched.reason && (
                    <Text style={{ color: Colors.red, marginTop: 5 }}>
                      {errors.reason}
                    </Text>
                  )}
                </View>

                {/* Description Field */}
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ marginBottom: 5, fontWeight: "500" }}>
                    {t("Description")}
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor:
                        errors.description && touched.description
                          ? Colors.red
                          : "#ccc",
                      borderRadius: 10,
                      padding: 10,
                    }}
                  >
                    <TextInput
                      style={{ height: 100, textAlignVertical: "top" }}
                      placeholder={t("Describe the issue")}
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      value={values.description}
                      multiline
                    />
                  </View>
                  {errors.description && touched.description && (
                    <Text style={{ color: Colors.red, marginTop: 5 }}>
                      {errors.description}
                    </Text>
                  )}
                </View>

                {/* select dropdown report Type */}

                <View style={{ marginBottom: 15 }}>
                  <Text style={{ marginBottom: 5, fontWeight: "500" }}>
                    {t("Report Type")}
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor:
                        errors.reportType && touched.reportType
                          ? Colors.red
                          : "#ccc",
                      borderRadius: 10,
                      padding: 10,
                    }}
                  >
                    <Picker
                      selectedValue={values.reportType}
                      onValueChange={(itemValue) =>
                        setFieldValue("reportType", itemValue)
                      }
                    >
                      <Picker.Item label="Select Report Type" value="" />
                      <Picker.Item
                        label={parseReportType(ReportType.HOST_ISSUE)}
                        value={ReportType.HOST_ISSUE}
                      />
                      <Picker.Item
                        label={parseReportType(ReportType.PAYMENT_ISSUE)}
                        value={ReportType.PAYMENT_ISSUE}
                      />
                      <Picker.Item
                        label={parseReportType(ReportType.RESIDENCE_ISSUE)}
                        value={ReportType.RESIDENCE_ISSUE}
                      />
                      <Picker.Item
                        label={parseReportType(ReportType.OTHER)}
                        value={ReportType.OTHER}
                      />
                    </Picker>
                  </View>
                  {errors.reportType && touched.reportType && (
                    <Text style={{ color: Colors.red, marginTop: 5 }}>
                      {errors.reportType}
                    </Text>
                  )}
                </View>
                {/* select dropdown report severity */}
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ marginBottom: 5, fontWeight: "500" }}>
                    {t("Severity")}
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor:
                        errors.severity && touched.severity
                          ? Colors.red
                          : "#ccc",
                      borderRadius: 10,
                      padding: 10,
                    }}
                  >
                    <Picker
                      selectedValue={values.severity}
                      onValueChange={(itemValue) =>
                        setFieldValue("severity", itemValue)
                      }
                    >
                      <Picker.Item label="Select Severity" value="" />
                      <Picker.Item label="Low" value="LOW" />
                      <Picker.Item label="Medium" value="MEDIUM" />
                      <Picker.Item label="High" value="HIGH" />
                      <Picker.Item label="Urgent" value="URGENT" />
                    </Picker>
                  </View>
                  {errors.severity && touched.severity && (
                    <Text style={{ color: Colors.red, marginTop: 5 }}>
                      {errors.severity}
                    </Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: Colors.blue,
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    {t("Submit Report")}
                  </Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setVisibleReport(false)}
                  style={{
                    backgroundColor: Colors.red,
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    {t("Close")}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default ReportModal;
