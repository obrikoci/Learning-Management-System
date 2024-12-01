import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams(); // Fetch course ID from URL params
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses/get-course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authorization
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

  if (loading) {
    return <div>Loading course details...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  if (!course) {
    return <div>No course found.</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{course.title}</h1>
      <p>
        <strong>Description:</strong> {course.description}
      </p>
      <p>
        <strong>Instructor:</strong> {course.instructor?.name || "Unknown"}
      </p>
      {course.courseData && course.courseData.length > 0 ? (
        <>
          <h3>Course Content:</h3>
          {course.courseData.map((content, index) => (
            <div key={index} className="mb-4">
              <h5>{content.title}</h5>
              <p>{content.description}</p>
              {content.videoUrl && (
                <a
                  href={content.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </a>
              )}
            </div>
          ))}
        </>
      ) : (
        <p>No course content available.</p>
      )}
    </div>
  );
};

export default CourseDetails;
