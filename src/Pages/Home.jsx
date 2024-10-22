import React, { useState } from "react";

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-gray-800">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-white mb-4">
          Welcome to Our Store!
        </h1>
        <p className="text-sm md:text-lg text-center text-gray-300 mb-8">
          Explore our wide range of products and enjoy shopping like never before!
        </p>
        <button
          onClick={openModal}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Shop Now
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6 md:mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-4">Access Required</h2>
              <p className="text-gray-700 mb-6">
                Please sign up or log in to access our store and start shopping.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Close
                </button>
                <a
                  href="/signin"
                  className="px-4 py-2 bg-blue-600 text-center text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sign In / Sign Up
                </a>
                <a
                  href="/admin"
                  className="px-4 py-2 bg-green-600 text-center text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Admin Panel
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
