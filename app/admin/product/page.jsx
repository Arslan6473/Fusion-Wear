"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useAppcontext } from "@/context/AppContext";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/helpers";
import ApiServices from "@/lib/ApiServices";

export default function ProductForm() {
  const { editProduct } = useAppcontext()
  const [product, setProduct] = useState(
    editProduct || {
      name: "",
      price: 0,
      salePrice: 0,
      onSale: false,
      rating: 0,
      reviewCount: 0,
      description: "",
      features: [],
      sizes: [],
      colors: [],
      image: "",
      imagePublicId: "",
      transparentImagePublicId: "",
      transparentImage: "",
      stock: 0,
      category: "",
    }
  );

  const [newFeature, setNewFeature] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState({ name: "", value: "#000000" });
  const [imagePreview, setImagePreview] = useState(product.image || "");
  const [transparentImagePreview, setTransparentImagePreview] = useState(product.transparentImage || "");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (value) => {
    setProduct({
      ...product,
      category: value,
    });
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value === "" ? "" : Number(value),
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setProduct({
        ...product,
        features: [...product.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setProduct({
      ...product,
      features: product.features.filter((_, i) => i !== index),
    });
  };

  const addSize = () => {
    if (newSize.trim()) {
      setProduct({
        ...product,
        sizes: [...product.sizes, newSize.trim().toUpperCase()],
      });
      setNewSize("");
    }
  };

  const removeSize = (index) => {
    setProduct({
      ...product,
      sizes: product.sizes.filter((_, i) => i !== index),
    });
  };

  const addColor = () => {
    if (newColor.name.trim() && newColor.value) {
      setProduct({
        ...product,
        colors: [...product.colors, { ...newColor }],
      });
      setNewColor({ name: "", value: "#000000" });
    }
  };

  const removeColor = (index) => {
    setProduct({
      ...product,
      colors: product.colors.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (product.image && product.imagePublicId) {
        await deleteFromCloudinary(product.imagePublicId);
      }

      const uploaded = await uploadToCloudinary(file);
      setImagePreview(uploaded.url);
      setProduct({
        ...product,
        image: uploaded.url,
        imagePublicId: uploaded.public_id,
      });
    }
  };

  const handleTransparentImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (product.transparentImage && product.transparentImagePublicId) {
        await deleteFromCloudinary(product.transparentImagePublicId);
      }

      const uploaded = await uploadToCloudinary(file);
      setTransparentImagePreview(uploaded.url);
      setProduct({
        ...product,
        transparentImage: uploaded.url,
        transparentImagePublicId: uploaded.public_id,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        const editResponse = await ApiServices.updateProduct(product._id, product);
        const data = editResponse.data;
        if (data.success) {
          alert("Product updated successfully");
        }
      } else {
        const response = await ApiServices.createProduct(product);
        const data = response.data;
        if (data.success) {
          alert("Product created successfully");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {editProduct ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={product.category} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirts">Shirts</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="hoodies">Hoodies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleNumberInputChange}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <input
                    id="onSale"
                    name="onSale"
                    type="checkbox"
                    checked={product.onSale}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="onSale">On Sale</Label>
                </div>
                {product.onSale && (
                  <div className="mt-2">
                    <Label htmlFor="salePrice">Sale Price ($)</Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.salePrice}
                      onChange={handleNumberInputChange}
                      required={product.onSale}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={handleNumberInputChange}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Ratings */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={product.rating}
                  onChange={handleNumberInputChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="reviewCount">Review Count</Label>
                <Input
                  id="reviewCount"
                  name="reviewCount"
                  type="number"
                  min="0"
                  value={product.reviewCount}
                  onChange={handleNumberInputChange}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <Label>Features</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.features.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.sizes.map((size, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add new size (e.g., M)"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSize}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label>Colors</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.colors.map((color, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <div
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="colorName">Color Name</Label>
                  <Input
                    id="colorName"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    placeholder="Color name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="colorValue">Color Value</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="colorValue"
                      type="color"
                      value={newColor.value}
                      onChange={(e) =>
                        setNewColor({ ...newColor, value: e.target.value })
                      }
                      className="h-10 w-10 p-0 border-none"
                    />
                    <Input
                      value={newColor.value}
                      onChange={(e) =>
                        setNewColor({ ...newColor, value: e.target.value })
                      }
                      placeholder="Hex color code"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={addColor}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Color
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div>
              <Label>Product Image</Label>
              <div className="flex flex-col sm:flex-row gap-6 mt-2">
                <div className="w-full sm:w-48 h-48 border rounded-md overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      No image selected
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload a high-quality image of your product (recommended size:
                    600×800px)
                  </p>
                </div>
              </div>
            </div>

            {/* Transparent Product Image */}
            <div>
              <Label>Transparent Product Image (PNG)</Label>
              <div className="flex flex-col sm:flex-row gap-6 mt-2">
                <div className="w-full sm:w-48 h-48 border rounded-md overflow-hidden bg-checkerboard">
                  {transparentImagePreview ? (
                    <img
                      src={transparentImagePreview}
                      alt="Transparent product preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      No transparent image selected
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="transparentImage"
                    type="file"
                    accept="image/png"
                    onChange={handleTransparentImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload a transparent PNG image of your product (recommended size:
                    600×800px with transparent background)
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                {editProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}