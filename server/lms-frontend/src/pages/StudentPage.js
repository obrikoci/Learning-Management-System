import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-enrolled-courses`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCourses(data.courses);
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div className="container">
      <h2>My Enrolled Courses</h2>
      <ul className="list-group">
        {courses.map((course) => (
          <li key={course._id} className="list-group-item">
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentPage;
