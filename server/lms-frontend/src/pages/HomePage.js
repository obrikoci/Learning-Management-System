import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { UserContext } from "../context/UserContext";

const HomePage = () => {
  const { user } = useContext(UserContext); 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get("/courses/get-courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (!user) {
    return (
      <div className="container text-center mt-5 py-5">
        <h1 className="text-primary">Welcome to the LMS Platform</h1>
        <p className="lead text-muted">
          A platform for teachers to share their knowledge by creating and managing courses, 
          and for students to enroll and learn from them!
        </p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-primary btn-lg mx-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-outline-secondary btn-lg mx-2">
            Register
          </Link>
        </div>
        <hr className="my-5" />
        <h2 className="text-secondary">Please log in to view available courses.</h2>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5 mb-5">
      <h1 className="text-primary">Welcome to the LMS Platform</h1>
      <p className="lead text-muted">
        A platform for teachers to share their knowledge by creating and managing courses, 
        and for students to enroll and learn from them!
      </p>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : courses.length > 0 ? (
        <div className="row mt-4">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4 py-3">
              <div className="card shadow-sm my-3 h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{course.title}</h5>
                  <p className="card-text text-muted flex-grow-1">{course.description}</p>
                  <Link to={`/course/${course._id}`} className="btn btn-outline-primary mt-3">
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mt-4">No courses available at the moment.</p>
      )}
    </div>
  );
};

export default HomePage;
