import { useCallback } from "react";
import Toast from "react-native-toast-message";

const useToast = () => {
  const showToast = useCallback((response: any) => {
    const isSuccess = response.success === true;
    const toastType = isSuccess ? "success" : "error";

    const defaultText1 = isSuccess ? "Success" : "Error";
    const defaultText2 = isSuccess
      ? response.msg
      : response.msg || "An unexpected error occurred.";

    Toast.show({
      type: toastType,
      text1: response.text1 || defaultText1,
      text2: response.text2 || defaultText2,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  }, []);

  const hideToast = useCallback(() => {
    Toast.hide();
  }, []);

  return { showToast, hideToast };
};

export default useToast;
