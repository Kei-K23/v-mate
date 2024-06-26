import { DocumentPickerAsset } from "expo-document-picker";
import { Models } from "react-native-appwrite";

export type UserSignUp = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}
export type UserSignIn = {
    email: string;
    password: string;
}
export type VideoType = Models.Document & {
    documentId: string;
    title: string;
    tag: string;
    video: string;
    thumbnail: string;
    description: string;
    creator: {
        documentId: string;
        username: string;
        email: string;
        avatar: string;
        accountId: string;
        password: string
    };
}
export type UserType = Models.Document & {
    documentId: string;
    username: string;
    email: string;
    avatar: string;
    accountId: string;
    password: string
}
export type CreateVideoType = {
    title: string;
    tag: string;
    video: DocumentPickerAsset | null;
    thumbnail: DocumentPickerAsset | null;
    description: string;
}