

////////////////Product Validation/////////////////////
export function validateProduct(
  name,
  price,
  description,
  addInfo,
  croppedImages,
  setError
) {
  const error = {};

  if (!name?.trim()) {
    error.name = "Product name is required";
  } else if (name.trim().length < 4) {
    error.name = "Product name must be at least 4 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    error.name = "Product name can only contain letters and spaces";
  }

  if (!price) {
    error.price = "Price is required";
  } else if (isNaN(price) || price <= 0) {
    error.price = "Price must be a positive number";
  }

  if (!description?.trim()) {
    error.description = "Description is required";
  } else if (description.trim().split(/\s+/).length < 3) {
    error.description = "Description must be at least 3 words";
  } else if (/^\d/.test(description.trim())) {
    error.description = "Description cannot start with a number";
  }

  if (!addInfo?.trim()) {
    error.addInfo = "Additional information is required";
  } else if (addInfo.trim().split(/\s+/).length < 3) {
    error.addInfo = "Additional information must be at least 3 words";
  }

  if (
    !croppedImages ||
    !Array.isArray(croppedImages) ||
    croppedImages.length < 3
  ) {
    error.croppedImages = "At least 3 images are required";
  }

  setError(error);
  if (Object.keys(error).length == 0) {
    return true;
  } else {
    return false;
  }
}

//////////Edit Product Validate///////////////////
export function validateEditProduct(
  name,
  price,
  description,
  setError
) {
  const error = {};

  if (!name?.trim()) {
    error.name = "Product name is required";
  } else if (name.trim().length < 4) {
    error.name = "Product name must be at least 4 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    error.name = "Product name can only contain letters and spaces";
  }

  if (!price) {
    error.price = "Price is required";
  } else if (isNaN(price) || price <= 0) {
    error.price = "Price must be a positive number";
  }

  if (!description?.trim()) {
    error.description = "Description is required";
  } else if (description.trim().split(/\s+/).length < 3) {
    error.description = "Description must be at least 3 words";
  } else if (/^\d/.test(description.trim())) {
    error.description = "Description cannot start with a number";
  }

  setError(error);
  if (Object.keys(error).length == 0) {
    return true;
  } else {
    return false;
  }
}


/////////////Category Validation////////////////////
export function validateCategory(cname, description, setError) {
  const error = {};
  if (!cname?.trim()) {
    error.name = "Category name is required";
  } else if (cname.trim().length < 4) {
    error.name = "Category name must be at least 4 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(cname.trim())) {
    error.name = "Category name can only contain letters and spaces";
  }

  if (!description?.trim()) {
    error.description = "Description is required";
  } else if (description.trim().split(/\s+/).length < 3) {
    error.description = "Description must be at least 3 words";
  } else if (/^\d/.test(description.trim())) {
    error.description = "Description cannot start with a number";
  } else if (!/^[a-zA-Z0-9\s]+$/.test(description.trim())) {
    error.description =
      "Description can only contain letters, numbers, and spaces";
  }

  setError(error);
  if (Object.keys(error).length == 0) {
    return true;
  } else {
    return false;
  }
}

////////////////User Signup Validation /////////////////

export function validateSignup(name, email, phone, password, setError) {
  const error = {};

  if (!name?.trim()) {
    error.name = "Name is required";
  } else if (/^\d/.test(name.trim())) {
    error.name = "Name should not start with a number";
  } else if (!/^[a-zA-Z0-9\s]+$/.test(name.trim())) {
    error.name = "Name can only contain letters, numbers, and spaces";
  }

  if (!email?.trim()) {
    error.email = "Email is required";
  } else if (/^\d/.test(email.trim())) {
    error.email = "Email should not start with a number";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
  ) {
    error.email = "Invalid email format";
  }

  if (!phone?.trim()) {
    error.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(phone)) {
    error.phone = "Phone number should be 10 digits";
  }

  if (!password?.trim()) {
    error.password = "Password is required";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password.trim())
  ) {
    error.password =
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number";
  }


  setError(error);
  if (Object.keys(error).length == 0) {
    return true;
  } else {
    return false;
  }
}



///////////////////////////Address Validation ////////////////////////////

export function validateAddress(
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
) {
  const error = {};

  if (!name?.trim()) {
    error.name = "Name is required";
  } else if (/^\d/.test(name.trim())) {
    error.name = "Name should not start with a number";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    error.name = "Name can only contain letters and spaces";
  }

  if (!email?.trim()) {
    error.email = "Email is required";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
  ) {
    error.email = "Invalid email format";
  }

  if (!phone?.trim()) {
    error.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(phone.trim())) {
    error.phone = "Phone number should be 10 digits";
  }

  if (!address?.trim()) {
    error.address = "Address is required";
  } else if (address.trim().length < 10) {
    error.address = "Address must be at least 10 characters long";
  }

  if (!pincode?.trim()) {
    error.pincode = "Pincode is required";
  } else if (!/^\d{6}$/.test(pincode.trim())) {
    error.pincode = "Pincode must be a 6-digit number";
  }

  if (!landmark?.trim()) {
    error.landmark = "Landmark is required";
  } else if (landmark.trim().length < 3) {
    error.landmark = "Landmark must be at least 3 characters long";
  }

  if (!city?.trim()) {
    error.city = "City is required";
  } else if (!/^[a-zA-Z\s]+$/.test(city.trim())) {
    error.city = "City can only contain letters and spaces";
  }

  if (!district?.trim()) {
    error.district = "District is required";
  } else if (!/^[a-zA-Z\s]+$/.test(district.trim())) {
    error.district = "District can only contain letters and spaces";
  }

  if (!state?.trim()) {
    error.state = "State is required";
  } else if (!/^[a-zA-Z\s]+$/.test(state.trim())) {
    error.state = "State can only contain letters and spaces";
  }

  setError(error);
  return Object.keys(error).length === 0;
}



///////////////////User Details Validation//////////////
export function validateUserDetails(name, phone, setError) {
  const error = {};

  // Name validation
  if (!name?.trim()) {
    error.name = "Name is required";
  } else if (/^\d/.test(name.trim())) {
    error.name = "Name should not start with a number";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    error.name = "Name can only contain letters and spaces";
  }

  // Phone validation
  if (!phone) {
    error.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(phone)) {
    error.phone = "Phone number should be exactly 10 digits Number";
  }

  // Set error messages
  setError(error);

  // Return true if no errors, otherwise false
  return Object.keys(error).length === 0;
}
