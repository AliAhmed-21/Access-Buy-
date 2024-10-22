import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";

export function ShowWishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load wishlist from local storage
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  // Function to remove item from wishlist
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((product) => product.id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    alert("Item removed from wishlist.");
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl text-center mb-6">Your Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((product) => (
            <ProductCard 
              product={product} 
              key={product.id} 
              onRemoveFromWishlist={() => removeFromWishlist(product.id)} 
              isWishlist={true} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty!</h2>
          <p className="text-gray-500">Start adding items to your wishlist and see them here.</p>
        </div>
      )}
    </div>
  );
}
