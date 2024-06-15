import { Account, Client, ID } from 'react-native-appwrite';

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

export const createUser = () => {
    account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
        .then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });
}

