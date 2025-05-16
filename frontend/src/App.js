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
  const token = localStorage.getItem("sessionToken");
  if (token) return true;
  else return false;
};

const ProtectedRoute = ({ element, redirectTo }) => {
  return sessionPersistence() ? element : <Navigate to={redirectTo} />;
};

const PublicRoute = ({ element, redirectTo }) => {
  return sessionPersistence() ? <Navigate to={redirectTo} /> : element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute element={<FrontPage />} redirectTo="/profile" />
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute element={<LoginDetails />} redirectTo="/profile" />
          }
        />
        <Route
          path="/signup"
          element={<PublicRoute element={<Signup />} redirectTo="/profile" />}
        />
        <Route
          path="/profile"
          element={
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
          path="/search"
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
        <Route
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
          path="/mycart"
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
          path="/orders"
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
          path="/deliver"
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
