import ApiServices from "./ApiServices";

export const uploadToImageKit = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  // Debug: Log FormData contents
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const res = await ApiServices.upload(formData);
    return {
      url: res.data.url,
      fileId: res.data.public_id, // ImageKit uses 'fileId' instead of 'public_id'
      filePath: res.data.filePath // Additional useful metadata
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Image upload failed");
  }
};

export const deleteFromImageKit = async (fileId) => {
  try {
    const res = await ApiServices.delete({ public_id: fileId });
    return res.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Image deletion failed");
  }
};