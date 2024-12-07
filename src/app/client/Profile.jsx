import React, { useState } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ ...user, ...formData });
    alert('Profile updated successfully!');
  };

  const InputField = ({ icon: Icon, label, name, type = 'text', value, onChange }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
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

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField icon={User} label="Name" name="name" value={formData.name} onChange={handleChange} />
        <InputField icon={Mail} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <InputField icon={Phone} label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        <InputField icon={MapPin} label="Address" name="address" value={formData.address} onChange={handleChange} />
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
        <p className="text-gray-600">Member since: {new Date(user.dateJained).toLocaleDateString()}</p>
        <p className="text-gray-600">User ID: {user.id}</p>
      </div>
    </div>
  );
};

export default Profile;

