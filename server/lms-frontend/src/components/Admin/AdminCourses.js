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
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div>
      <h1>Manage Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            {course.name}
            <button onClick={() => handleDelete(course._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCourses;
