import React, { useState } from "react";
import axios from "axios";

const CreateCourse = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/courses/create-course`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Course created successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course!");
      setSuccess("");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4 text-primary">Create a New Course</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Course Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                placeholder="Enter course title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Course Description</label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Enter course description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="5"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary w-50">Create Course</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
