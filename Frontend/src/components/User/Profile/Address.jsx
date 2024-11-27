import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Edit, Trash2, Plus, X } from "lucide-react";
import axiosInstance from "@/AxiosConfig";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { validateAddress } from "@/util/ValidationFunctions";
import PropTypes from "prop-types";
export default function Address({ selectedAddress, setSelectedAddress }) {
  const userData = useSelector((store) => store.user.userDatas);
  const [addresses, setAddresses] = useState([]);
  const [reload, setReload] = useState(false);

  async function fetchAddress() {
    try {
      const response = await axiosInstance.get(`/user/address/${userData._id}`);
      console.log("address",response.data.address);
      setSelectedAddress(response.data.address[0]);
      setAddresses(response.data.address);
    } catch (err) {
      if (err.response) {
        return toast.error(err.response.data.message);
      }
    }
  }

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Individual state variables for each field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState({});

  const handleAddAddress = async () => {
    const validate = validateAddress(
      name,
      email,
      phone,
      address,
      pincode,
      landmark,
      city,
      district,
      state,
      setError
    );
    if (validate) {
      try {
        const newAddress = {
          user: userData._id,
          name,
          email,
          phone,
          address,
          pincode,
          landmark,
          city,
          district,
          state,
        };
        const response = await axiosInstance.post("/user/address", {
          newAddress,
          userId: userData._id,
        });

        resetForm();
        setIsAdding(false);
        return toast.success(response.data.message);
      } catch (err) {
        console.log(err);
        return toast.error(err.response.data.message);
      }
    }
  };

  const handleEditAddress = (address) => {
    setName(address.name);
    setEmail(address.email);
    setPhone(address.phone);
    setAddress(address.address);
    setPincode(address.pincode);
    setLandmark(address.landmark);
    setCity(address.city);
    setDistrict(address.district);
    setState(address.state);
    setEditingId(address._id);
    setIsAdding(true);
  };

  const handleUpdateAddress = async () => {
    try {
      const newAddress = {
        _id: editingId,
        name,
        email,
        phone,
        address,
        pincode,
        landmark,
        city,
        district,
        state,
      };
      const response = await axiosInstance.post("/user/address/edit", {
        newAddress,
        userId: userData._id,
      });
      resetForm();
      setIsAdding(false);
      setEditingId(null);
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      return toast.error(err.response.data.message);
    }
  };

  async function handleDeleteAddress(address) {
    try {
      const response = await axiosInstance.delete(
        `/user/address/${address._id}`
      );
      setReload(true);
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      return toast.error(err.response.data.message);
    }
  }

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPincode("");
    setLandmark("");
    setCity("");
    setDistrict("");
    setState("");
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchAddress();
    setReload(false);
  }, [isAdding, reload]);

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
        {addresses.map((address) => (
          <div
            onClick={
              setSelectedAddress ? () => setSelectedAddress(address) : undefined
            }
            key={address._id}
            className={`bg-gray-50 border ${
              selectedAddress === address ? "border-black" : "border-gray-200"
            } rounded-lg p-4 hover:shadow-md transition-shadow`}
          >
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{address.name}</h3>
              <div className="flex space-x-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(address);
                  }}
                >
                  <Edit size={18} />
                </button>
                {setSelectedAddress ? (
                  ""
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
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
                {address.city}, {address.district}, {address.state} -{" "}
                {address.pincode}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.name && (
                <span className="text-red-500 text-sm mt-1">{error.name}</span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.email && (
                <span className="text-red-500 text-sm mt-1">{error.email}</span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.phone && (
                <span className="text-red-500 text-sm mt-1">{error.phone}</span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.address && (
                <span className="text-red-500 text-sm mt-1">
                  {error.address}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Landmark"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.landmark && (
                <span className="text-red-500 text-sm mt-1">
                  {error.landmark}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.pincode && (
                <span className="text-red-500 text-sm mt-1">
                  {error.pincode}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.city && (
                <span className="text-red-500 text-sm mt-1">{error.city}</span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="District"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.district && (
                <span className="text-red-500 text-sm mt-1">
                  {error.district}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error.state && (
                <span className="text-red-500 text-sm mt-1">{error.state}</span>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={editingId ? handleUpdateAddress : handleAddAddress}
              className="px-4 py-2 bg-gray-800 text-white rounded-md"
            >
              {editingId ? "Update Address" : "Add Address"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
Address.propTypes = {
  selectedAddress: PropTypes.object,
  setSelectedAddress: PropTypes.func,
};
