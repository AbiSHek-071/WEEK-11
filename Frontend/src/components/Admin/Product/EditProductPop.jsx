import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "../../../util/CropImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Edit, Tag, Trash2, SquareMinus, Minus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "@/AxiosConfig";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";

function EditProductPop({ product, categories, setReload }) {

  useEffect(()=>{

  },[])

  
  
  const [sizes, setSizes] = useState(product.sizes || []);
  

  const [editName, setEditName] = useState(product.name);
  const [editDescription, setEditDescription] = useState(product.description);
  const [editCategory, setEditCategory] = useState(product.category._id);
  const [editPrice, setEditPrice] = useState(product.price);
  const [editSalePrice,setEditSalePrice] = useState(product.salePrice);
  const [editSleeve, setEditSleeve] = useState(product.sleeve);
  const [editSizes, setEditSizes] = useState(product.sizes);
  const [editImages, setEditImages] = useState(product.images);


  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [crops, setCrops] = useState([{ x: 0, y: 0 }]);
  const [croppedPixels, setCroppedPixels] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [zooms, setZooms] = useState([1]);
  const[error,setError] = useState({})

  // const [isLoading,setIsLoading] =useState(false);

  function validate() {
    const error = {};

   if (!editName?.trim()) {
     error.name = "Product name is required";
   } else if (editName.trim().length < 4) {
     error.name = "Product name must be at least 4 characters long";
   } else if (!/^[a-zA-Z\s]+$/.test(editName.trim())) {
     error.name = "Product name can only contain letters and spaces";
   }

   if (!editPrice) {
     error.price = "Price is required";
   } else if (isNaN(editPrice) || editPrice <= 0) {
     error.price = "Price must be a positive number";
   }

   if (!editDescription?.trim()) {
     error.description = "Description is required";
   } else if (editDescription.trim().split(/\s+/).length < 3) {
     error.description = "Description must be at least 3 words";
   } else if (/^\d/.test(editDescription.trim())) {
     error.description = "Description cannot start with a number";
   }   
   if (!croppedImages || !Array.isArray(croppedImages) || croppedImages.length + editImages.length < 3) {
     error.croppedImages = "At least 3 images are required";
   }   
    setError(error);
    if (Object.keys(error).length == 0) {
      return true;
    } else {
      return false;
    }
  }

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

  async function handleEdit() {
    if (validate()) {
      try {
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
          if (!blobUrl) {
            files.push(blobUrl);
          } else {
            const file = await convertBlobUrlToFile(blobUrl);
            files.push(file);
          }
        }

        // Upload each file to Cloudinary
        const uploadedImageUrls = [];
        for (const file of files) {
          if (!file) {
            uploadedImageUrls.push(file);
          } else {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my_unsigned_preset");

            const res = await axios.post(
              "https://api.cloudinary.com/v1_1/dneqndzyc/image/upload/",
              formData
            );

            uploadedImageUrls.push(res.data.secure_url);
          }
        }
        const imagesEdit = [];

        Array.from({ length: 5 }).map((_, index) => {
          if (uploadedImageUrls[index]) {
            imagesEdit.push(uploadedImageUrls[index]);
          } else {
            if (editImages[index]) {
              imagesEdit.push(editImages[index]);
            } else {
              console.log("upload true", uploadedImageUrls[index]);
            }
          }
        });

        const result = await axiosInstance.put("/admin/product", {
          _id: product._id,
          name: editName,
          description: editDescription,
          price: editPrice,
          salePrice:editSalePrice,
          category: editCategory,
          sleeve: editSleeve,
          sizes: editSizes,
          images: imagesEdit,
        });

        // setReload(true);
        toast.success(result.data.message);
      } catch (err) {
        if (err.result && err.result.status === 404) {
          return toast.error(err.result.data.message);
        }
        toast.error("An error occurred. Please try again.");
        console.log(err);
      }
    }
  }

 function handleRemoveImage(deleteImage) {
   // First, check if the image is part of the fetched editImages
   const updatedEditImages = editImages.filter(
     (image) => image !== deleteImage
   );

   // Then, check if the image is part of the newly cropped images
   const updatedCroppedImages = croppedImages.filter(
     (image) => image !== deleteImage
   );

   // Update the states accordingly
   setEditImages(updatedEditImages);
   setCroppedImages(updatedCroppedImages);
 }
 const allImages = [...editImages, ...croppedImages];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex gap-2' variant='outline' size='sm'>
          <Eye className='w-4 h-4 ' />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[1000px]'>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>View and edit product details</DialogDescription>
        </DialogHeader>

        {/* cropper */}
        {images.map(
          (image, index) =>
            image && (
              <div
                key={index}
                className='crop-container'
                style={{
                  width: "100%",
                  height: "800px",
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  padding: "20px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}>
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
                  className='relative top-10'
                  onClick={() => handleCropped(index)}>
                  done
                </button>
              </div>
            )
        )}

        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                onChange={(e) => setEditName(e.target.value)}
                value={editName}
                className='col-span-3'
              />
              <span className='text-red-700 absolute bottom-5  mt-10 ms-2'></span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price' className='text-right'>
                Price
              </Label>

              <Input
                id='price'
                onChange={(e) => setEditPrice(e.target.value)}
                value={editPrice}
                className='col-span-3'
              />
              <span className='text-red-700 absolute bottom-5  mt-10 ms-2'></span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price' className='text-right'>
                Sale Price
              </Label>

              <Input
                id='salePrice'
                onChange={(e) => setEditSalePrice(e.target.value)}
                value={editSalePrice}
                className='col-span-3'
              />
              <span className='text-red-700 absolute bottom-5  mt-10 ms-2'></span>
            </div>

            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='description' className='text-right pt-2'>
                Description
              </Label>
              <Textarea
                id='description'
                value={editDescription || ""}
                onChange={(e) => setEditDescription(e.target.value)}
                className='col-span-3 h-32'
                placeholder='Enter product description'
              />
              <span className='text-red-700 absolute bottom-5  mt-10 ms-2'></span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='category' className='text-right'>
                Category
              </Label>
              <div className='col-span-3'>
                <Select
                  onValueChange={(value) => {
                    setEditCategory(value);
                  }}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={product.category.name} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat, index) => (
                      <SelectItem key={index} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='sleeve-select' className='text-right'>
                Sleeve
              </Label>
              <div className='col-span-3'>
                <Select
                  onValueChange={(value) => {
                    setEditSleeve(value);
                  }}>
                  <SelectTrigger id='sleeve-select' className='w-full'>
                    <SelectValue placeholder={`${product.sleeve} sleeve`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='short'>Short Sleeve</SelectItem>
                    <SelectItem value='long'>Long Sleeve</SelectItem>
                    <SelectItem value='sleeveless'>Sleeveless</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex flex-col absolute bottom-5 border p-5'>
              <span className='text-red-700 '>{error && error.name}</span>
              <span className='text-red-700 '>
                {error && error.description}
              </span>
              <span className='text-red-700 '>{error && error.price}</span>
              <span className='text-red-700 '>
                {error && error.croppedImages}
              </span>
            </div>
          </div>
          <div className='space-y-4'>
            <Label>Sizes and Stock</Label>
            <div className='grid grid-cols-2 gap-2'>
              {product.sizes.map((item, index) => (
                <div key={item.size} className='flex items-center space-x-2'>
                  <span className='w-8 text-sm font-medium'>{item.size}</span>
                  <Select
                    onValueChange={(value) => {
                      const updatedSizes = [...sizes];

                      updatedSizes[index].stock = parseInt(value);
                      setEditSizes(updatedSizes);
                    }}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={item.stock} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => i).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <Label>Product Images</Label>
            <div className='grid grid-cols-3 gap-2'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className='border-2 h-56 w-36 aspect-square border-dashed border-gray-300 rounded-lg p-2 text-center flex items-center justify-center flex-col relative'>
                  {croppedImages[index] || editImages[index] ? (
                    <>
                      <img
                        src={croppedImages[index] || editImages[index]}
                        alt={`Product Image ${index + 1}`}
                        className='rounded-lg h-full w-full object-cover'
                      />
                      <span
                        onClick={() =>
                          handleRemoveImage(
                            croppedImages[index] || editImages[index]
                          )
                        }
                        className='my-2 cursor-pointer text-red-500 hover:underline'>
                        Remove
                      </span>
                    </>
                  ) : (
                    <span className='text-gray-500'>Add Image</span>
                  )}
                  <input
                    style={{ height: "80%" }}
                    className='absolute inset-0 w-full opacity-0 cursor-pointer upload-area'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                </div>
              ))}
            </div>

            <span className='text-red-700 absolute bottom-5  mt-10 ms-2'></span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleEdit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(EditProductPop);
