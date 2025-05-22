import ApiServices from "./ApiServices";

export const uploadToCloudinary = async (file) => {
  console.log("file", file);

  const formData = new FormData();
  formData.append("image", file);

  // Show what's actually inside FormData
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  const res = await ApiServices.upload(formData);

  return res.data;
};

export const deleteFromCloudinary = async (public_id) => {
  const data = {
    public_id,
  };
  const res = await ApiServices.delete(data);
  return res.data;
};
