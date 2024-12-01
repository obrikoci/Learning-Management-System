import React, { useState } from "react";
import API from "../../utils/api"; 

const Login = () => {
  // Manage state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/login", { email, password });
      // Handle successful login (e.g., save token and redirect)
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("role", response.data.role); // Save user role for role-based access
      alert("Login successful!");
      window.location.href = "/dashboard"; // Redirect after login
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed. Please check credentials.";
      alert(errorMsg);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email} // Bind value to state
            onChange={(e) => setEmail(e.target.value)} // Update state on input change
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password} // Bind value to state
            onChange={(e) => setPassword(e.target.value)} // Update state on input change
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
