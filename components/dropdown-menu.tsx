import { icons } from "@/constants";
import { colors } from "@/constants/colors";
import useShowErrorAlert from "@/hooks/show-error-alert";
import { deleteTheVideo } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type DropdownMenuProps = {
  isOwner: boolean;
  id: string;
  onRefresh: (fn: () => Promise<void>) => Promise<void>;
  videosRefreshFn: () => Promise<void>;
};

export default function DropdownMenu({
  isOwner,
  id,
  onRefresh,
  videosRefreshFn,
}: DropdownMenuProps) {
  const [show, setShow] = useState<boolean>(false);
  const showAlert = useShowErrorAlert();

  const handleOnPress = async (type: "delete" | "save" | "edit") => {
    try {
      switch (type) {
        case "delete":
          await deleteTheVideo(id);
          setShow(false);
          onRefresh(videosRefreshFn);
          break;
        case "save":
          onRefresh(videosRefreshFn);
          setShow(false);
          break;
        case "edit":
          setShow(false);
          break;
        default:
          setShow(false);
          break;
      }
    } catch (e: any) {
      console.log(e);
      showAlert({
        message: "Something went wrong",
      });
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        right: 5,
        top: 0,
      }}
    >
      {show ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 10,
            borderWidth: 1,
            borderColor: colors.gray[200],
            borderRadius: 10,
            backgroundColor: colors.primary,
            shadowColor: colors.gray[100],
            shadowOffset: {
              width: 100,
              height: 10,
            },
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              paddingHorizontal: 20,
              paddingVertical: 8,
              gap: 5,
              borderColor: colors.gray[200],
            }}
            onPress={() => handleOnPress("save")}
          >
            <Ionicons name="bookmark" color={colors.gray[200]} size={16} />
            <Text
              style={{
                color: colors.gray[200],
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
          {isOwner && (
            <>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderColor: colors.gray[200],
                  gap: 5,
                }}
                onPress={() => handleOnPress("edit")}
              >
                <Ionicons
                  name="pencil-outline"
                  color={colors.gray[200]}
                  size={16}
                />
                <Text
                  style={{
                    color: colors.gray[200],
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderColor: colors.gray[200],
                  gap: 5,
                }}
                onPress={() => handleOnPress("delete")}
              >
                <Ionicons name="trash-bin" color={colors.gray[200]} size={16} />
                <Text
                  style={{
                    color: colors.gray[200],
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShow(true)}>
          <Image
            source={icons.menu}
            resizeMode="contain"
            style={{
              width: 17,
              height: 17,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
