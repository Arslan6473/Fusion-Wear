"use client";
import ApiServices from "@/lib/ApiServices";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext({});

export function AppProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersOrders, setUsersOrders] = useState([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [allOrders, setAllOrders] = useState([]);

  const getUsersOrders = async () => {
    try {
      setLoading(true);
      const response = await ApiServices.getUserOrders(user._id);
      if (response.data.success) {
        setUsersOrders(response.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) return;
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cartItems to localStorage:", error);
    }
  }, [cartItems, hasHydrated]);


  useEffect(() => {
    if (typeof window === "undefined") return;

    const hydrateState = () => {
      // Hydrate user
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch {
          setUser(null);
          setIsLoggedIn(false);
          localStorage.removeItem("user");
        }
      }

      // Hydrate cart
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart && storedCart !== "undefined" && storedCart !== "null") {
        try {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);
        } catch {
          setCartItems([]);
          localStorage.removeItem("cartItems");
        }
      }

      setHasHydrated(true);
    };

    hydrateState();
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await ApiServices.getProducts();
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const response = await ApiServices.getAllOrders();
      if (response.data.success) {
        setAllOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching all orders:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllProducts();
      getUsersOrders();
      if(user.role === "admin"){
   
        fetchAllOrders();
      }
    }
    
  }, [user]);

  const logout = async () => {
    try {
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    loading,
    user,
    logout,
    setUser,
    usersOrders,
    getUsersOrders,
    cartItems,
    setCartItems,
    editProduct,
    setEditProduct,
    products,
    setProducts,
    hasHydrated,
    allOrders, setAllOrders,getUsersOrders 
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppcontext = () => {
  return useContext(AppContext);
};