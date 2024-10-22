import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., send data to an API or server
    console.log("Form Data Submitted:", formData);
    setFormSubmitted(true);
    setFormData({
      username: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600 mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Your username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-600 mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Your message"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Send Message
          </button>
        </form>
        {formSubmitted && (
          <div className="mt-4 text-green-600">
            <p>Thank you for your message! We will get back to you soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
