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
          return <p>Access denied: Only teachers can view this page.</p>;
        };        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses/teacher/courses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        // Handle empty courses
        if (response.data.courses.length === 0) {
          setError("You have not created any courses yet.");
        } else {
          setCourses(response.data.courses);
          setError(null); // Clear previous error
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
      <h1>Teacher Dashboard</h1>
      <Link to="/create-course" className="btn btn-primary mb-4">
        Create New Course
      </Link>
      <h3>Your Courses:</h3>
      {loading ? (
        <p>Loading your courses...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : courses.length > 0 ? (
        <ul className="list-group">
          {courses.map((course) => (
            <li
              key={course._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <Link to={`/course-details/${course._id}`}>{course.title}</Link>
              <div>
                <Link
                  to={`/edit-course/${course._id}`}
                  className="btn btn-secondary btn-sm ml-2"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not created any courses yet.</p>
      )}
    </div>
  );
};

export default TeacherDashboard;
