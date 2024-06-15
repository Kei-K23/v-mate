import { UserSignIn, UserSignUp } from '@/types';
import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.kei.vmate",
    projectId: "666d040d003a724c06a7",
    databaseId: "666d0545000423662767",
    userCollectionId: "666d05670019a010abcf",
    videoCollectionId: "666d05970032709e0e44",
    storageId: "666d07f8003a81b97319"
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
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

        // Create user sign in
        await signInUser({ email, password });

        return newUser;
    } catch (e) {
        console.log(e);
        throw new Error("Something went wrong when sign up");
    }
}

export const signInUser = async ({ email, password }: UserSignIn) => {
    try {
        return await account.createEmailPasswordSession(email, password);
    } catch (e) {
        console.log(e);
        throw new Error("Something went wrong when sing in");
    }
}