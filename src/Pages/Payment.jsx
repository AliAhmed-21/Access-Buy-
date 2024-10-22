import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const paymentMethods = [
    { name: "Credit Card", description: "Pay using Visa, MasterCard, or American Express." },
    { name: "PayPal", description: "Secure payment through your PayPal account." },
    { name: "Bank Transfer", description: "Transfer directly from your bank account." },
    { name: "Cash on Delivery", description: "Pay in cash upon delivery." },
  ];

  const handleProceedToPayment = () => {
    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }
    setError(""); 
    alert("Thank you for considering our store! We appreciate your purchase and hope to serve you again.")
    navigate("/products");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-6 shadow-lg bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Select Your Payment Method</h2>
        <div className="border-b border-gray-200 mb-6"></div>

        <div className="my-6">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedMethod(method.name);
                setError("");
              }}
              className={`my-4 p-4 rounded-lg shadow-md cursor-pointer transition-all ${
                selectedMethod === method.name
                  ? "bg-blue-100 border border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-700">{method.name}</h3>
              <p className="text-gray-600">{method.description}</p>
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <button
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
