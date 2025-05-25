"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import { useAppcontext } from '@/context/AppContext';
import { toast } from 'sonner';
import ApiServices from '@/lib/ApiServices';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const { cartItems, setCartItems, user } = useAppcontext();
const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };



  const calculateTotal = () => {
    return calculateSubtotal()
  };

  const handleSubmit = async (e) => {
    if (!user) {
      toast.warning('Login to place your order.');

    }
    e.preventDefault();

    try {
      // Create order payload
      const order = {
        address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          zipCode: formData.zipCode
        },
        items: cartItems,
        total: calculateTotal(),
        status: 'Pending',
        userId: user._id
      };
      localStorage.setItem("orderData", JSON.stringify(order))

      const data = {
        user: user._id,
        items:
          cartItems
        ,
        totalPrice: calculateTotal()
      }

      const res = await ApiServices.createPayment(data)
      if (res.data.success) {
        setCartItems([]);
        router.push(res.data.checkoutUrl);
        toast.success('Order placed successfully!');
      }


    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Order Information */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>


              <Button type="submit" className="w-full cursor-pointer mt-6" size="lg">
                Pay ${calculateTotal().toFixed(2)}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column - Cart Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {cartItems.map((item,index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">


                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;