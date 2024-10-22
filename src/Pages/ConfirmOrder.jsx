import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../Utils/FireBase";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';

export function ConfirmOrder() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const navigate = useNavigate();

  const handleDataBase = async () => {
    if (!user) {
      alert("You need to be logged in to place an order.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty! Please add items to your cart before placing an order.");
      return; 
    }

    try {
      const orderData = {
        user: {
          name: user?.name || "Unknown",
          email: user?.email || "Unknown",
          photoURL: user?.photoURL || "/default-avatar.png",
        },
        items: cart.map(item => ({
          title: item.title,
          category: item.category,
          price: item.price,
          thumbnail: item.thumbnail,
          id: item.id,
          quantity: item.quantity 
        })),
        totalAmount: total,
        deliveryCharge: deliveryCharge,
        numberOfItems: cart.reduce((sum, item) => sum + item.quantity, 0), 
        orderDate: currentDate,
        deliveryDate: deliveryDate,
        createdAt: serverTimestamp(),
      };

      const q = query(collection(db, "orders"), where("user.email", "==", user?.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0].id;
        await updateDoc(doc(db, "orders", existingDoc), {
          items: [...querySnapshot.docs[0].data().items, ...orderData.items],
          totalAmount: querySnapshot.docs[0].data().totalAmount + total,
          deliveryCharge: deliveryCharge,
          numberOfItems: querySnapshot.docs[0].data().numberOfItems + cart.reduce((sum, item) => sum + item.quantity, 0),
          createdAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "orders"), orderData);
      }

      // EmailJS integration for sending order details via email
      const orderDetails = cart.map(item => `Product: ${item.title}, Price: $${item.price}`).join("\n");

      const templateParams = {
        to_name: user.name,    // User's name
        from_name: "AccessBuy",  // Sender's fixed name
        to_email: user.email,  // User's email
        order_date: currentDate,
        delivery_date: deliveryDate,
        number_of_items: cart.reduce((sum, item) => sum + item.quantity, 0),
        total_amount: total,
        delivery_charge: deliveryCharge,
        order_details: orderDetails  // Detailed list of items
      };

      try {
        await emailjs.send("service_dxpd5c2", "template_c6sjrxi", templateParams, "ukE60C4dFH-09v9UA");
        console.log("Email sent successfully");
        alert("Order placed successfully and confirmation email sent!");
      } catch (err) {
        console.error("Error sending email:", err);
        alert("Error sending confirmation email.");
      }

      // Proceed with navigation to payment page
      navigate('/payment');
      alert("Order placed successfully!");

      // Clear the cart and other state values after order placement
      localStorage.removeItem("cart");
      setCart([]);
      setTotal(0);
      setDeliveryCharge(0);

    } catch (e) {
      alert("Error placing order: " + e.message);
    }
  };

  

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartWithQuantities = savedCart.map(item => ({ ...item, quantity: item.quantity || 1 })); 
    setCart(cartWithQuantities);

    updateTotalAndDelivery(cartWithQuantities);

    const today = new Date();
    setCurrentDate(today.toLocaleDateString());

    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 3);
    setDeliveryDate(deliveryDate.toLocaleDateString());
  }, []);

  const updateTotalAndDelivery = (updatedCart) => {
    const totalAmount = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalAmount);
    setDeliveryCharge(totalAmount < 500 ? 10 : 120);
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateTotalAndDelivery(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); 
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateTotalAndDelivery(updatedCart);
  };

  const removeItemFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateTotalAndDelivery(updatedCart);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Confirm Your Order</h2>

      {user && (
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      
      {cart.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border border-gray-300 rounded-lg p-4 shadow-sm flex items-center"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">Category: {item.category}</p>
                  <p className="text-lg font-bold text-green-500 text-center">${item.price}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-200 text-gray-800 py-1 px-3 rounded-l-lg"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>
                    <p className="px-4">{item.quantity}</p>
                    <button
                      className="bg-gray-200 text-gray-800 py-1 px-3 rounded-r-lg"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded-lg shadow-md hover:bg-red-600 transition"
                  onClick={() => removeItemFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300 mt-4 pt-4 text-right">
            <p className="text-lg font-bold">Total: ${total}</p>
            <p className="text-sm text-gray-500">Number of items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p className="text-sm text-gray-500 mt-2">
              {total < 50
                ? "Delivery charges are $5 because the total is less than $50."
                : "Delivery charges are $15 because the total is $50 or more."}
            </p>
            <p className="text-lg font-bold mt-2">Delivery Charge: ${deliveryCharge}</p>

            {/* Display current date and delivery date */}
            <p className="text-sm text-gray-500 mt-2">Order Date: {currentDate}</p>
            <p className="text-sm text-gray-500 mt-2">
              Your item will be delivered by: {deliveryDate}
            </p>

            <p className="text-lg font-bold mt-2">
              Final Amount: ${total + deliveryCharge}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">Your cart is empty.</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={handleDataBase}
        >
          {cart.length > 0 ? "Buy Now" : "Done"}
        </button>
      </div>
    </div>
  );
}
