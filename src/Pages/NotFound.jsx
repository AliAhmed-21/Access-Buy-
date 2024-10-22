import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</p>
      <p className="text-lg text-gray-500 mt-2 mb-8">Sorry, the page you are looking for does not exist.</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
}
