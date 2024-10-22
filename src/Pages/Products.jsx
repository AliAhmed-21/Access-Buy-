import axios from "axios";
import { ProductCard } from "./ProductCard";
import CategoryChip from "./CategoryChip";
import { useQuery } from "react-query";
import { useState } from "react";

export function Products() {
  const [choosenCategory, setChoosenCategory] = useState("All");
  const [visibleProducts, setVisibleProducts] = useState(9);

  // Fetch Products based on the selected category
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery(
    ["products", choosenCategory],
    () => {
      const url =
        choosenCategory === "All"
          ? "https://dummyjson.com/products"
          : `https://dummyjson.com/products/category/${choosenCategory}`;
      return axios.get(url).then((res) => res.data.products);
    },
    {
      keepPreviousData: true, // Keeps showing the previous data while fetching new category data
    }
  );

  // Fetch Categories
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useQuery(
    ["categories"],
    () => axios.get("https://dummyjson.com/products/categories").then((res) => res.data)
  );

  // Add to Wishlist function
  const addToWishlist = (product) => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!savedWishlist.find((item) => item.id === product.id)) {
      const newWishlist = [...savedWishlist, product];
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      alert(`${product.title} has been added to your wishlist!`);
    } else {
      alert(`${product.title} is already in your wishlist.`);
    }
  };

  // Function to load more products when "See More" is clicked
  const handleSeeMore = () => {
    setVisibleProducts((prevVisible) => prevVisible + 9); // Show 9 more products
  };

  // Check if still loading products or categories
  const loading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  return (
    <div className="text-2xl mx-auto text-red-600 font-bold">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center">Error loading data</div>
      ) : (
        <div>
          {/* Category Chips */}
          <div className="flex flex-wrap md:gap-x-2 gap-x-1 md:gap-y-1 md:m-2 m-1 shadow">
  <CategoryChip
    isChoosen={choosenCategory === "All"}
    category={{ name: "All", slug: "All" }}
    onClick={() => setChoosenCategory("All")}
  />

  {categoriesData.map((category) => (
    <CategoryChip
      onClick={() => setChoosenCategory(category.slug)} // Update to category.slug
      isChoosen={category.slug === choosenCategory} // Compare using slug
      key={category.slug} // Use slug as key
      category={category}
    />
  ))}
   </div>

          {/* Product Cards */}
          <div className="flex flex-wrap gap-4 shadow">
            {productsData.slice(0, visibleProducts).map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                onAddToWishlist={() => addToWishlist(product)} // Add to wishlist handler
              />
            ))}
          </div>

          {/* "See More" Button */}
          {visibleProducts < productsData.length && (
            <div className="text-center mt-6">
              <button
                className="bg-gray-500 text-white py-2 my-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={handleSeeMore}
              >
                See More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
