import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { UserContext } from "../../context/UserContext";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [course, setCourse] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user has the right role
    if (!["teacher", "admin"].includes(user?.role)) {
      alert("Only teachers and admins can edit courses.");
      navigate("/");
      return;
    }

    // Fetch course data
    const fetchCourse = async () => {
      try {
        const response = await API.get(`/courses/get-course/${id}`);
        const fetchedCourse = response.data.course;

        // Check if teacher is trying to edit their own course
        if (user.role === "teacher" && user.id !== fetchedCourse.instructor._id) {
          alert("You can only edit your own courses.");
          navigate("/");
          return;
        }

        setCourse({
          title: fetchedCourse.title,
          description: fetchedCourse.description,
        });
      } catch (error) {
        console.error("Error fetching course details:", error);
        alert("Failed to fetch course details.");
        navigate("/");
      }
    };

    fetchCourse();
  }, [id, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await API.put(`/courses/edit-course/${id}`, course, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating course:", error);
      setError(error.response?.data?.message || "Failed to update the course.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h1 className="text-center text-primary mb-4">Edit Course</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="form-control"
                value={course.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Course Description
              </label>
              <textarea
                name="description"
                id="description"
                className="form-control"
                value={course.description}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary w-50">
                Update Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
