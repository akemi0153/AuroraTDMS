import { toast } from "@/components/ui/use-toast";
import {
  account,
  databases,
  getCurrentUser,
  appwriteConfig,
} from "@/lib/appwrite";

export async function fetchUserInfo() {
  try {
    const user = await getCurrentUser();
    return {
      id: user.$id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role || "user",
    };
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    toast({
      title: "Error",
      description: "Failed to fetch user information",
      variant: "destructive",
    });
    throw new Error("Failed to fetch user info");
  }
}

export async function updateUserInfo(data) {
  try {
    const currentUser = await getCurrentUser();

    // Update the user document in the database
    const updatedDoc = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
      }
    );

    // Update the account name
    await account.updateName(data.name || "");

    return {
      id: updatedDoc.$id,
      name: updatedDoc.name,
      email: updatedDoc.email,
      phone: updatedDoc.phone || "",
      role: updatedDoc.role || "user",
    };
  } catch (error) {
    console.error("Failed to update user info:", error);
    toast({
      title: "Error",
      description: "Failed to update user information",
      variant: "destructive",
    });
    throw new Error("Failed to update user info");
  }
}
