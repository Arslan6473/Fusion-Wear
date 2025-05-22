"use client"
import { useEffect, useState } from 'react';
import { 
  ChevronRight, 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart,
  Truck, 
  RefreshCw, 
  Check,
  ChevronDown,
  Plus,
  Minus,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import ApiServices from '@/lib/ApiServices';
import { useAppcontext } from '@/context/AppContext';
import { toast } from 'sonner';

export default function ProductView() {
  const { id } = useParams();
  const router = useRouter();
  const { products, cartItems, setCartItems } = useAppcontext();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const relatedProducts = products.filter((item) => item._id !== id).slice(0, 4);

  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleQuantityChange = (action) => {
    if (action === 'increment' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  const addToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.warning('Please select size and color');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.onSale ? product.salePrice : product.price,
      image: product.image,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock
    };

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product._id && 
             item.size === selectedSize && 
             item.color?.name === selectedColor?.name
    );

    if (existingItemIndex >= 0) {
      // If exists, update quantity if it won't exceed stock
      const updatedCart = [...cartItems];
      const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        toast.warning(`Cannot add more than available stock (${product.stock})`);
        return;
      }

      updatedCart[existingItemIndex].quantity = newQuantity;
      setCartItems(updatedCart);
      toast.success('Item quantity updated in cart');
    } else {
      // If not exists, add new item
      setCartItems([...cartItems, cartItem]);
      toast.success('Item added to cart');
    }
  };

  const buyNow = () => {
    addToCart();
    router.push('/checkout');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await ApiServices.getProduct(id);
        if (res.data.success) {
          setProduct(res.data.product);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loading/>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
            {product.onSale && (
              <Badge className="absolute top-4 left-4 bg-red-500">SALE</Badge>
            )}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white h-8 w-8 rounded-full"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            {product.onSale ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-red-600 mr-2">
                  ${formatPrice(product.salePrice)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${formatPrice(product.price)}
                </span>
                <Badge className="ml-2 bg-red-500">
                  Save ${formatPrice(product.price - product.salePrice)}
                </Badge>
              </div>
            ) : (
              <span className="text-2xl font-bold">${formatPrice(product.price)}</span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Color: {selectedColor?.name}</h3>
            <div className="flex space-x-2">
              {product?.colors?.map((color) => (
                <button
                  key={color?.name}
                  className={`h-8 w-8 rounded-full border ${
                    selectedColor?.name === color.name
                      ? "ring-2 ring-blue-600 ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color)}
                  title={color?.name}
                ></button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <RadioGroup 
              value={selectedSize} 
              onValueChange={setSelectedSize}
              className="grid grid-cols-6 gap-2 sm:flex sm:flex-wrap"
            >
              {product.sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={size} 
                    id={`size-${size}`} 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor={`size-${size}`}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-gray-200 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-600"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={() => handleQuantityChange('decrement')}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div className="flex items-center justify-center h-10 w-16 border-y">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => handleQuantityChange('increment')}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <span className="ml-4 text-sm text-gray-500">
                {product.stock} items available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button className="flex-1" size="lg" onClick={addToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button className="flex-1" size="lg">
              <Camera className="mr-2 h-4 w-4" /> How it looks on me
            </Button>
            <Button variant="outline" size="lg" onClick={buyNow}>
              Buy Now
            </Button>
          </div>

          {/* Shipping & Returns */}
          <div className="flex flex-col space-y-3 text-sm mb-6">
            <div className="flex items-center">
              <Truck className="mr-2 h-4 w-4 text-gray-600" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4 text-gray-600" />
              <span>Free 30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <div key={item._id} className="group">
              <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium text-sm group-hover:text-blue-600">
                {item.name}
              </h3>
              <p className="mt-1 text-gray-700">${formatPrice(item.price)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}