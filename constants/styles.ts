import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const defaultStyles = StyleSheet.create({
    layout: {
        flex: 1,
        width: "100%",
        height: "100%",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: colors.primary,
    }
})