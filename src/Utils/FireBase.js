import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4wKJ6Da4M-ugPlteS85llegk8TfVHb7c",
  authDomain: "react-proj-4f6e5.firebaseapp.com",
  projectId: "react-proj-4f6e5",
  storageBucket: "react-proj-4f6e5.appspot.com",
  messagingSenderId: "210229133632",
  appId: "1:210229133632:web:0f347adca540af230a3aa5"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);
export const db=getFirestore(app)
// Export both app and auth
export { auth };  
export default app;
