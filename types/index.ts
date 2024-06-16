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
    creator: {
        documentId: string;
        username: string;
        email: string;
        avatar: string;
        accountId: string;
        password: string
    };
    description: string;
}
export type UserType = Models.Document & {
    documentId: string;
    username: string;
    email: string;
    avatar: string;
    accountId: string;
    password: string
}