import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Shared/Navbar";
import Footer from "./components/Shared/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import TeacherDashboard from "./components/Dashboard/TeacherDashboard";
import CreateCourse from "./components/Courses/CreateCourse";
import EditCourse from "./components/Courses/EditCourse";
import CourseList from "./components/Courses/CourseList";
import CourseDetails from "./components/Courses/CourseDetails";
import AdminUsers from "./components/Admin/AdminUsers"; // Import AdminUsers
import AdminCourses from "./components/Admin/AdminCourses"; // Import AdminCourses
import { UserContext } from "./context/UserContext";
import ActivateAccount from "./components/Auth/ActivateAcc";
import axios from "axios";

// Protected Route Component for Role-Based Access
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      // console.log(token)
      if (token) {
        try {
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // console.log("Logged-in user:", data.user);
        } catch (error) {
          console.error("Failed to verify user:", error);
        }
      }
    };

    verifyUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate-account" element={<ActivateAccount />} />{" "}
          {/* Activation Route */}
          {/* Teacher-Specific Routes */}
          <Route
            path="/teacher-page"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <TeacherPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-course"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          {/* Student-Specific Routes */}
          <Route
            path="/student-page"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentPage />
              </ProtectedRoute>
            }
          />
          {/* Admin-Specific Routes */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          {/* Shared Routes */}
          <Route
            path="/edit-course/:id"
            element={
              <ProtectedRoute roles={["teacher", "admin"]}>
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute roles={["teacher", "student", "admin"]}>
                <CourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:id"
            element={
              <ProtectedRoute roles={["teacher", "student", "admin"]}>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          {/* Fallback Route for Undefined Paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
