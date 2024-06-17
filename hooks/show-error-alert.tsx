import { Alert, Platform, ToastAndroid } from "react-native";

type UseShowErrorAlertProps = {
  message: string;
  title?: string;
};
export default function useShowErrorAlert() {
  return ({ message, title = "Error" }: UseShowErrorAlertProps) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.BOTTOM);
    }
    if (Platform.OS === "ios") {
      Alert.alert(title, message);
    }
  };
}
