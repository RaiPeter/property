import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axiosInstance from "./interceptor/interceptor";
import "./Signup.css"

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const data1 = {
    username,
    email,
    password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post("/auth/signup", data1);
      navigate("/");
      console.log("Form Submitted",data);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
};

export default Signup;
