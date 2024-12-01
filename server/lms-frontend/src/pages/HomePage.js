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
      <div className="container text-center">
        <h1>Welcome to the LMS Platform</h1>
        <p>
          A platform for teachers to share their knowledge by creating and managing courses, and for students
          to enroll and learn from them!
        </p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-primary mx-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary mx-2">
            Register
          </Link>
        </div>
        <hr />
        <h2>Please log in to view available courses.</h2>
      </div>
    );
  }

  return (
    <div className="container text-center">
      <h1>Welcome to the LMS Platform</h1>
      <p>
        A platform for teachers to share their knowledge by creating and managing courses, and for students
        to enroll and learn from them!
      </p>
      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : courses.length > 0 ? (
        <div className="row mt-4">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <div className="card my-3">
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text">{course.description}</p>
                  <Link to={`/course/${course._id}`} className="btn btn-primary">
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses available at the moment.</p>
      )}
    </div>
  );
};

export default HomePage;
