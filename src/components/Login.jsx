import React, { useEffect, useState } from "react";
import { auth, provider, signInWithPopup } from "../utils/Firebase";
import secureLocalStorage from "react-secure-storage";
import googleIcon from "../assets/google-icon.svg";
import { Button, Input, message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";

/**
 * Login component for user authentication.
 * Supports email/password and Google sign-in.
 * @component
 */
const Login = () => {
  // State variables for user input
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loginDisabled, setloginDisabled] = useState(false);

  // Input validation helper
  const validateInput = (input) => {
    // Basic validation: no spaces, not empty, length check
    return (
      typeof input === "string" && input.trim() !== "" && input.length <= 100
    );
  };

  useEffect(() => {
    // Disable login if username or password is invalid
    if (!validateInput(username) || !validateInput(password)) {
      setloginDisabled(true);
    } else {
      setloginDisabled(false);
    }
  }, [username, password]);

  /**
   * Handles Google sign-in using Firebase popup.
   * Logs success and error events.
   */
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userInfo = {
        token: result.user?.accessToken,
        refreshToken: result.user?.refreshToken,
        userName: result.user?.displayName,
        userEmail: result.user?.email,
        userImg: result.user?.photoURL,
      };
      secureLocalStorage.setItem("userInfo", userInfo);
      console.log("[Login] Google sign-in successful:", userInfo);
      window.location = "/home";
    } catch (error) {
      // Log error with context
      console.error("[Login] Error signing in with Google:", error);
      message.error("Google sign-in failed. Please try again.");
    }
  };

  /**
   * Handles email/password sign-in.
   * Validates input and logs events.
   */
  const handleSignInWithEmailandPassword = async () => {
    if (!validateInput(username) || !validateInput(password)) {
      message.error("Invalid username or password format.");
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, username, password);
      const userInfo = {
        token: result.user?.accessToken,
        refreshToken: result.user?.refreshToken,
        userName: result.user?.displayName,
        userEmail: result.user?.email,
        userImg: result.user?.photoURL,
      };
      secureLocalStorage.setItem("userInfo", userInfo);
      console.log("[Login] Email/password sign-in successful:", userInfo);
      window.location = "/home";
    } catch (error) {
      // Log error with context
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`[Login] Sign In Error: ${errorCode} - ${errorMessage}`);
      message.error("Sign in failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-row items-center justify-evenly h-screen w-full gap-5 login fixed overflow-hidden">
      <div className="w-1/2"></div>
      <div className="flex flex-col items-center justify-center gap-5 bg-white text-black p-20 rounded-2xl">
        <h1 className="text-2xl font-semibold">Welcome to Pathmentor</h1>
        <h2 className="text-lg">AI Career Planner | Roadmap Generator</h2>

        {/* Username/email input with validation */}
        <Input
          value={username}
          onChange={(e) => setusername(e.target.value)}
          placeholder="Enter your username or email"
          maxLength={100}
        />

        {/* Password input with validation */}
        <Input.Password
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          placeholder="Enter your password"
          maxLength={100}
        />

        {/* Login button with event handler */}
        <Button
          onClick={handleSignInWithEmailandPassword}
          className={`btn w-full bg-white`}
          disabled={loginDisabled}
        >
          Login
        </Button>

        <div className="flex flex-row w-full items-center justify-center gap-3">
          <hr className="w-1/2 text-gray-300" />
          <span className="text-sm">OR</span>
          <hr className="w-1/2 text-gray-300" />
        </div>

        {/* Google sign-in button with event handler */}
        <Button onClick={handleGoogleSignIn} className={`w-full bg-white`}>
          <img src={googleIcon} className="size-6" alt="" /> &nbsp; Login with
          Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
