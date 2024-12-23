import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Key } from "lucide-react";
import { account, databases } from "@/services/appwrite";
import { ID, Query } from "appwrite";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentAccount = await account.get();

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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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

      await account.updateName(formData.name);

      toast.success("Profile updated successfully!");

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
    disabled = false,
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
        </div>
        <Input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="pl-10 w-full border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
          disabled={disabled}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <User className="h-12 w-12 text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Your Profile</h2>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-700">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <InputField
                  icon={User}
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <InputField
                  icon={Mail}
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <InputField
                  icon={Phone}
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <InputField
                  icon={MapPin}
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
              >
                Update Profile
              </Button>
            </motion.div>
          </form>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 border-t border-indigo-200 pt-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                <span>
                  Member since:{" "}
                  {user && new Date(user.dateJoined).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Key className="mr-2 h-5 w-5 text-indigo-500" />
                <span>User ID: {user?.$id}</span>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Profile;
