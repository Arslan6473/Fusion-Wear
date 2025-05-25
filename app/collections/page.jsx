"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAppcontext } from "@/context/AppContext";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "shirts", label: "Shirts" },
  { value: "pants", label: "Pants" },
  { value: "jackets", label: "Jackets" },
  { value: "hoodies", label: "Hoodies" },
  { value: "shoes", label: "Shoes" },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const { products, setCartItems, cartItems } = useAppcontext();
  const productsPerPage = 8;
  const router = useRouter();

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesColors = selectedColors.length === 0 || selectedColors.some(color => product.colors.includes(color));
    const matchesSizes = selectedSizes.length === 0 || selectedSizes.some(size => product.sizes.includes(size));

    return matchesSearch && matchesCategory && matchesPrice && matchesColors && matchesSizes;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0; // Default or 'featured' sorting
    }
  });

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const price = product.onSale ? product.salePrice : product.price;
    
    // Basic cart item (without size/color selection)
    const cartItem = {
      id: product._id,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.image,
      stock: product.stock
    };

    const existingItemIndex = cartItems.findIndex(
      item => item.id === product._id && 
             (!item.size || item.size === cartItem.size) && 
             (!item.color || item.color?.name === cartItem.color?.name)
    );

    if (existingItemIndex >= 0) {
      const updatedCartItems = [...cartItems];
      const newQuantity = updatedCartItems[existingItemIndex].quantity + 1;
      
      if (newQuantity > product.stock) {
        toast.warning(`Cannot add more than available stock (${product.stock})`);
        return;
      }

      updatedCartItems[existingItemIndex].quantity = newQuantity;
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      toast.success('Item quantity updated in cart');
    } else {
      const newCartItems = [...cartItems, cartItem];
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      toast.success('Item added to cart');
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Get all unique colors and sizes from products
  const allColors = Array.from(new Set(products.flatMap(product => product.colors)));
  const allSizes = Array.from(new Set(products.flatMap(product => product.sizes)));

  const toggleColor = (colorName) => {
    setSelectedColors(prev =>
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </h3>

            {/* Price Range Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={300}
                step={10}
                className="mb-4"
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">Colors</h4>
            <div className="space-y-2">
              {allColors.map((color) => (
                <div key={color._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`color-${color.name}`}
                    checked={selectedColors.includes(color.name)}
                    onChange={() => toggleColor(color.name)}
                    className="mr-2"
                  />
                  <label htmlFor={`color-${color.name}`} className="text-sm capitalize">
                    {color.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">Sizes</h4>
            <div className="grid grid-cols-3 gap-2">
              {allSizes.map((size) => (
                <div key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                    className="mr-1"
                  />
                  <label htmlFor={`size-${size}`} className="text-sm">
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Search and sort bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Sort by <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={sortOption === "featured"}
                    onCheckedChange={() => setSortOption("featured")}
                  >
                    Featured
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption === "price-low"}
                    onCheckedChange={() => setSortOption("price-low")}
                  >
                    Price: Low to High
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption === "price-high"}
                    onCheckedChange={() => setSortOption("price-high")}
                  >
                    Price: High to Low
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption === "rating"}
                    onCheckedChange={() => setSortOption("rating")}
                  >
                    Highest Rated
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Product grid */}
          {currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <Card 
                    key={product._id} 
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="hover:shadow-lg transition-shadow cursor-pointer p-0 m-0"
                  >
                    <CardHeader className="relative p-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-80 object-cover rounded-t-lg"
                      />
               
                      {product.onSale && (
                        <Badge className="absolute top-4 left-4 bg-red-500">
                          SALE
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="px-4">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <span className="text-gray-600 capitalize">{product.category}</span>
                      </CardDescription>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={i < Math.floor(product.rating) ? "#FFD700" : "none"}
                            stroke="#FFD700"
                            strokeWidth="1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-500 ml-1">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center px-4  pb-2">
                      <div className="flex flex-col">
                        {product.onSale ? (
                          <>
                            <span className="font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-bold">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <Button 
                        className={"cursor-pointer"}
                        size="sm" 
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange([0, 300]);
                  setSelectedColors([]);
                  setSelectedSizes([]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}