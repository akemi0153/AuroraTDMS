import { Account, Client, Databases, ID, Query } from "appwrite";

// Appwrite configuration
const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "672cfc4e003a4709c911",
  databaseId: "672cfccb002f456cb332",
  userCollectionId: "672cfcd0003c114264cd",
  accommodationsCollectionId: "6741d7f2000200706b21", // Your Appwrite client collection ID
};

if (!appwriteConfig.endpoint || !appwriteConfig.projectId) {
  throw new Error("Appwrite environment variables are not defined.");
}

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
export const databases = new Databases(client);

// Sign In
export async function signIn(email, password) {
  try {
    // Destroy any existing session
    try {
      await account.deleteSession("current");
    } catch {
      // Ignore if no session exists
    }

    // Create a new session
    const session = await account.createEmailPasswordSession(email, password);

    // Fetch and return user account details
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("Failed to retrieve user account.");
    return currentAccount;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw new Error(error.message || "Error during login. Please try again.");
  }
}

// Get Current User Document
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount || !currentAccount.$id) {
      throw new Error("No active account found.");
    }

    // Fetch user document from the database
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!response.documents || response.documents.length === 0) {
      throw new Error("User document not found.");
    }

    const userDocument = response.documents[0];
    if (!userDocument.role) {
      userDocument.role = "user"; // Default role
    }
    return userDocument;
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    throw new Error("Failed to fetch user data.");
  }
}

// Create New User
export async function createUser(email, password, name, role = "user") {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    const userDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, name, role }
    );
    return userDocument;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw new Error("Failed to create user.");
  }
}

// Sign Out
export async function signOut() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error signing out:", error.message);
    throw new Error("Failed to sign out.");
  }
}

export async function submitTourismForm(formData) {
  try {
    const result = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.accommodationsCollectionId,
      ID.unique(),
      formData
    );
    return result;
  } catch (error) {
    console.error("Failed to submit form data:", error);
    throw new Error("Failed to submit form data");
  }
}

export const createDocument = async (collectionId, data) => {
  try {
    const databaseId = "672cfccb002f456cb332";
    return await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      data
    );
  } catch (error) {
    console.error(
      `Error creating document in collection ${collectionId}:`,
      error
    );
    throw error;
  }
};

export async function fetchAccommodations() {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.accommodationsCollectionId
    );
    return result.documents; // Return the list of accommodations
  } catch (error) {
    console.error("Failed to fetch accommodations:", error);
    throw new Error("Failed to fetch accommodations");
  }
}

export const fetchMunicipalityData = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.accommodationsCollectionId
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching municipality data:", error);
    return [];
  }
};

// Fetch Specific Accommodations
export async function fetchSpecificAccommodations(municipality) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.accommodationsCollectionId,
      [Query.equal("municipality", municipality)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw new Error("Failed to fetch specific accommodations");
  }
}
