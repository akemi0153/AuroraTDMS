import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { account, databases } from "@/services/appwrite";
import { ID, Query } from "appwrite";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user information
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get current logged-in account
        const currentAccount = await account.get();

        // Fetch user document from database
        const userDocuments = await databases.listDocuments(
          "672cfccb002f456cb332",
          "672cfcd0003c114264cd",
          [Query.equal("accountId", currentAccount.$id)]
        );

        if (userDocuments.documents.length > 0) {
          const userDoc = userDocuments.documents[0];
          setUser({
            ...currentAccount,
            ...userDoc,
            dateJoined: userDoc.$createdAt,
          });

          // Initialize form data
          setFormData({
            name: userDoc.name || currentAccount.name,
            email: currentAccount.email,
            phone: userDoc.phone || "",
            address: userDoc.address || "",
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update user document in the database
      await databases.updateDocument(
        "672cfccb002f456cb332",
        "672cfcd0003c114264cd",
        user.$id,
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }
      );

      // Optional: Update account name
      await account.updateName(formData.name);

      toast.success("Profile updated successfully!");

      // Update local state
      setUser((prevUser) => ({
        ...prevUser,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const InputField = ({
    icon: Icon,
    label,
    name,
    type = "text",
    value,
    onChange,
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
    </div>
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={User}
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          icon={Mail}
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        <InputField
          icon={Phone}
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
        <InputField
          icon={MapPin}
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Profile
          </button>
        </div>
      </form>
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold mb-2">Account Information</h3>
        <p className="text-gray-600">
          Member since: {user && new Date(user.dateJoined).toLocaleDateString()}
        </p>
        <p className="text-gray-600">User ID: {user?.$id}</p>
      </div>
    </div>
  );
};

export default Profile;
