import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TeacherPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/teacher/courses`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCourses(data.courses);
    };

    fetchCourses();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">My Courses</h2>
        <Link to="/create-course" className="btn btn-success">
          Create New Course
        </Link>
      </div>
      {courses.length > 0 ? (
        <div className="list-group">
          {courses.map((course) => (
            <Link
              to={`/edit-course/${course._id}`}
              key={course._id}
              className="list-group-item list-group-item-action"
            >
              <h5 className="mb-1 text-primary">{course.name}</h5>
            </Link>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning text-center">
          You have not created any courses yet.
        </div>
      )}
    </div>
  );
};

export default TeacherPage;
