import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Utils/FireBase";

const OrderTracking = () => {
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("user.email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orderData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))[0];

        setOrder(orderData);
        setError("");
        updateOrderStatusMessage(orderData);
      } else {
        setError("No order found for this email.");
      }
    } catch (e) {
      setError("Error fetching order data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatusMessage = (orderData) => {
    const currentTime = new Date();
    const orderTime = new Date(orderData.createdAt.seconds * 1000); // Convert Firestore timestamp to JS Date
    const timeDifference = Math.abs(currentTime - orderTime);
    const hoursPassed = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert ms to hours

    // Prioritize manual status, otherwise fall back to time-based status
    let message = orderData.status || "Processing";
    if (hoursPassed >= 6 && hoursPassed < 12) {
      message = "On the Way";
    } else if (hoursPassed >= 12 && hoursPassed < 18) {
      message = "Almost Delivered";
    } else if (hoursPassed >= 18 && hoursPassed < 24) {
      message = "Out for Delivery";
    } else if (hoursPassed >= 24) {
      message = "Delivered Soon";
    }

    setStatusMessage(message);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Track Your Order</h2>

        {!order && (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-600 mb-2 text-lg">Enter your email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg"
                placeholder="Your email"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              {loading ? "Searching..." : "Track Order"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 text-red-600 text-lg">
            <p>{error}</p>
          </div>
        )}

        {order && (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h3>
            <div className="flex items-center md:space-x-6 mb-6 space-x-3 md:text-xl text-sm">
              {order.user.photoURL && order.user.photoURL !== "/default-avatar.png" ? (
                <img
                  src={order.user.photoURL}
                  alt="User Avatar"
                  className="md:w-24 w-16 md:h-24 h-16 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-3xl">?</span>
                </div>
              )}
              <div>
                <h4 className="text-xl font-semibold">{order.user.name}</h4>
                <p className="text-md text-gray-600">{order.user.email}</p>
                <p className="text-md text-gray-600">Ordered on: {formatDate(order.createdAt)}</p>
                <p className="text-md text-gray-600">Delivery by: {order.deliveryDate}</p>
              </div>
            </div>
            <p className="text-md text-gray-500"><strong>Order ID:</strong> {order.id}</p>
            <p className="text-md text-gray-500"><strong>Status:</strong> {statusMessage || order.status || "Processing"}</p>

            {/* Ordered Items Section */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-4">Ordered Items:</h4>
              <ul className="md:space-y-4 space-y-2">
                {order.items.map(item => (
                  <li key={item.id} className="md:flex items-center border border-gray-300  rounded-lg md:p-4 p-2 md:text-xl text-sm shadow-sm">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="ml-6 flex-1">
                      <h5 className="text-md font-semibold">{item.title}</h5>
                      <p className="text-md text-gray-500">Category: {item.category}</p>
                      <p className="text-md text-gray-500">Quantity: {item.quantity}</p> {/* Display item quantity */}
                      <p className="text-lg font-bold text-green-500">${item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 text-right">
                <p className="text-md text-gray-500">
                  <strong>Total Items Ordered:</strong> {order.items.reduce((total, item) => total + item.quantity, 0)} {/* Calculate total items */}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-300 mt-6 pt-4 text-right">
              <p className="text-xl font-bold">Total: ${order.totalAmount}</p>
              <p className="text-md text-gray-500">Delivery Charge: ${order.deliveryCharge}</p>
              <p className="text-xl font-bold">Final Amount: ${order.totalAmount + order.deliveryCharge}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
