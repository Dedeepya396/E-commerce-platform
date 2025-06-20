import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FrontPage from "./FrontPage";
import LoginDetails from "./LoginPage";
import Signup from "./SignupPage";
import ProfilePage from "./ProfilePage";
import SearchPage from "./searchItems";
import ItemDetails from "./ItemsDetails";
import Cart from "./MyCart";
import Layout from "./Layout";
import Order from "./Orders";
import Deliver from "./Deliver";
import Chatbot from "./chatbot";
const sessionPersistence = () => {
  // checks whether the token is present or not
  const token = localStorage.getItem("sessionToken");
  // if token is present -> user should be redirected to protected routes
  if (token) return true;
  else return false;
};
// if user is logged in then will be taken to element page else it will be redirected to login page
const ProtectedRoute = ({ element, redirectTo }) => {
  return sessionPersistence() ? element : <Navigate to={redirectTo} />;
};
// if user is logged in, they will be taken to (redirectTo) page else they will be taken to element page
const PublicRoute = ({ element, redirectTo }) => {
  return sessionPersistence() ? <Navigate to={redirectTo} /> : element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/" // homepath
          element={
            // logged in -> take to profile page else take to home page
            <PublicRoute element={<FrontPage />} redirectTo="/profile" />
          }
        />
        <Route
          path="/login" // if logged in -> profile else login
          element={
            <PublicRoute element={<LoginDetails />} redirectTo="/profile" />
          }
        />
        <Route
          path="/signup" // if logged in -> profile else signup page
          element={<PublicRoute element={<Signup />} redirectTo="/profile" />}
        />
        <Route
          path="/profile"
          element={
            // if logged in go to profile page else redirects to login
            <ProtectedRoute
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
              redirectTo="/login"
            />
          }
        />
        <Route
          path="/search" // if logged in go to search page else redirects to login
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <SearchPage />
                </Layout>
              }
              redirectTo="/login"
            />
          }
        />
        <Route // if logged in go to items page else redirects to login
          path="/search/:id"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <ItemDetails />
                </Layout>
              }
              redirectTo="/login"
            />
          }
        />
        <Route
          path="/mycart"  // if logged in go to cart page else redirects to login
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Cart />
                </Layout>
              }
              redirectTo="/login"
            />
          }
        />
        <Route
          path="/orders"  // if logged in go to orders page else redirects to login
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Order />
                </Layout>
              }
              redirectTo="/login"
            />
          }
        />
        <Route
          path="/deliver"  // if logged in go to deliver page else redirects to login
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Deliver />
                </Layout>
              }
              redirectTo="/login"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
