import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import { UserContext } from "../../context/UserContext";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get("/courses");
        setCourses(response.data.courses);
      } catch (error) {
        alert("Failed to fetch courses.");
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`/users/admin/course/${id}`);
      alert("Course deleted successfully!");
      setCourses(courses.filter((course) => course._id !== id));
    } catch (error) {
      alert("Failed to delete course!");
    }
  };

  return (
    <div>
      <h1>Course List</h1>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div>
          {courses.map((course) => (
            <div key={course._id} className="card my-3">
              <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <p className="card-text">{course.description}</p>

                <div>
                  <Link to={`/course/${course._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>

                {/* Edit and Delete Options */}
                {user?.role === "admin" || (user?.role === "teacher" && user._id === course.instructor._id) ? (
                  <div className="mt-3">
                    <Link
                      to={`/edit-course/${course._id}`}
                      className="btn btn-warning me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
