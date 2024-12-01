import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (userRole !== "teacher") {
          setError("Access denied: Only teachers can view this page.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses/teacher/courses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.data.courses || response.data.courses.length === 0) {
          setError("You have not created any courses yet.");
          setCourses([]);
        } else {
          setCourses(response.data.courses);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized: Please log in again.");
        } else if (err.response?.status === 403) {
          setError("Access denied: Only teachers can view this page.");
        } else {
          setError("Failed to load courses. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userRole]);

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h1 className="text-primary text-center mb-4">Teacher Dashboard</h1>

          <div className="text-center mb-4">
            <Link to="/create-course" className="btn btn-primary">
              Create New Course
            </Link>
          </div>

          <h3 className="mb-4">Your Courses</h3>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your courses...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : courses.length > 0 ? (
            <ul className="list-group">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <Link to={`/course/${course._id}`} className="text-decoration-none">
                    <strong>{course.title}</strong>
                  </Link>
                  <div>
                    <Link
                      to={`/edit-course/${course._id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted">You have not created any courses yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
