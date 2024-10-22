import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import NotFound from "./NotFound";

export function ProductsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch Product Details using React Query
  const { data: product, isLoading, error } = useQuery(
    ["product", id], // Unique query key based on product ID
    () => axios.get(`https://dummyjson.com/products/${id}`).then((res) => res.data),
    {
      retry: false, // Disable retries if the request fails
      onError: () => console.error("Error fetching product details"), // Optional: Handle error
    }
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      ) : error ? (
        <NotFound />
      ) : (
        product && (
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col">
              <img
                src={product.images ? product.images[0] : "/default-image.png"}
                alt={product.title}
                className="w-1/2 h-64 object-fill rounded-lg shadow-lg mb-6 mx-auto"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.title}</h1>
                <p className="text-2xl text-gray-900 font-semibold mb-4">${product.price}</p>
                <p className="text-lg text-gray-700 mb-6">{product.description}</p>
                <p className="text-sm text-gray-600">
                  Brand: <span className="font-semibold">{product.brand}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Category: <span className="font-semibold">{product.category}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Weight: <span className="font-semibold">{product.weight} kg</span>
                </p>
                <p className="text-sm text-gray-600">
                  Availability: <span className="font-semibold">{product.availabilityStatus}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Rating: <span className="font-semibold">{product.rating} / 5</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Return Policy: <span className="font-semibold">{product.returnPolicy}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Warranty Information: <span className="font-semibold">{product.warrantyInformation}</span>
                </p>

                {/* Reviews Section */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border border-gray-300 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <img
                              src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726185600&semt=ais_hybrid"
                              alt="User Avatar"
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="text-lg font-semibold">{review.userName}</p>
                              <p className="text-sm text-gray-600">{formatDate(review.date)}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                          <p className="mt-2 text-gray-600">
                            Rating: <span className="font-semibold">{review.rating} / 5</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={() => navigate("/products")}
              >
                See More Products
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
