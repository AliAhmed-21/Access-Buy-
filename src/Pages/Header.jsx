import React, { useContext } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem, Button, Avatar } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { AuthContext } from "../Context/AuthContext.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../Utils/FireBase.js";

export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOutUser = async () => {
    await signOut(auth);
    navigate("/");
  };

  const menuItems = [
    { name: "Wishlist", path: "/wishlist" },
    { name: "Store", path: "/products" },
    { name: "Cart", path: "/confirm-order" },
    { name: "Reviews", path: "/reviews" },
    { name: "Contact", path: "/contact" },
    { name: "Track Order", path: "/order-tracking" },
  ];

  return (
    <Navbar disableAnimation isBordered>
      {/* Mobile Menu Toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Brand Logo for Mobile and Desktop */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          {/* Make the brand name smaller for mobile */}
          <p className="font-bold text-inherit text-lg">ACCESSBUY</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">ACCESSBUY</p>
        </NavbarBrand>

        {user?.isLogin ? (
          menuItems.map((item) => (
            <NavbarItem
              key={item.path}
              className={`relative flex items-center ${location.pathname === item.path ? "border-b-2 border-red-800" : ""}`}
            >
              <RouterLink
                to={item.path}
                className={`flex items-center cursor-pointer ${location.pathname === item.path ? "text-red-800 font-bold" : "text-gray-800"}`}
              >
                {item.name}
              </RouterLink>
            </NavbarItem>
          ))
        ) : (
          <p className="text-gray-800">Please sign up or log in to access more features.</p>
        )}
      </NavbarContent>

      {/* Right Side for User Actions */}
      <NavbarContent justify="end" className="flex items-center gap-2">
        {user?.isLogin ? (
          <>
            {user?.userInfo?.photoURL ? (
              <Avatar src={user?.userInfo?.photoURL} size="md" />
            ) : (
              // Adjust font size for mobile and ensure the name is aligned in one line
              <span className="text-gray-800 font-bold text-base sm:text-lg">
                {user?.userInfo?.name || "User"}
              </span>
            )}
            {/* Show logout button beside avatar only in desktop view */}
            <Button
              onClick={handleLogOutUser}
              color="primary"
              variant="light"
              className="ml-2 hidden sm:inline-block"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <RouterLink to="/signin">
              <Button variant="flat" >Log In</Button>
            </RouterLink>
          </>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      {user?.isLogin && (
        <NavbarMenu>
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.path}>
              <RouterLink
                className={`flex items-center w-full  ${location.pathname === item.path ? "text-red-800" : "text-gray-800"}`}
                to={item.path}
              >
                {item.name}
              </RouterLink>
            </NavbarMenuItem>
          ))}
          {/* Show logout button in mobile menu */}
          <NavbarMenuItem>
            <Button
              onClick={handleLogOutUser}
              color="primary"
              variant="flat"
              className="w-full text-center sm:hidden"
            >
              Logout
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      )}
    </Navbar>
  );
}
