import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/users/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(response.data.users);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load users. Please try again.";
        setError(message);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await API.delete(`/users/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Manage Users</h1>
      <div className="card shadow">
        <div className="card-body">
          {users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <ul className="list-group">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{user.name}</strong> <span className="text-muted">({user.role})</span>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
