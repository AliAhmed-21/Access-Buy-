import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Utils/FireBase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSigninWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user information in local storage
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "", 
      }));

      navigate("/products");
    } catch (error) {
      console.log(error.customData.email, error.code, error.message);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user information in local storage
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "", 
      }));

      navigate("/products");
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case "auth/user-not-found":
          alert("No user found with this email. Please check your email or sign up first.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password. Please try again or reset your password.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format. Please enter a valid email address.");
          break;
        default:
          alert("An error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            type="button"
            className={`w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
            onClick={handleSignIn}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className="text-center font-bold text-lg">or</p>
          <button
            type="button"
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSigninWithGoogle}
          >
            Sign In with Google
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account? <p onClick={()=>navigate('/signup')} className="cursor-pointer text-blue-600 hover:underline">Sign Up</p>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
