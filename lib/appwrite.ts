import { CreateVideoType, UserSignIn, UserSignUp, UserType, VideoType } from '@/types';
import { DocumentPickerAsset } from 'expo-document-picker';
import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';

const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_ENDPOINT!,
    platform: process.env.EXPO_PUBLIC_PLATFORM!,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_DATABASE_ID!,
    userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID!,
    videoCollectionId: process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID!,
    storageId: process.env.EXPO_PUBLIC_STORAGE_ID!
}

const {
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
const storages = new Storage(client);

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

export const searchVideosByAccountId = async (accountId: string) => {
    try {
        const data = await databases.listDocuments<VideoType>(databaseId, videoCollectionId, [
            Query.equal("creator", accountId),
            Query.orderDesc("$createdAt"),
        ]);

        return data.documents;
    } catch (e) {
        console.log(e);
        throw new Error(`Something went wrong when getting videos by user id ${accountId}`);
    }
}

const uploadFile = async (file: DocumentPickerAsset | null, type: string) => {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedData = await storages.createFile(storageId, ID.unique(), {
            name: asset.name,
            size: asset.size!,
            type: asset.type!,
            uri: asset.uri
        });

        const previewFileUrl = await getPreviewFile(uploadedData.$id, type);
        return previewFileUrl;
    } catch (e: any) {
        console.log(e);
        throw new Error("Error when uploading video");
    }
}

const getPreviewFile = (id: string, type: string) => {
    let fileUrl: string;

    try {
        if (type === "video") {
            fileUrl = storages.getFileView(storageId, id) as any as string;
        } else if (type === "image") {
            fileUrl = storages.getFilePreview(
                storageId,
                id,
                2000,
                2000,
                ImageGravity.Top,
                100
            ) as any as string;
        } else {
            throw new Error("Invalid type");
        }

        if (!fileUrl) throw new Error("No file preview");
        return fileUrl;
    } catch (e: any) {
        throw new Error("Something went wrong when getting file preview");
    }
}

export const createNewVideo = async ({ title, tag, thumbnail, video, userId, description }: CreateVideoType & {
    userId: string;
}) => {
    try {
        const [videoUrl, thumbnailUrl] = await Promise.all([
            uploadFile(video, "video"),
            uploadFile(thumbnail, "image"),
        ])

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                tag,
                creator: userId,
                description
            }
        );

        return newPost;
    } catch (e) {
        console.log(e);
        throw new Error("Error when creating video");
    }
}

export const deleteTheVideo = async (id: string) => {
    try {

        await databases.deleteDocument(
            databaseId,
            videoCollectionId,
            id
        );

    } catch (e) {
        console.log(e);
        throw new Error("Error when deleting video");
    }
}