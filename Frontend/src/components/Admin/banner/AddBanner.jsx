import { addBannerApi } from "@/APIs/Banner/Banner";
import axiosInstance from "@/AxiosConfig";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddBanner = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [advertisement, setAdvertisement] = useState("");
  const [isLoading,setIsLoading] = useState(false);

  //preview image
  const [previewImage, setpreviewImage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const prev = URL.createObjectURL(file);
    setpreviewImage(prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      //upload Image to Cloudinary
      const UploadFile = image;
      console.log("UploadFile::::::::::::::::", UploadFile);

      const formData = new FormData();
      formData.append("file", UploadFile);
      formData.append("upload_preset", "my_unsigned_preset");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dneqndzyc/image/upload/",
        formData
      );

      const imageUrl = res.data.secure_url;

      const response = await addBannerApi(
        title,
        subtitle,
        advertisement,
        imageUrl
      );
      setIsLoading(false);
      navigate("/admin/banner");
      return toast.success(response.data.messsage);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.messsage);
      }
      console.log(err);
    }
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-left">Add Banner</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Uploaded banner"
                    className="max-w-full h-auto"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setpreviewImage("");
                    }}
                    className=" text-red-600"
                  >
                    Remove{" "}
                  </button>
                </>
              ) : (
                <div className="py-16">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      Click to upload image
                    </p>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium text-gray-700"
              >
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label
                htmlFor="advertisement"
                className="block text-sm font-medium text-gray-700"
              >
                Advertisement
              </label>
              <textarea
                id="advertisement"
                rows="4"
                value={advertisement}
                onChange={(e) => setAdvertisement(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Cancel
          </button>
          {isLoading ?<button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Saving...
          </button> :<button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Save
          </button>}
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
