import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { UserContext } from "../../context/UserContext";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [course, setCourse] = useState({
    name: "",
    description: "",
    prerequisites: [],
    benefits: [],
    courseData: [],
  });

  useEffect(() => {
    // Check if user has the right role
    if (!["teacher", "admin"].includes(user?.role)) {
      alert("Only teachers and admins can edit courses.");
      navigate("/"); // Redirect unauthorized users
      return;
    }

    // Fetch course data
    const fetchCourse = async () => {
      try {
        const response = await API.get(`/courses/${id}`);
        const fetchedCourse = response.data.course;

        // Check if teacher is trying to edit their own course
        if (user.role === "teacher" && user._id !== fetchedCourse.instructor._id) {
          alert("You can only edit your own courses.");
          navigate("/courses"); // Redirect unauthorized teachers
          return;
        }

        setCourse(fetchedCourse);
      } catch (error) {
        alert("Failed to fetch course details.");
        navigate("/courses"); // Redirect if course fetch fails
      }
    };

    fetchCourse();
  }, [id, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/edit-course/${id}`, course);
      alert("Course updated successfully!");
      navigate("/courses");
    } catch (error) {
      alert("Failed to update the course.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  return (
    <div>
      <h1>Edit Course</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={course.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Description</label>
          <textarea
            name="description"
            className="form-control"
            value={course.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Course
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
