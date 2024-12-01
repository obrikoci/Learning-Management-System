import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const StudentPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses/student/courses`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
          }
        );

        setCourses(data.courses); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch enrolled courses.");
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!courses.length) {
    return <div className="alert alert-warning text-center">You are not enrolled in any courses yet.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">My Enrolled Courses</h2>
      <div className="row">
        {courses.map((course) => (
          <div key={course._id} className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
              <h5>
                <Link to={`/course/${course._id}`} className="text-decoration-none">
                    <strong>{course.title}</strong>
                </Link>
              </h5>
                <p className="card-text text-muted">{course.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPage;
