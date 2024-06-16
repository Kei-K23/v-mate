import { UserSignIn, UserSignUp, UserType, VideoType } from '@/types';
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.kei.vmate",
    projectId: "666d040d003a724c06a7",
    databaseId: "666d0545000423662767",
    userCollectionId: "666d05670019a010abcf",
    videoCollectionId: "666d05970032709e0e44",
    storageId: "666d07f8003a81b97319"
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = appwriteConfig

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async ({ email, password, confirmPassword, username }: UserSignUp) => {
    // If password does not match then return
    if (password !== confirmPassword) throw new Error("Password doesn't not match");

    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error("Account not created");

        // Create default avatar
        const newAvatar = avatars.getInitials(username);

        // Create user document in the users collection
        const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), {
            email,
            username,
            avatar: newAvatar,
            password,
            accountId: newAccount.$id
        });

        return newUser;
    } catch (e) {
        throw new Error("Something went wrong when sign up");
    }
}

export const signInUser = async ({ email, password }: UserSignIn) => {
    try {
        const userSignIn = await account.createEmailPasswordSession(email, password);
        return userSignIn
    } catch (e) {
        console.log(e);
        throw new Error("Something went wrong when sing in");
    }
}

export const getSignInUser = async () => {
    try {
        return await account.get()
    } catch (e) {
        console.log(e);
        throw new Error("Something went wrong when getting sign in user");
    }
}

export const getLatestVideos = async () => {
    try {
        const data = await databases.listDocuments<VideoType>(databaseId, videoCollectionId, [
            Query.orderDesc("$createdAt"), Query.limit(7)
        ]);
        return data.documents;
    } catch (e) {
        console.log(e);
        throw new Error("Something went wrong when getting latest videos");
    }
}

export const getAllVideos = async () => {
    try {
        const data = await databases.listDocuments<VideoType>(databaseId, videoCollectionId, [
            Query.orderDesc("$createdAt")
        ]);
        return data.documents;
    } catch (e) {
        console.log(e);
        throw new Error("Something went wrong when getting videos");
    }
}

export const getUser = async (id: string) => {
    try {
        const data = await databases.listDocuments<UserType>(databaseId, userCollectionId, [
            Query.equal("accountId", id)
        ]);
        return data.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error("Something went wrong when getting user");
    }
}

export const searchVideosByTitle = async (query: string) => {
    try {
        const data = await databases.listDocuments<VideoType>(databaseId, videoCollectionId, [
            Query.search("title", query),
            Query.orderDesc("$createdAt"),
        ]);
        return data.documents;
    } catch (e) {
        console.log(e);
        throw new Error(`Something went wrong when getting videos by ${query}`);
    }
}