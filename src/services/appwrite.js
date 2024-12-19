import { Account, Client, Databases, ID, Query } from "appwrite";

// Appwrite configuration
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "672cfc4e003a4709c911",
  databaseId: "672cfccb002f456cb332",
  userCollectionId: "672cfcd0003c114264cd",
  accommodationsCollectionId: "6741d7f2000200706b21",
  cottagesCollectionId: "674342ba0017b324fb03",
  employeesCollectionId: "67432e7e00241eb80e40",
  facilitiesCollectionId: "6741e31a0022f8e43fb3",
  roomsCollectionId: "67432e7e00241eb80e40",
  servicesCollectionId: "6743c72d003a2d3b298d",
};

if (!appwriteConfig.endpoint || !appwriteConfig.projectId) {
  throw new Error("Appwrite environment variables are not defined.");
}

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

// Sign In
export async function signIn(email, password) {
  try {
    // 1. First, ensure we're starting with a clean slate
    try {
      // Try to delete any existing sessions
      const sessions = await account.listSessions();
      await Promise.all(
        sessions.sessions.map(session => account.deleteSession(session.$id))
      );
    } catch (e) {
      console.log("No existing sessions to clear");
    }

    // 2. Clear any existing storage/cookies
    localStorage.clear();
    sessionStorage.clear();
    
    // 3. Create new session
    const session = await account.createEmailPasswordSession(email, password);

    // 4. Fetch user account details
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("Failed to retrieve user account.");

    // 5. Store essential information
    sessionStorage.setItem("userId", currentAccount.$id);
    sessionStorage.setItem("userEmail", currentAccount.email);

    return currentAccount;
  } catch (error) {
    console.error("Sign in error:", error);
    throw new Error(error.message || "Error during login. Please try again.");
  }
}

// Get Current User Document

export async function getCurrentUser() {
  try {
    // Fetch the current account
    const currentAccount = await account.get();

    // Validate the account response
    if (!currentAccount?.$id) {
      throw new Error("No active account found. Please log in.");
    }

    // Fetch the user document from the database
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    // Validate the user document
    if (!response?.documents?.length) {
      throw new Error("User document not found.");
    }

    // Get the user document
    const userDocument = { ...response.documents[0] };

    // Assign default role if missing
    userDocument.role = userDocument.role || "user";

    // Check for role-based permissions
    if (
      userDocument.role === "guests" &&
      !currentAccount.scopes?.includes("account")
    ) {
      throw new Error(
        "Insufficient permissions: User (role: guests) missing scope (account)."
      );
    }

    return userDocument; // Return the validated user document
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    throw new Error(error.message || "Failed to retrieve user data.");
  }
}

// Create New User
export async function createUser(
  email,
  password,
  name,
  role = "user",
  additionalData = {}
) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    const userDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        role,
        ...additionalData, // This will include the municipality
      }
    );
    return userDocument;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw new Error("Failed to create user.");
  }
}

// Sign Out
export const signOut = async () => {
  try {
    // 1. Delete all Appwrite sessions
    const sessions = await account.listSessions();
    const deletionPromises = sessions.sessions.map(session => 
      account.deleteSession(session.$id)
    );
    await Promise.all(deletionPromises);
    
    // 2. Clear all cookies systematically
    const cookies = [
      'sessionId',
      'userRole',
      'userMunicipality',
      'authToken',
      'a_session', // Appwrite session cookie
      'fallback_session'
    ];
    
    // Clear cookies for all possible domains and paths
    cookies.forEach(cookie => {
      // Root path
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      // Domain and subdomain
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });
    
    // 3. Clear storage
    localStorage.clear();
    sessionStorage.clear();
    
    // 4. Reset any global state
    if (typeof window !== 'undefined') {
      // Force a complete page reload to clear any remaining state
      window.location.href = '/login';
    }
    
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    // Even if there's an error, try to clear everything
    try {
      // Attempt cleanup even if main logout fails
      localStorage.clear();
      sessionStorage.clear();
      
      cookies.forEach(cookie => {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      });
      
      // Force reload even on error
      window.location.href = '/login';
    } catch (e) {
      console.error('Error during cleanup:', e);
    }
    throw error;
  }
};

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

export const getDocumentByQuery = async (collectionId, query) => {
  try {
    const response = await databases.listDocuments(collectionId, [query]);
    if (response.total > 0) {
      return response.documents[0]; // Return the first matching document
    }
    throw new Error("No documents found");
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

export const checkDuplicateAccommodation = async (
  establishmentName,
  businessAddress
) => {
  try {
    // Assuming you have a database collection for accommodations
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.accommodationsCollectionId,
      [
        Query.equal("establishmentName", establishmentName),
        Query.equal("businessAddress", businessAddress),
      ]
    );

    // If any documents match, it's a duplicate
    return response.documents.length > 0;
  } catch (error) {
    console.error("Error checking for duplicate accommodation:", error);
    return false;
  }
};
export async function fetchAccommodations() {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.accommodationsCollectionId
    );
    return result.documents.map((doc) => ({
      ...doc,
      approvalStatus: doc.approvalStatus || "pending",
    }));
  } catch (error) {
    console.error("Failed to fetch accommodations:", error);
    throw new Error("Failed to fetch accommodations");
  }
}

export async function fetchServices(accommodationId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      [Query.equal("accommodationId", accommodationId), Query.limit(1000)]
    );
    return result.documents;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    throw new Error("Failed to fetch services");
  }
}

export async function fetchRooms(accommodationId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.roomsCollectionId,
      [Query.equal("accommodationId", accommodationId), Query.limit(1000)]
    );
    return result.documents;
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    throw new Error("Failed to fetch rooms");
  }
}

export async function fetchEmployees(accommodationId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.employeesCollectionId,
      [Query.equal("accommodationId", accommodationId), Query.limit(1000)]
    );
    return result.documents;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw new Error("Failed to fetch employees");
  }
}

export async function fetchCottages(accommodationId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.cottagesCollectionId,
      [Query.equal("accommodationId", accommodationId), Query.limit(1000)]
    );
    return result.documents;
  } catch (error) {
    console.error("Failed to fetch cottages:", error);
    throw new Error("Failed to fetch cottages");
  }
}

export async function fetchFacilities(accommodationId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.facilitiesCollectionId,
      [Query.equal("accommodationId", accommodationId), Query.limit(1000)]
    );
    return result.documents;
  } catch (error) {
    console.error("Failed to fetch facilities:", error);
    throw new Error("Failed to fetch facilities");
  }
}

export async function updateApprovalStatus(accommodationId, status) {
  try {
    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.accommodationsCollectionId,
      accommodationId,
      { approvalStatus: status }
    );
    return result;
  } catch (error) {
    console.error("Failed to update approval status:", error);
    throw new Error("Failed to update approval status");
  }
}
