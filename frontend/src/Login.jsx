import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import axiosInstance from "./interceptor/interceptor.js";
import { loginUser } from "./features/slices/authSlice.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const data1 = {
    email,
    password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post("/auth/login", data1);
      console.log("Form Submitted", data);

      // Cookies.set("accessToken", accessToken);
      // Cookies.set("refreshToken", refreshToken);
      console.log(auth,'auth');
      dispatch(loginUser(data.user));
      console.log(auth);

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <Link to="/signup">Don't have an account? Signup</Link>
      </form>
    </div>
  );
};

export default Login;
