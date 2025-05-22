"use client"
import { useEffect, useState } from 'react';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Plus,
  Minus,
  LogIn
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppcontext } from '@/context/AppContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import ApiServices from '@/lib/ApiServices';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cartItems, setCartItems, isLoggedIn, setIsLoggedIn, user, setUser, logout } = useAppcontext();
  const router = useRouter();
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const code = authResult["code"];
        const res = await ApiServices.singin(code);
        const response = res.data;

        if (response.success) {
          localStorage.setItem("user", JSON.stringify(response?.user));
          setUser(response?.user);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.log("Error while login with google ", error);
    }
  };

  const clickHandle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  useEffect(() => {
    if (user && user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Contact", href: "/contact" },
    ...(isAdmin
      ? [
        { label: "Products", href: "/admin/products" },
        { label: "Orders", href: "/admin/orders" }
      ]
      : [])
  ];

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Calculate cart quantity
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle quantity change
  const updateQuantity = (id, action) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        if (action === 'increment') {
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === 'decrement' && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  // Handle remove item
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  return (
    <header className="border-b sticky top-0 bg-white z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={"/"} className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Fusion Wear</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 px-2 py-1 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartQuantity > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartQuantity}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Your Cart ({cartQuantity} items)</SheetTitle>
                </SheetHeader>

                {cartItems.length > 0 ? (
                  <div className="flex flex-col h-full px-4 pb-4">
                    <div className="flex-1 overflow-auto py-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center py-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 rounded object-cover mr-4"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                            <div className="flex items-center mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, 'decrement')}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-2 w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, 'increment')}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 mt-2"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between py-2">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between py-2 font-medium">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button onClick={() => router.push("/checkout")} className="w-full mt-4 cursor-pointer">Checkout</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <SheetClose asChild>
                      <Button variant="link" className="mt-2">Continue Shopping</Button>
                    </SheetClose>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Authentication */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    src={user?.avatar}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    alt={user?.fullName}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={"/my-orders"}>
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className={"cursor-pointer"}>Sign In</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center py-6">
                    <Button
                      onClick={clickHandle}
                      variant="outline"
                      className="w-full max-w-sm flex cursor-pointer items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" shapeRendering="geometricPrecision">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Sign in with Google
                    </Button>
                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>By signing in, you agree to our Terms and Privacy Policy</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 py-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}