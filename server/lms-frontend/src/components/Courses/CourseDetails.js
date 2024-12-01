import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const CourseDetails = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams(); 
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollMessage, setEnrollMessage] = useState(""); 

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses/get-course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
          }
        );
        setCourse(response.data.course);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/courses/enroll/${id}`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        }
      );

      setEnrollMessage(response.data.message);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      setEnrollMessage(
        error.response?.data?.message || "Failed to enroll in the course."
      );
    }
  };

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

  if (!course) {
    return <div className="alert alert-warning text-center">No course found.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h1 className="mb-4 text-primary">{course.title}</h1>
          <p>
            <strong>Description:</strong> {course.description}
          </p>
          <p>
            <strong>Instructor:</strong> {course.instructor?.name || "Unknown"}
          </p>
          {course.courseData && course.courseData.length > 0 ? (
            <>
              <h3 className="mt-4">Course Content</h3>
              <ul className="list-group">
                {course.courseData.map((content, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h5>{content.title}</h5>
                      <p>{content.description}</p>
                    </div>
                    {content.videoUrl && (
                      <a
                        href={content.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Watch Video
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-muted">No course content available.</p>
          )}

          {user?.role === "student" && (
            <>
              <button
                className="btn btn-primary mt-4"
                onClick={handleEnroll}
                disabled={!!enrollMessage} 
              >
                Enroll
              </button>

              {enrollMessage && <p className="mt-3 text-info">{enrollMessage}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
