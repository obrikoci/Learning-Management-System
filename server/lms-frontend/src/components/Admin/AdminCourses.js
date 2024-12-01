import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get("/users/admin/courses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCourses(response.data.courses);
      } catch (err) {
        setError("Failed to load courses. Please try again.");
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    try {
      await API.delete(`/users/admin/course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (err) {
      alert("Failed to delete course.");
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Manage Courses</h1>
      <div className="card shadow">
        <div className="card-body">
          {courses.length === 0 ? (
            <p className="text-muted">No courses available.</p>
          ) : (
            <ul className="list-group">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{course.title}</span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
