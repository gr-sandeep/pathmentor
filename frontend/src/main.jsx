import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import "./app.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import Progress from "./components/Progress.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Header from "./components/Header.jsx";
import secureLocalStorage from "react-secure-storage";
import Overview from "./components/Overview.jsx";
import { ConfigProvider } from "antd";
import Chat from "./components/Chat.jsx";

const userInfo = secureLocalStorage.getItem("userInfo");

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider>
    <BrowserRouter>
      {userInfo && <Header />}
      <Routes>
        <Route
          path="/"
          element={userInfo ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/dashboard"
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
          path="/my-progress"
          element={
            <ProtectedRoute>
              <Progress />
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
    </BrowserRouter>
  </ConfigProvider>
);
