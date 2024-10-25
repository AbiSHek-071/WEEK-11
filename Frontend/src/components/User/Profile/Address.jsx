import React, { useState } from 'react';
import { MapPin, Phone, Mail, Edit, Trash2, Plus, X } from 'lucide-react';



export default function Address() {

    //states
    const [name, setName] = useState("");
    const [email,setEmail] = useState("");
    const [place, setPlace] = useState("");
    const [phone, setPhone] = useState(0);
    const [address, setAddress] = useState("");
    const [landmarl, setlandmarl] = useState("");
    const [pincode, setpincode] = useState("")
    const [city, setcity] = useState("")

  const addresses = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St',
      pincode: '12345',
      landmark: 'Near Central Park',
      city: 'New York',
      district: 'Manhattan',
      state: 'NY'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      address: '456 Elm St',
      pincode: '67890',
      landmark: 'Opposite City Hall',
      city: 'Los Angeles',
      district: 'Downtown',
      state: 'CA'
    },
  ];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const newAddress ={
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
  };

  const handleInputChange = () => {
  
  };

  const handleAddAddress = () => {
    if (Object.values(newAddress).every(val => val)) {
      setAddresses(prev => [...prev, { ...newAddress, id: Date.now() }]);
      setNewAddress({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
      });
      setIsAdding(false);
    }
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setNewAddress({ ...addressToEdit });
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const handleUpdateAddress = () => {
    if (editingId && Object.values(newAddress).every(val => val)) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingId ? { ...newAddress, id: editingId } : addr
      ));
      setNewAddress({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
      });
      setIsAdding(false);
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewAddress({
      name: '',
      email: '',
      phone: '',
      address: '',
      pincode: '',
      landmark: '',
      city: '',
      district: '',
      state: '',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-6xl mt-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add New Address
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map(address => (
          <div key={address.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{address.name}</h3>
              <div className="flex space-x-2">
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleEditAddress(address.id)}
                >
                  <Edit size={18} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                {address.address}, {address.landmark}
              </p>
              <p className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                {address.email}
              </p>
              <p className="flex items-center text-gray-600">
                <Phone size={16} className="mr-2" />
                {address.phone}
              </p>
              <p className="text-gray-600">
                {address.city}, {address.district}, {address.state} - {address.pincode}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={newAddress.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="email"
              name="email"
              value={newAddress.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="tel"
              name="phone"
              value={newAddress.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="text"
              name="address"
              value={newAddress.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="text"
              name="landmark"
              value={newAddress.landmark}
              onChange={handleInputChange}
              placeholder="Landmark"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="text"
              name="pincode"
              value={newAddress.pincode}
              onChange={handleInputChange}
              placeholder="Pincode"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="text"
              name="city"
              value={newAddress.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="text"
              name="district"
              value={newAddress.district}
              onChange={handleInputChange}
              placeholder="District"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="text"
              name="state"
              value={newAddress.state}
              onChange={handleInputChange}
              placeholder="State"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingId ? handleUpdateAddress : handleAddAddress}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {editingId ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}