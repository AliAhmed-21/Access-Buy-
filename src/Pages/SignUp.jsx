import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Utils/FireBase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Email/Password Sign-Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with the username
      await updateProfile(user, { displayName: userName });
      localStorage.removeItem("wishlist");
      localStorage.removeItem("cart");

      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "",
      }));

      alert("Sign-up successful!");
      navigate("/products");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-Up
  const handleSignUpWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.removeItem("wishlist");
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "", 
      }));

      alert("Sign-up with Google successful!");
      navigate("/products"); 
    } catch (error) {
      console.error("Error signing up with Google:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className="text-center font-bold text-lg">or</p>
          <button
            type="button"
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSignUpWithGoogle}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up with Google"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account? <span onClick={()=>navigate('/signin')} className="cursor-pointer text-blue-600 hover:underline">Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
