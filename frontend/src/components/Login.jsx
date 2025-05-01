import React, { useEffect, useState } from "react";
import { auth, provider, signInWithPopup } from "../utils/Firebase";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/google-icon.svg";
import logo from "../assets/logo-trans.png";
import { Button, Input } from "antd";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loginDisabled, setloginDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (username == "" || password == "") {
      setloginDisabled(true);
    } else {
      setloginDisabled(false);
    }
  }, [username, password]);

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
      console.log(userInfo);
      window.location = "/dashboard";
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div className="flex flex-row items-center justify-evenly h-screen w-full gap-5 login fixed overflow-hidden">
      <div className="w-1/2"></div>
      <div className="flex flex-col items-center justify-center gap-5 bg-white p-20 rounded-2xl">
        <h1 className="text-2xl font-semibold">Welcome to Pathmentor</h1>
        <h2 className="text-lg">AI Career Planner | Roadmap Generator</h2>

        <Input placeholder="Enter your username or email" />

        <Input.Password placeholder="Enter your password" />

        <Button disabled={loginDisabled} className={`btn w-full bg-white`}>
          Login
        </Button>

        <div className="flex flex-row w-full items-center justify-center gap-3">
          <hr className="w-1/2 text-gray-300" />
          <span className="text-sm">OR</span>
          <hr className="w-1/2 text-gray-300" />
        </div>

        <Button onClick={handleGoogleSignIn} className={`btn w-full bg-white`}>
          <img src={googleIcon} className="size-6" alt="" /> &nbsp; Login with
          Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
