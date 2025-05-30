import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import secureLocalStorage from "react-secure-storage";
import { ConfigProvider } from "antd";
import Chat from "./components/Chat.jsx";
import Layout from "./components/Layout.jsx";
import MyRoadmaps from "./components/MyRoadmaps.jsx";
import { ContextProvider } from "./utils/Context.jsx";

const userInfo = secureLocalStorage.getItem("userInfo");

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={userInfo ? <Navigate to="/home" /> : <Login />}
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-roadmaps"
            element={
              <ProtectedRoute>
                <MyRoadmaps />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat-with-ai"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route />
        </Routes>
      </Layout>
    </BrowserRouter>
  </ContextProvider>
);
