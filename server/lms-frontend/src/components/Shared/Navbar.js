import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.REACT_APP_API_URL;
      if (token) {
        try {
          const { data } = await axios.get(`${apiUrl}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(data.user);
        } catch (error) {
          console.error("Failed to verify user:", error);
        }
      }
    };

    verifyUser();
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          LMS Platform
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user?.role === "student" && (
              <li className="nav-item">
                <Link className="nav-link" to="/student/courses">
                  My Courses
                </Link>
              </li>
            )}
            {user?.role === "teacher" && (
              <li className="nav-item">
                <Link className="nav-link" to="/teacher-dashboard">
                  Dashboard
                </Link>
              </li>
            )}
            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/courses">
                    Manage Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">
                    Manage Users
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm ms-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
