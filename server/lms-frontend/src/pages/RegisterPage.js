import React, { useState } from "react";
import API from "../utils/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/users/registration", formData);
      setMessage(data.message || "Registration successful.");
      setFormData({ name: "", email: "", password: "", role: "student" });
    } catch (err) {
      setMessage(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center text-primary mb-4">Register</h2>
        {message && (
          <div className={`alert ${loading ? "alert-info" : "alert-danger"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
