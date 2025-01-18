import { NextResponse } from "next/server";
import { databases } from "@/services/appwrite";
import { appwriteConfig } from "@/services/appwrite";
import { Query } from "appwrite";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.accommodationsCollectionId,
      [Query.equal("userId", userId)]
    );

    return NextResponse.json({
      exists: response.documents.length > 0,
    });
  } catch (error) {
    console.error("Error checking submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
