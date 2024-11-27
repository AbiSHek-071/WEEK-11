import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCroppedImg } from "../../../util/CropImage";
import Cropper from "react-easy-crop";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import axiosInstance from "@/AxiosConfig";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { validateProduct } from "../../../util/ValidationFunctions.jsx";
import Loading from "@/components/shared/Loading";

export default function AddProduct() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [crops, setCrops] = useState([{ x: 0, y: 0 }]);
  const [croppedPixels, setCroppedPixels] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [zooms, setZooms] = useState([1]);

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState([
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
  ]);
  const [addInfo, setAddInfo] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [catId, setCatId] = useState(null);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCat() {
      try {
        const response = await axiosInstance.get("/admin/categories/active");
        setCategories(response.data.categories);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return toast.error(err.response.data.message);
        }
        toast.error("An error occurred. Please try again.");
      }
    }
    fetchCat();
    setIsLoading(false);
  }, []);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = fileURL;
        return newImages;
      });
      setCrops((prev) => {
        const newCrops = [...prev];
        newCrops[index] = { x: 0, y: 0 };
        return newCrops;
      });
      setCroppedImages((prev) => {
        const newCroppedImages = [...prev];
        newCroppedImages[index] = null;
        return newCroppedImages;
      });
    }
  };

  const onCropComplete = useCallback(
    (index) => (croppedArea, croppedPixel) => {
      setCroppedPixels((prev) => {
        const newCroppedPixels = [...prev];
        newCroppedPixels[index] = croppedPixel;
        return newCroppedPixels;
      });
    },
    []
  );

  const handleCropped = async (index) => {
    const croppedImageBlob = await getCroppedImg(
      images[index],
      croppedPixels[index]
    );
    const croppedImageURL = URL.createObjectURL(croppedImageBlob);
    setCroppedImages((prev) => {
      const newCroppedImages = [...prev];
      newCroppedImages[index] = croppedImageURL;
      return newCroppedImages;
    });
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  async function handleAddProduct() {

    if(!catId){
      return toast.error("SELECT A CATEGORY TO CONTINUE")
    }
    if(!sleeve){
      return toast.error("SELECT A SLEEVE TO CONTINUE")
    }

    const validate = validateProduct(
      name,
      price,
      description,
      addInfo,
      croppedImages,
      setError
    );
    if (validate) {
      try {
        setIsLoading(true);
        const convertBlobUrlToFile = async (blobUrl) => {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          const file = new File(
            [blob],
            `image_${new Date().toLocaleString().replace(/[/: ]/g, "_")}.png`,
            { type: blob.type }
          );
          return file;
        };

        const files = [];
        for (const blobUrl of croppedImages) {
          const file = await convertBlobUrlToFile(blobUrl);
          files.push(file);
        }
        console.log(files);

        // Upload each file to Cloudinary
        const uploadedImageUrls = [];
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "my_unsigned_preset");

          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dneqndzyc/image/upload/",
            formData
          );

          uploadedImageUrls.push(res.data.secure_url);
        }

        const response = await axiosInstance.post("/admin/product", {
          name,
          price,
          salePrice,
          description,
          sizes,
          addInfo,
          catId,
          sleeve,
          uploadedImageUrls,
        });
        setIsLoading(false);
        navigate("/admin/product");
        toast.success(response.data.message);
      } catch (err) {
        toast.error("Error uploading images:", err);
        if (err.response && err.response.status === 404) {
          return toast.error(err.response.data.message);
        }
        toast.error("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {images.map(
        (image, index) =>
          image && (
            <div
              key={index}
              className="crop-container"
              style={{
                width: "100%",
                height: "700px",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
                backgroundColor: "#fff",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {crops[index] && (
                <Cropper
                  image={image}
                  crop={crops[index]}
                  zoom={zooms[index]}
                  aspect={2 / 3}
                  onCropChange={(newCrop) => {
                    const newCrops = [...crops];
                    newCrops[index] = newCrop;
                    setCrops(newCrops);
                  }}
                  onZoomChange={(newZoom) => {
                    const newZooms = [...zooms];
                    newZooms[index] = newZoom;
                    setZooms(newZooms);
                  }}
                  onCropComplete={onCropComplete(index)}
                />
              )}

              <button
                className="relative top-10"
                onClick={() => handleCropped(index)}
              >
                done
              </button>
            </div>
          )
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Add Product</h2>
          <p className="text-gray-500">Dashboard &gt; product &gt; add</p>
        </div>

        <div className="bg-white relative shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="border-2 min-h-40 max-w-40 border-dashed border-gray-300 rounded-lg p-4 text-center flex items-center justify-center flex-col relative"
                >
                  {croppedImages[index] ? (
                    <img src={croppedImages[index]} alt="Cropped Image" />
                  ) : (
                    <>
                      <input
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">Browse Image</p>
                    </>
                  )}
                </div>
              ))}
              <span className="text-red-700 absolute bottom-5  mt-10 ms-2">
                {error && error.croppedImages}
              </span>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4">
              <Input
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Product name here..."
              />
              <span className="text-red-700  mt-10 ms-2">
                {error && error.name}
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 font-semibold">Stocks Quantity</p>
                  <div className="grid grid-cols-2 gap-2">
                    {sizes.map((item, index) => (
                      <div key={item.size} className="flex items-center">
                        <span className="w-8">{item.size}</span>
                        <Select
                          onValueChange={(value) => {
                            const updatedSizes = [...sizes];
                            updatedSizes[index].stock = parseInt(value);
                            setSizes(updatedSizes);
                            console.log(sizes);
                          }}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="0" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(
                              (num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                 
                  <Input
                    onChange={(e) => {setSalePrice(e.target.value); setPrice(e.target.value)}}
                    placeholder="Enter Sale Price here..."
                    className="mt-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  onValueChange={(value) => {
                    setCatId(value);
                    console.log(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat, index) => {
                      return (
                        <SelectItem key={index} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) => {
                    setSleeve(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sleeve Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short Sleeve</SelectItem>
                    <SelectItem value="long">Long Sleeve</SelectItem>
                    <SelectItem value="sleeveless">Sleeveless</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6 space-y-4">
                <Textarea
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  placeholder="Enter Product Description here..."
                  className="min-h-[100px]"
                />
                <span className="text-red-700  mt-10 ms-2">
                  {error && error.description}
                </span>
                <Textarea
                  onChange={(e) => {
                    setAddInfo(e.target.value);
                  }}
                  placeholder="Enter Additional Information about the product here..."
                  className="min-h-[100px]"
                />
                <span className="text-red-700  mt-10 ms-2">
                  {error && error.addInfo}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              onClick={() => {
                navigate("/admin/product");
              }}
              variant="outline"
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button>Product adding...</Button>
            ) : (
              <Button onClick={handleAddProduct}>Add Product</Button>
            )}
          </div>
        </div>
        <Loading isLoading={isLoading} />
      </main>
    </div>
  );
}
