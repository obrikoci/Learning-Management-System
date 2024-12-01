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
    <div className="container">
      <h2>My Courses</h2>
      <Link to="/create-course" className="btn btn-success my-3">
        Create New Course
      </Link>
      <ul className="list-group">
        {courses.map((course) => (
          <li key={course._id} className="list-group-item">
            <Link to={`/edit-course/${course._id}`}>{course.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherPage;
