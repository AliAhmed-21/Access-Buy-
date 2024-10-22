import React, { createContext, useEffect, useState } from "react";
import { auth } from "../Utils/FireBase";
import { Spinner } from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [user, setUser] = useState({
    isLogin: false,
    userInfo: {},
  });
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  // Handle user state changes
  function onAuthChanged(user) {
    if (user) {
      setUser({
        isLogin: true,
        userInfo: {
          name: user?.displayName,
          photoURL: user?.photoURL,
          email: user?.email,
        },
      });

      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setWishlist(savedWishlist);
      setCart(savedCart);
    } else {
      setUser({ isLogin: false, userInfo: {} });
      // Clear wishlist and cart when user logs out
      setWishlist([]);
      setCart([]);
    }
    setLoading(false); 
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthChanged);
    return ()=>subscriber(); // Unsubscribe on unmount
  }, []);

  // Function to add product to wishlist
  const addToWishlist = (product) => {
    const newWishlist = [...wishlist, product];
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  // Function to remove product from wishlist
  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter((item) => item.id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  // Function to add product to cart
  const addToCart = (product) => {
    const newCart = [...cart, product];
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  // Function to remove product from cart
  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wishlist,
        cart,
        addToWishlist,
        removeFromWishlist,
        addToCart,
        removeFromCart,
      }}
    >
      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
