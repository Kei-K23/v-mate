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
    creator: string;
    description: string;
}