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
  },[setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          LMS Platform
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            {user?.role === "student" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/courses">
                    My Courses
                  </Link>
                </li>
              </>
            )}
            {user?.role === "teacher" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher-dashboard">
                    Dashboard
                  </Link>
                </li>
              </>
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
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>
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
